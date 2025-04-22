
import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  title: z.string().min(2, { message: "Title must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  departmentId: z.string({ required_error: "Please select a department" }),
  createAccount: z.boolean().default(false),
  password: z.string().min(6, { 
    message: "Password must be at least 6 characters." 
  }).optional(),
});

interface AddFacultyFormProps {
  departments?: any[];
  departmentId?: string;
  onSuccess: () => void;
}

export const AddFacultyForm: React.FC<AddFacultyFormProps> = ({ departments, departmentId, onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAccountFields, setShowAccountFields] = useState(false);
  const [loadedDepartments, setLoadedDepartments] = useState<any[]>([]);

  // Fetch departments if not provided and no specific departmentId is given
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!departments && !departmentId) {
        try {
          const { data, error } = await supabase.from('departments').select('*');
          if (error) throw error;
          setLoadedDepartments(data || []);
        } catch (error) {
          console.error('Error fetching departments:', error);
          toast({
            title: "Error",
            description: "Failed to load departments",
            variant: "destructive",
          });
        }
      } else if (departmentId && !departments) {
        // If only departmentId is provided, fetch just that department
        const fetchSingleDepartment = async () => {
          try {
            const { data, error } = await supabase
              .from('departments')
              .select('*')
              .eq('id', departmentId)
              .single();
            if (error) throw error;
            setLoadedDepartments(data ? [data] : []);
          } catch (error) {
            console.error('Error fetching department:', error);
          }
        };
        fetchSingleDepartment();
      } else if (departments) {
        setLoadedDepartments(departments);
      }
    };
    
    fetchDepartments();
  }, [departments, departmentId, toast]);

  // Determine which department to use as default
  const defaultDepartmentId = departmentId || 
    (loadedDepartments.length > 0 ? loadedDepartments[0].id : "") || 
    (departments && departments.length > 0 ? departments[0].id : "");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      departmentId: defaultDepartmentId,
      createAccount: false,
    },
  });

  const watchCreateAccount = form.watch("createAccount");

  React.useEffect(() => {
    setShowAccountFields(watchCreateAccount);
  }, [watchCreateAccount]);

  // Update departmentId when departments change
  React.useEffect(() => {
    if (departmentId) {
      form.setValue('departmentId', departmentId);
    } else if (loadedDepartments.length > 0) {
      form.setValue('departmentId', loadedDepartments[0]?.id || "");
    }
  }, [departmentId, loadedDepartments, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      let userId = null;

      // Create user account if selected
      if (values.createAccount && values.password) {
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              first_name: values.firstName,
              last_name: values.lastName,
            }
          }
        });

        if (authError) throw authError;
        userId = authData.user?.id;

        // Assign faculty role
        const { data: rolesData, error: rolesError } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'faculty')
          .single();

        if (rolesError) throw rolesError;

        await supabase.from('user_roles').insert({
          user_id: userId,
          role_id: rolesData.id,
          department_id: values.departmentId
        });
      }

      // Create faculty member
      const { data: facultyData, error: facultyError } = await supabase
        .from('faculty_members')
        .insert({
          first_name: values.firstName,
          last_name: values.lastName,
          title: values.title,
          email: values.email,
          department_id: values.departmentId,
          user_id: userId
        })
        .select('*')
        .single();

      if (facultyError) throw facultyError;

      const departmentName = loadedDepartments.find(d => d.id === values.departmentId)?.name || 
                          departments?.find(d => d.id === values.departmentId)?.name || 
                          'the department';

      toast({
        title: "Faculty Added Successfully",
        description: `${values.firstName} ${values.lastName} has been added to ${departmentName}${values.createAccount ? " with a user account" : ""}.`,
      });

      form.reset();
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error Adding Faculty",
        description: error.message || "Failed to add faculty member",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Assistant Professor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john.doe@university.edu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {loadedDepartments.length > 1 && (
            <FormField
              control={form.control}
              name="departmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <Select 
                    onValueChange={field.onChange} 
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Department" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {loadedDepartments.map((dept) => (
                        <SelectItem key={dept.id} value={dept.id}>
                          {dept.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
        
        <FormField
          control={form.control}
          name="createAccount"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
              <div className="space-y-0.5">
                <FormLabel>Create User Account</FormLabel>
                <FormDescription>
                  Generate login credentials for this faculty member
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        {showAccountFields && (
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Temporary Password</FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Set initial password" 
                    {...field} 
                  />
                </FormControl>
                <FormDescription>
                  Faculty member can change this password after first login
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        
        <Button 
          type="submit" 
          disabled={isSubmitting} 
          className="w-full"
        >
          <UserPlus className="h-4 w-4 mr-2" />
          {isSubmitting ? "Adding Faculty..." : "Add Faculty Member"}
        </Button>
      </form>
    </Form>
  );
};
