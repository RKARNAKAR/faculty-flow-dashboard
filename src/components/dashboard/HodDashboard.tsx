import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Users, BookOpen, BarChart2, Award, FileText } from 'lucide-react';

const HodDashboard = () => {
  const { user } = useAuth();
  const [departmentData, setDepartmentData] = useState<any>(null);
  const [facultyCount, setFacultyCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [certificationsCount, setCertificationsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchDepartmentData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get HOD's department
        const { data: userRole, error: roleError } = await supabase
          .from('user_roles')
          .select(`
            department_id
          `)
          .eq('user_id', user.id)
          .single();
          
        if (roleError) throw roleError;
        
        if (userRole?.department_id) {
          // Get department data
          const { data: department, error: deptError } = await supabase
            .from('departments')
            .select('*')
            .eq('id', userRole.department_id)
            .single();
            
          if (deptError) throw deptError;
          setDepartmentData(department);
          
          // Get faculty count
          const { count: facultyMemberCount } = await supabase
            .from('faculty_members')
            .select('*', { count: 'exact', head: true })
            .eq('department_id', userRole.department_id);
            
          setFacultyCount(facultyMemberCount || 0);
          
          // Get courses count
          const { count: departmentCourses } = await supabase
            .from('courses')
            .select('*', { count: 'exact', head: true })
            .eq('department_id', userRole.department_id);
            
          setCoursesCount(departmentCourses || 0);
          
          // For demo purposes, simulate certification count
          setCertificationsCount(12);
        }
      } catch (error) {
        console.error('Error fetching department data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDepartmentData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a237e]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold">Department Head Dashboard</h2>
        <Button>Generate Department Report</Button>
      </div>
      
      {departmentData ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{departmentData.name} Department Overview</CardTitle>
              <CardDescription>
                Monitor department performance and faculty management
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>As the Department Head, you can review faculty data, manage teaching loads, and generate reports.</p>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{facultyCount}</div>
                <p className="text-xs text-muted-foreground">Active faculty in department</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Courses</CardTitle>
                <BookOpen className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{coursesCount}</div>
                <p className="text-xs text-muted-foreground">Department courses</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Certifications</CardTitle>
                <Award className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{certificationsCount}</div>
                <p className="text-xs text-muted-foreground">Faculty certifications</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Department Metrics</CardTitle>
                <BarChart2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Faculty satisfaction</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="faculty" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="faculty">Faculty Overview</TabsTrigger>
              <TabsTrigger value="teaching">Teaching Loads</TabsTrigger>
              <TabsTrigger value="reports">Department Reports</TabsTrigger>
            </TabsList>
            
            <TabsContent value="faculty" className="space-y-4 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Faculty</CardTitle>
                  <CardDescription>
                    Review and manage department faculty members
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="border rounded-md p-4 text-center text-muted-foreground">
                    Department faculty listing would be displayed here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="teaching" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Teaching Load Distribution</CardTitle>
                  <CardDescription>
                    Manage and evaluate teaching loads for department faculty
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Review and adjust teaching loads across the department to ensure balanced workload distribution.
                  </p>
                  <div className="flex justify-end mb-4">
                    <Button>Request Load Adjustment</Button>
                  </div>
                  <div className="border rounded-md p-4 text-center text-muted-foreground">
                    Teaching load distribution chart and details would be displayed here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reports" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Department Reports</CardTitle>
                  <CardDescription>
                    Generate and review department performance reports
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Generate and export departmental reports on faculty performance, certifications, and teaching loads.
                  </p>
                  <div className="flex justify-end mb-4 space-x-2">
                    <Button variant="outline">Filter Data</Button>
                    <Button>Generate Report</Button>
                  </div>
                  <div className="border rounded-md p-4 text-center text-muted-foreground">
                    Report generation interface would be displayed here
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <Card>
          <CardContent className="py-4">
            <p className="text-muted-foreground">No department assigned. Please contact administration.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default HodDashboard;
