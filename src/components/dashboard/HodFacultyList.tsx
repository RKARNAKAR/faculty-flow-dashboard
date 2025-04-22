
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { Mail, Phone } from 'lucide-react';

interface HodFacultyListProps {
  facultyMembers: any[];
  departmentId: string;
}

export const HodFacultyList: React.FC<HodFacultyListProps> = ({ facultyMembers, departmentId }) => {
  const { toast } = useToast();

  const handleViewDetails = (facultyId: string) => {
    toast({
      title: "View details",
      description: `Viewing details for faculty ID: ${facultyId}`,
    });
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
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleViewDetails(faculty.id)}
                >
                  View Details
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
