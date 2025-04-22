
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import FacultyDashboard from '@/components/dashboard/FacultyDashboard';
import HodDashboard from '@/components/dashboard/HodDashboard';
import { useToast } from '@/hooks/use-toast';

const Dashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
    
    // Display toast message when dashboard loads with role info
    if (user && userRole) {
      console.log(`Dashboard loaded for ${userRole} role`);
      toast({
        title: "Dashboard Loaded",
        description: `Welcome to your ${userRole} dashboard`,
      });
    }
  }, [user, userRole, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a237e]" />
        <p className="mt-4 text-lg">Loading dashboard...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Get user name from metadata if available
  const firstName = user.user_metadata?.first_name || '';
  const lastName = user.user_metadata?.last_name || '';
  const userName = firstName && lastName ? `${firstName} ${lastName}` : user.email || '';

  // Convert role to title case for display
  const displayRole = userRole ? userRole.charAt(0).toUpperCase() + userRole.slice(1) : 'User';

  return (
    <DashboardLayout userRole={displayRole} userName={userName}>
      {userRole?.toLowerCase() === 'admin' && <AdminDashboard />}
      {userRole?.toLowerCase() === 'faculty' && <FacultyDashboard />}
      {userRole?.toLowerCase() === 'hod' && <HodDashboard />}
      {!userRole && <p className="p-4">No role assigned. Please contact administrator.</p>}
    </DashboardLayout>
  );
};

export default Dashboard;
