
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen } from 'lucide-react';

const TeachingLoadManager = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          Teaching Load Assignment
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
            <div>
              <p className="font-medium">CS101 - Introduction to Programming</p>
              <p className="text-sm text-muted-foreground">3 credits - Fall 2024</p>
            </div>
            <Button variant="outline" size="sm">
              Assign Faculty
            </Button>
          </div>
          
          <div className="flex justify-between items-center p-4 border rounded-lg hover:bg-gray-50">
            <div>
              <p className="font-medium">CS202 - Data Structures</p>
              <p className="text-sm text-muted-foreground">4 credits - Fall 2024</p>
            </div>
            <Button variant="outline" size="sm">
              Assign Faculty
            </Button>
          </div>
          
          <Button className="w-full mt-4">
            <BookOpen className="h-4 w-4 mr-2" />
            Add New Course
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeachingLoadManager;
