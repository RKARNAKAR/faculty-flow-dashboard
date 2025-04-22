
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RoleManagement from './RoleManagement';
import TeachingLoadManager from './TeachingLoadManager';
import { Users, BookOpen, Layers, Award, BarChart2, Settings, User, FileText, Database } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  
  useEffect(() => {
    // Let the user know the dashboard is loaded
    console.log("Admin dashboard loaded");
    toast({
      title: "Admin Dashboard",
      description: "Admin dashboard loaded successfully",
    });
  }, []);

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
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Active faculty members</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Layers className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5</div>
            <p className="text-xs text-muted-foreground">Academic departments</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">32</div>
            <p className="text-xs text-muted-foreground">Current semester</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">128</div>
            <p className="text-xs text-muted-foreground">Validated certificates</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview" className="w-full" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="faculty">Faculty Management</TabsTrigger>
          <TabsTrigger value="workloads">Teaching Loads</TabsTrigger>
          <TabsTrigger value="settings">System Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4 mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Faculty Management
                </CardTitle>
                <CardDescription>Manage faculty members and their roles</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Dr. Anjali Sharma</p>
                        <p className="text-sm text-muted-foreground">Faculty - Computer Science</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage Role
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-medium">Dr. John Miller</p>
                        <p className="text-sm text-muted-foreground">HOD - Mathematics</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Manage Role
                    </Button>
                  </div>
                  
                  <Button className="w-full" size="sm" onClick={() => {
                    toast({
                      title: "Feature Coming Soon",
                      description: "This feature is under development",
                    });
                  }}>
                    <Users className="h-4 w-4 mr-2" />
                    View All Faculty
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Teaching Load Assignment
                </CardTitle>
                <CardDescription>Manage course allocations for the current semester</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">CS101 - Introduction to Programming</p>
                      <p className="text-sm text-muted-foreground">3 credits - Fall 2024</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Assign Faculty
                    </Button>
                  </div>
                  
                  <div className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50">
                    <div>
                      <p className="font-medium">CS202 - Data Structures</p>
                      <p className="text-sm text-muted-foreground">4 credits - Fall 2024</p>
                    </div>
                    <Button variant="outline" size="sm">
                      Assign Faculty
                    </Button>
                  </div>
                  
                  <Button className="w-full" size="sm" onClick={() => {
                    toast({
                      title: "Feature Coming Soon",
                      description: "This feature is under development",
                    });
                  }}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    View All Courses
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="faculty">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Faculty Management</CardTitle>
              <CardDescription>
                Manage faculty profiles, certifications, and workload
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="bg-slate-100 p-6 flex justify-center">
                        <User className="h-20 w-20 text-slate-400" />
                      </div>
                      <CardContent className="p-4">
                        <h4 className="font-semibold">Dr. Faculty Member {i}</h4>
                        <p className="text-sm text-muted-foreground">Department {i % 3 + 1}</p>
                        <div className="flex justify-between items-center mt-4">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                            {i % 2 === 0 ? 'Faculty' : 'HOD'}
                          </span>
                          <Button variant="ghost" size="sm">View Profile</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Faculty Data
                  </Button>
                  <Button>
                    <Users className="h-4 w-4 mr-2" />
                    Add New Faculty
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="workloads">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Teaching Load Management</CardTitle>
              <CardDescription>
                Assign and manage teaching loads across departments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="rounded-lg border overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Credits</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned Faculty</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {[
                        { id: 1, code: 'CS101', name: 'Introduction to Programming', credits: 3, dept: 'Computer Science', faculty: 'Dr. John Miller' },
                        { id: 2, code: 'CS202', name: 'Data Structures', credits: 4, dept: 'Computer Science', faculty: 'Dr. Anjali Sharma' },
                        { id: 3, code: 'MATH101', name: 'Calculus I', credits: 3, dept: 'Mathematics', faculty: 'Dr. Sarah Johnson' },
                        { id: 4, code: 'PHY101', name: 'Physics I', credits: 4, dept: 'Physics', faculty: 'Dr. Michael Lee' },
                        { id: 5, code: 'ENG101', name: 'Technical Writing', credits: 2, dept: 'English', faculty: 'Not Assigned' },
                      ].map((course) => (
                        <tr key={course.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium">{course.code}</div>
                            <div className="text-sm text-gray-500">{course.name}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">{course.credits}</td>
                          <td className="px-6 py-4 whitespace-nowrap">{course.dept}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {course.faculty !== 'Not Assigned' ? (
                              <span className="font-medium">{course.faculty}</span>
                            ) : (
                              <span className="text-red-500 font-medium">Not Assigned</span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button size="sm" variant={course.faculty !== 'Not Assigned' ? 'outline' : 'default'}>
                              {course.faculty !== 'Not Assigned' ? 'Reassign' : 'Assign Faculty'}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-between">
                  <Button variant="outline">
                    <FileText className="h-4 w-4 mr-2" />
                    Export Teaching Load Data
                  </Button>
                  <Button>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Add New Course
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="settings">
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <CardDescription>
                Configure system-wide settings and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Database className="h-5 w-5" />
                        Academic Year Configuration
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Current Semester</label>
                            <div className="mt-1 p-3 border rounded-md bg-gray-50">Fall 2024</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium">Academic Year</label>
                            <div className="mt-1 p-3 border rounded-md bg-gray-50">2024-2025</div>
                          </div>
                        </div>
                        <Button variant="outline" className="w-full" size="sm">
                          Update Academic Calendar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Settings className="h-5 w-5" />
                        System Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">Automatic Faculty Notifications</h4>
                            <p className="text-sm text-muted-foreground">Email updates about workload changes</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="h-4 w-4 bg-green-500 rounded-full"></div>
                            <span className="text-sm font-medium">Enabled</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div>
                            <h4 className="font-medium">Data Backup Frequency</h4>
                            <p className="text-sm text-muted-foreground">How often system data is backed up</p>
                          </div>
                          <div className="text-sm font-medium">Daily</div>
                        </div>
                        <Button variant="outline" className="w-full" size="sm">
                          Manage System Settings
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;
