
import React from 'react';
import DashboardHeader from './DashboardHeader';
import { Sidebar, SidebarContent, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Users, BookOpen, FileText, User } from 'lucide-react';

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
        <Sidebar>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#profile" className="flex items-center space-x-2">
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              {userRole === 'Admin' && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="#manage-faculty" className="flex items-center space-x-2">
                      <Users className="h-5 w-5" />
                      <span>Manage Faculty</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#teaching-loads" className="flex items-center space-x-2">
                    <BookOpen className="h-5 w-5" />
                    <span>Teaching Loads</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <a href="#reports" className="flex items-center space-x-2">
                    <FileText className="h-5 w-5" />
                    <span>Reports</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
        </Sidebar>
        <main className="flex-1 p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
