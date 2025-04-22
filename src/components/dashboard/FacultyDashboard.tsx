import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, BookOpen, Clock, FileText, Award, Upload, Edit } from 'lucide-react';

const FacultyDashboard = () => {
  const { user } = useAuth();
  const [facultyData, setFacultyData] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [certifications, setCertifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("profile");

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
          
          // Mock certifications data for demo
          setCertifications([
            { id: 1, title: 'Advanced Teaching Methods', issuer: 'Education Board', date: '2023-05-15', verified: true },
            { id: 2, title: 'Research Methodology', issuer: 'National Research Council', date: '2022-11-08', verified: true },
            { id: 3, title: 'Digital Learning Tools', issuer: 'EdTech Association', date: '2024-01-22', verified: false }
          ]);
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
      
      <Tabs defaultValue="profile" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile">My Profile</TabsTrigger>
          <TabsTrigger value="teaching">Teaching Load</TabsTrigger>
          <TabsTrigger value="certifications">Certifications</TabsTrigger>
          <TabsTrigger value="reports">My Reports</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile" className="space-y-6 mt-6">
          {facultyData ? (
            <>
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Personal Information</CardTitle>
                    <Button variant="outline" size="sm" className="flex items-center gap-1">
                      <Edit className="h-4 w-4" />
                      <span>Edit Profile</span>
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Full Name</span>
                        <span className="font-medium">{facultyData.title} {facultyData.first_name} {facultyData.last_name}</span>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Email Address</span>
                        <span className="font-medium">{facultyData.email}</span>
                      </div>
                      
                      <div className="flex flex-col space-y-1">
                        <span className="text-sm text-muted-foreground">Department</span>
                        <span className="font-medium">{facultyData.departments?.name || 'Not assigned'}</span>
                      </div>
                      
                      {facultyData.office_location && (
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-muted-foreground">Office Location</span>
                          <span className="font-medium">{facultyData.office_location}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      {facultyData.phone && (
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-muted-foreground">Phone Number</span>
                          <span className="font-medium">{facultyData.phone}</span>
                        </div>
                      )}
                      
                      {facultyData.bio && (
                        <div className="flex flex-col space-y-1">
                          <span className="text-sm text-muted-foreground">Biography</span>
                          <span className="text-sm">{facultyData.bio}</span>
                        </div>
                      )}
                      
                      <div className="flex flex-col space-y-1 mt-4">
                        <span className="text-sm text-muted-foreground">Profile Completeness</span>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: '85%' }}></div>
                        </div>
                        <span className="text-xs text-muted-foreground">85% complete - Add your research interests to complete your profile</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4 flex justify-end">
                  <Button>Update Profile</Button>
                </CardFooter>
              </Card>
            </>
          ) : (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">Faculty profile not found. Please contact administration.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="teaching" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Current Teaching Load</CardTitle>
                  <CardDescription>Your assigned courses for the current semester</CardDescription>
                </div>
                <Button variant="outline">Download Schedule</Button>
              </div>
            </CardHeader>
            <CardContent>
              {courses.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 font-medium text-sm text-muted-foreground">
                    <div>Course Code</div>
                    <div>Course Name</div>
                    <div>Credits</div>
                    <div>Semester</div>
                  </div>
                  <Separator />
                  {courses.map((course) => (
                    <div key={course.id} className="space-y-2">
                      <div className="grid grid-cols-4">
                        <div className="font-medium">{course.code}</div>
                        <div>{course.name}</div>
                        <div>{course.credits} credits</div>
                        <div>{course.semester} {course.year}</div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                  
                  <div className="pt-4">
                    <Card className="bg-muted">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">Total Teaching Load</h4>
                            <p className="text-sm text-muted-foreground">Current academic semester</p>
                          </div>
                          <div className="text-2xl font-bold">
                            {courses.reduce((acc, course) => acc + course.credits, 0)} credits
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No courses assigned yet for this semester.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="certifications" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Certifications</CardTitle>
                  <CardDescription>Upload and manage your professional certifications</CardDescription>
                </div>
                <Button>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload New
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {certifications.length > 0 ? (
                <div className="space-y-6">
                  <div className="grid grid-cols-4 font-medium text-sm text-muted-foreground">
                    <div>Certificate Title</div>
                    <div>Issuing Authority</div>
                    <div>Issue Date</div>
                    <div>Status</div>
                  </div>
                  <Separator />
                  {certifications.map((cert) => (
                    <div key={cert.id} className="space-y-2">
                      <div className="grid grid-cols-4">
                        <div className="font-medium">{cert.title}</div>
                        <div>{cert.issuer}</div>
                        <div>{new Date(cert.date).toLocaleDateString()}</div>
                        <div>
                          {cert.verified ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Verified
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                              Pending
                            </span>
                          )}
                        </div>
                      </div>
                      <Separator />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <p className="text-muted-foreground">No certifications uploaded yet.</p>
                  <Button variant="outline" className="mt-4">Upload Your First Certificate</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>My Performance Reports</CardTitle>
                  <CardDescription>View your workload and performance analytics</CardDescription>
                </div>
                <Button variant="outline">Download Reports</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Teaching Hours</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">42</div>
                      <p className="text-xs text-muted-foreground">Hours per month</p>
                      <div className="mt-2 text-xs text-green-600">+8% from previous semester</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Student Feedback</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">4.8/5.0</div>
                      <p className="text-xs text-muted-foreground">Average rating</p>
                      <div className="mt-2 text-xs text-green-600">+0.3 from previous semester</div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">Research Output</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">3</div>
                      <p className="text-xs text-muted-foreground">Publications this year</p>
                      <div className="mt-2 text-xs text-amber-600">Same as last year</div>
                    </CardContent>
                  </Card>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Performance Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-60 border rounded-md flex items-center justify-center text-muted-foreground">
                      Performance charts and graphs would be displayed here
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <Button variant="outline" size="sm">View Detailed Analytics</Button>
                      <Button variant="outline" size="sm">Export to PDF</Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacultyDashboard;
