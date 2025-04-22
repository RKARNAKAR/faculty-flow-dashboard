
import React from 'react';
import { Button } from "@/components/ui/button";
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardHeaderProps {
  userRole: string;
  userName: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ userRole, userName }) => {
  const { signOut } = useAuth();
  
  return (
    <header className="bg-[#1a237e] text-white p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">FACULTECH</h1>
        <span className="bg-white text-[#1a237e] px-3 py-1 rounded-full text-sm font-medium">
          {userRole}
        </span>
      </div>
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <User className="h-5 w-5 mr-2" />
          <span>{userName}</span>
        </div>
        <Button variant="ghost" size="icon" onClick={signOut}>
          <LogOut className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};

export default DashboardHeader;
