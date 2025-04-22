
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, User, Mail } from 'lucide-react';

const RoleManagement = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Role Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
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
          
          <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
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
          
          <Button className="w-full mt-4">
            <Mail className="h-4 w-4 mr-2" />
            Send Credentials
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RoleManagement;
