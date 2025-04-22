
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2 } from 'lucide-react';
import AdminDashboard from '@/components/dashboard/AdminDashboard';
import FacultyDashboard from '@/components/dashboard/FacultyDashboard';
import HodDashboard from '@/components/dashboard/HodDashboard';

const Dashboard = () => {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#1a237e]" />
        <p className="mt-4 text-lg">Loading...</p>
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

  return (
    <DashboardLayout userRole={userRole || 'User'} userName={userName}>
      {userRole === 'Admin' && <AdminDashboard />}
      {userRole === 'Faculty' && <FacultyDashboard />}
      {userRole === 'HOD' && <HodDashboard />}
      {!userRole && <p className="p-4">No role assigned. Please contact administrator.</p>}
    </DashboardLayout>
  );
};

export default Dashboard;
