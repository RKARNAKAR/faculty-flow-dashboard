
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone, Pencil, Eye, User, ExternalLink } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";

interface HodFacultyListProps {
  facultyMembers: any[];
  departmentId: string;
  onFacultyUpdate?: () => void;
}

export const HodFacultyList: React.FC<HodFacultyListProps> = ({ 
  facultyMembers, 
  departmentId,
  onFacultyUpdate 
}) => {
  const { toast } = useToast();
  const [selectedFaculty, setSelectedFaculty] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [userAccountDetails, setUserAccountDetails] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleViewDetails = async (faculty: any) => {
    setSelectedFaculty(faculty);
    setIsDialogOpen(true);
    
    // If the faculty has a user_id, fetch user account details
    if (faculty.user_id) {
      setIsLoading(true);
      try {
        // Get user role information
        const { data: userRoleData, error: userRoleError } = await supabase
          .from('user_roles')
          .select(`
            role_id,
            roles:role_id (
              name
            )
          `)
          .eq('user_id', faculty.user_id)
          .single();
        
        if (userRoleError) throw userRoleError;
        
        setUserAccountDetails({
          hasAccount: true,
          role: userRoleData.roles?.name || 'faculty'
        });
        
      } catch (error) {
        console.error('Error fetching user account details:', error);
        setUserAccountDetails({
          hasAccount: true,
          role: 'Unknown'
        });
      } finally {
        setIsLoading(false);
      }
    } else {
      setUserAccountDetails({ hasAccount: false });
    }
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setSelectedFaculty(null);
    setUserAccountDetails(null);
  };

  if (facultyMembers.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md">
        <p className="text-muted-foreground">No faculty members found in this department.</p>
      </div>
    );
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>User Account</TableHead>
            <TableHead>Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {facultyMembers.map((faculty) => (
            <TableRow key={faculty.id}>
              <TableCell className="font-medium">
                {faculty.first_name} {faculty.last_name}
              </TableCell>
              <TableCell>{faculty.title}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span className="flex items-center text-sm">
                    <Mail className="h-3 w-3 mr-1" /> {faculty.email}
                  </span>
                  {faculty.phone && (
                    <span className="flex items-center text-sm">
                      <Phone className="h-3 w-3 mr-1" /> {faculty.phone}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell>
                {faculty.user_id ? (
                  <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline">None</Badge>
                )}
              </TableCell>
              <TableCell>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewDetails(faculty)}
                >
                  <Eye className="h-3 w-3 mr-1" /> View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Faculty Details Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Faculty Details</DialogTitle>
            <DialogDescription>
              Comprehensive information about the selected faculty member.
            </DialogDescription>
          </DialogHeader>
          
          {selectedFaculty && (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="h-10 w-10 text-slate-400" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold">
                    {selectedFaculty.first_name} {selectedFaculty.last_name}
                  </h3>
                  <p className="text-muted-foreground">{selectedFaculty.title}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-sm">Contact Information</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{selectedFaculty.email}</span>
                    </div>
                    {selectedFaculty.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{selectedFaculty.phone}</span>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm">Office Location</h4>
                  <div className="mt-2">
                    <p>{selectedFaculty.office_location || 'Not specified'}</p>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-sm">Biography</h4>
                <p className="mt-2 text-sm">
                  {selectedFaculty.bio || 'No biography provided.'}
                </p>
              </div>
              
              <Card>
                <CardHeader className="py-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <User className="h-4 w-4" />
                    User Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent className="py-3">
                  {isLoading ? (
                    <div className="text-sm">Loading account details...</div>
                  ) : userAccountDetails?.hasAccount ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-800">Active Account</Badge>
                        <Badge variant="outline">{userAccountDetails.role}</Badge>
                      </div>
                      <p className="text-sm">
                        This faculty member has an active user account and can log in to the system.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Badge variant="outline">No Account</Badge>
                      <p className="text-sm">
                        This faculty member does not have a user account yet. 
                        They cannot log in to the system.
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={closeDialog}>
                  Close
                </Button>
                <Button variant="outline" className="flex items-center gap-1">
                  <Pencil className="h-3 w-3" />
                  Edit
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
