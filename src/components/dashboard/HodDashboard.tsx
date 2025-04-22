
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, Users, BookOpen, BarChart } from 'lucide-react';

const HodDashboard = () => {
  const { user } = useAuth();
  const [departmentData, setDepartmentData] = useState<any>(null);
  const [facultyCount, setFacultyCount] = useState(0);
  const [coursesCount, setCoursesCount] = useState(0);
  const [loading, setLoading] = useState(true);

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
      <h2 className="text-3xl font-bold">Department Head Dashboard</h2>
      
      {departmentData ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>{departmentData.name} ({departmentData.code})</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{departmentData.description || 'No department description available.'}</p>
            </CardContent>
          </Card>
          
          <div className="grid gap-4 md:grid-cols-3">
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
                <CardTitle className="text-sm font-medium">Department Metrics</CardTitle>
                <BarChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">85%</div>
                <p className="text-xs text-muted-foreground">Faculty satisfaction</p>
              </CardContent>
            </Card>
          </div>
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
