
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Users, BookOpen, Layers, Award, BarChart2, Shield, Settings } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    facultyCount: 0,
    departmentsCount: 0,
    coursesCount: 0,
    certificationsCount: 0
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      try {
        // Get faculty count
        const { count: facultyCount } = await supabase
          .from('faculty_members')
          .select('*', { count: 'exact', head: true });
        
        // Get departments count
        const { count: departmentsCount } = await supabase
          .from('departments')
          .select('*', { count: 'exact', head: true });
        
        // Get courses count
        const { count: coursesCount } = await supabase
          .from('courses')
          .select('*', { count: 'exact', head: true });

        // For demo purposes, simulate certification count
        const certificationsCount = 45;

        setStats({
          facultyCount: facultyCount || 0,
          departmentsCount: departmentsCount || 0,
          coursesCount: coursesCount || 0,
          certificationsCount: certificationsCount
        });
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

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
        <h2 className="text-3xl font-bold">Admin Dashboard</h2>
        <div className="space-x-2">
          <Button variant="outline">Export Reports</Button>
          <Button>+ Add Faculty</Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Faculty Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.facultyCount}</div>
            <p className="text-xs text-muted-foreground">Registered faculty members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.departmentsCount}</div>
            <p className="text-xs text-muted-foreground">Academic departments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.coursesCount}</div>
            <p className="text-xs text-muted-foreground">Total courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.certificationsCount}</div>
            <p className="text-xs text-muted-foreground">Validated certifications</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="faculty">Faculty Management</TabsTrigger>
          <TabsTrigger value="workloads">Teaching Loads</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Administrative Overview</CardTitle>
              <CardDescription>
                System-wide overview and recent activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Recent Activities</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <span>Dr. Sharma uploaded new certification</span>
                          <span className="text-xs text-muted-foreground">2 hours ago</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Teaching load updated for CS Department</span>
                          <span className="text-xs text-muted-foreground">Yesterday</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>New faculty member added</span>
                          <span className="text-xs text-muted-foreground">3 days ago</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">System Notifications</CardTitle>
                    </CardHeader>
                    <CardContent className="text-sm">
                      <ul className="space-y-2">
                        <li className="flex justify-between items-center">
                          <span>End of semester reports due</span>
                          <span className="text-xs text-muted-foreground">5 days remaining</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>Certificate validation required</span>
                          <span className="text-xs text-muted-foreground">12 pending</span>
                        </li>
                        <li className="flex justify-between items-center">
                          <span>System update scheduled</span>
                          <span className="text-xs text-muted-foreground">Next Sunday</span>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm">Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <Button variant="outline" size="sm" className="flex flex-col h-20 items-center justify-center">
                        <Users className="h-5 w-5 mb-1" />
                        <span>Add Faculty</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex flex-col h-20 items-center justify-center">
                        <BookOpen className="h-5 w-5 mb-1" />
                        <span>Assign Load</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex flex-col h-20 items-center justify-center">
                        <Award className="h-5 w-5 mb-1" />
                        <span>Validate Certs</span>
                      </Button>
                      <Button variant="outline" size="sm" className="flex flex-col h-20 items-center justify-center">
                        <BarChart2 className="h-5 w-5 mb-1" />
                        <span>Generate Report</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="faculty" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Faculty Management</CardTitle>
              <CardDescription>
                Add, edit, and manage faculty information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                This section allows you to manage faculty profiles, verify certifications, and assign roles.
              </p>
              <div className="flex justify-end mb-4">
                <Button>+ Add New Faculty</Button>
              </div>
              <div className="border rounded-md p-4 text-center text-muted-foreground">
                Faculty listing table would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workloads" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Teaching Load Management</CardTitle>
              <CardDescription>
                Assign and manage teaching loads across departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Here you can assign courses to faculty members and manage departmental workloads.
              </p>
              <div className="flex justify-end mb-4">
                <Button>Assign New Course</Button>
              </div>
              <div className="border rounded-md p-4 text-center text-muted-foreground">
                Teaching load assignment interface would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Performance Reports</CardTitle>
              <CardDescription>
                Generate and export faculty performance and workload reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Generate comprehensive reports on faculty performance, workload distribution, and certification status.
              </p>
              <div className="flex justify-end mb-4 space-x-2">
                <Button variant="outline">Filter Reports</Button>
                <Button>Generate Report</Button>
              </div>
              <div className="border rounded-md p-4 text-center text-muted-foreground">
                Report generation interface would be displayed here
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
