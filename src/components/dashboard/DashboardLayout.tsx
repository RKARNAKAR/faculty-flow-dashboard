
import React from 'react';
import DashboardHeader from './DashboardHeader';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton,
  SidebarProvider 
} from "@/components/ui/sidebar";
import { 
  Users, 
  BookOpen, 
  FileText, 
  User, 
  BarChart2, 
  Award, 
  Settings, 
  Shield 
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
      <div className="flex h-[calc(100vh-4rem)]">
        <SidebarProvider>
          <div className="flex w-full">
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
                          <a href="#manage-faculty" className="flex items-center space-x-2">
                            <Users className="h-5 w-5" />
                            <span>Manage Faculty</span>
                          </a>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                      
                      <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Roles Management">
                          <a href="#roles" className="flex items-center space-x-2">
                            <Shield className="h-5 w-5" />
                            <span>Role Management</span>
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
                    </>
                  )}
                  
                  {/* HOD and Admin can access teaching loads */}
                  {(userRole === 'Admin' || userRole === 'HOD') && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Teaching Loads">
                        <a href="#teaching-loads" className="flex items-center space-x-2">
                          <BookOpen className="h-5 w-5" />
                          <span>Teaching Loads</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  
                  {/* Certifications menu item for all roles */}
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Certifications">
                      <a href="#certifications" className="flex items-center space-x-2">
                        <Award className="h-5 w-5" />
                        <span>Certifications</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  
                  {/* Reports menu item for Admin and HOD */}
                  {(userRole === 'Admin' || userRole === 'HOD') && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="Reports">
                        <a href="#reports" className="flex items-center space-x-2">
                          <BarChart2 className="h-5 w-5" />
                          <span>Performance Reports</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                  
                  {/* Faculty can view their own reports */}
                  {userRole === 'Faculty' && (
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild tooltip="My Reports">
                        <a href="#myreports" className="flex items-center space-x-2">
                          <FileText className="h-5 w-5" />
                          <span>My Reports</span>
                        </a>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )}
                </SidebarMenu>
              </SidebarContent>
            </Sidebar>
            <main className="flex-1 p-6 bg-gray-50">
              {children}
            </main>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default DashboardLayout;
