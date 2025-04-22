
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, BookOpen, Clock, FileText } from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [facultyData, setFacultyData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFacultyData = async () => {
      if (!user) return;
      
      setLoading(true);
      try {
        // Get faculty profile data
        const { data: facultyProfile, error: profileError } = await supabase
          .from('faculty_members')
          .select(`
            *,
            departments:department_id (name)
          `)
          .eq('user_id', user.id)
          .single();
          
        if (profileError) throw profileError;
        
        if (facultyProfile) {
          setFacultyData(facultyProfile);
          
          // Get faculty courses
          const { data: coursesData, error: coursesError } = await supabase
            .from('courses')
            .select('*')
            .eq('faculty_id', facultyProfile.id);
            
          if (coursesError) throw coursesError;
          
          setCourses(coursesData || []);
        }
      } catch (error) {
        console.error('Error fetching faculty data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFacultyData();
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
      <h2 className="text-3xl font-bold">Faculty Dashboard</h2>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>My Profile</CardTitle>
          </CardHeader>
          <CardContent>
            {facultyData ? (
              <div className="space-y-2">
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Name</span>
                  <span className="font-medium">{facultyData.first_name} {facultyData.last_name}</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Email</span>
                  <span className="font-medium">{facultyData.email}</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Title</span>
                  <span className="font-medium">{facultyData.title || 'Not specified'}</span>
                </div>
                
                <div className="flex flex-col space-y-1">
                  <span className="text-sm text-muted-foreground">Department</span>
                  <span className="font-medium">{facultyData.departments?.name || 'Not assigned'}</span>
                </div>
                
                {facultyData.office_location && (
                  <div className="flex flex-col space-y-1">
                    <span className="text-sm text-muted-foreground">Office</span>
                    <span className="font-medium">{facultyData.office_location}</span>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-muted-foreground">Faculty profile not found. Please contact administration.</p>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Teaching Load</CardTitle>
          </CardHeader>
          <CardContent>
            {courses.length > 0 ? (
              <div className="space-y-4">
                {courses.map((course) => (
                  <div key={course.id} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">{course.code}: {course.name}</span>
                      <span className="text-sm text-muted-foreground">{course.credits} credits</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {course.semester} {course.year}
                    </p>
                    <Separator />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No courses assigned yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
            <p className="text-xs text-muted-foreground">Current teaching load</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Office Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">Hours per week</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Publications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Research publications</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FacultyDashboard;
