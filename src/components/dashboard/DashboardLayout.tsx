
import React from 'react';
import DashboardHeader from './DashboardHeader';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger
} from "@/components/ui/sidebar";
import { 
  Users, 
  BookOpen, 
  FileText, 
  User, 
  BarChart2, 
  Award, 
  Settings, 
  Shield,
  Mail,
  Upload,
  Chart 
} from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: string;
  userName: string;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, userRole, userName }) => {
  return (
    <div className="min-h-screen">
      <DashboardHeader userRole={userRole} userName={userName} />
      <SidebarProvider>
        <div className="flex h-[calc(100vh-4rem)] w-full">
          <Sidebar>
            <SidebarContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild tooltip="Profile">
                    <a href="#profile" className="flex items-center space-x-2">
                      <User className="h-5 w-5" />
                      <span>Profile</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
                
                {/* Admin-specific menu items */}
                {userRole === 'Admin' && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Manage Faculty">
                        <a href="#faculty-management" className="flex items-center space-x-2">
                          <Users className="h-5 w-5" />
                          <span>Faculty Management</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Teaching Loads">
                        <a href="#teaching-loads" className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5" />
                          <span>Teaching Loads</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Certifications">
                        <a href="#certifications" className="flex items-center space-x-2">
                          <Award className="h-5 w-5" />
                          <span>Certifications</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="System Settings">
                        <a href="#settings" className="flex items-center space-x-2">
                          <Settings className="h-5 w-5" />
                          <span>System Settings</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Performance Reports">
                        <a href="#reports" className="flex items-center space-x-2">
                          <BarChart2 className="h-5 w-5" />
                          <span>Performance Reports</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
                
                {/* Faculty-specific menu items */}
                {userRole === 'Faculty' && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Upload Certifications">
                        <a href="#upload-certifications" className="flex items-center space-x-2">
                          <Upload className="h-5 w-5" />
                          <span>Upload Certifications</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Teaching Load">
                        <a href="#my-teaching-load" className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5" />
                          <span>My Teaching Load</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="My Reports">
                        <a href="#my-reports" className="flex items-center space-x-2">
                          <FileText className="h-5 w-5" />
                          <span>My Reports</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
                
                {/* HOD-specific menu items */}
                {userRole === 'HOD' && (
                  <>
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Department Overview">
                        <a href="#department-overview" className="flex items-center space-x-2">
                          <Chart className="h-5 w-5" />
                          <span>Department Overview</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Faculty Monitoring">
                        <a href="#faculty-monitoring" className="flex items-center space-x-2">
                          <Users className="h-5 w-5" />
                          <span>Faculty Monitoring</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Teaching Loads">
                        <a href="#dept-teaching-loads" className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5" />
                          <span>Teaching Loads</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                    
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Department Reports">
                        <a href="#department-reports" className="flex items-center space-x-2">
                          <BarChart2 className="h-5 w-5" />
                          <span>Department Reports</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </>
                )}
              </SidebarMenu>
            </SidebarContent>
          </Sidebar>
          <main className="flex-1 p-6 bg-gray-50">
            <SidebarTrigger className="mb-4" />
            {children}
          </main>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default DashboardLayout;
