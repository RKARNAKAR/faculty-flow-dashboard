
import React, { useState } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { UserPlus } from 'lucide-react';
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().optional(),
  officeLocation: z.string().optional(),
  bio: z.string().optional(),
  createAccount: z.boolean().default(false),
  password: z.string().min(6, {
    message: "Password must be at least 6 characters.",
  }).optional(),
}).refine((data) => {
  // If createAccount is true, password must be provided
  return !data.createAccount || (data.createAccount && data.password);
}, {
  message: "Password is required when creating an account",
  path: ["password"],
});

interface AddFacultyFormProps {
  departmentId: string;
  onSuccess: () => void;
}

export const AddFacultyForm: React.FC<AddFacultyFormProps> = ({ departmentId, onSuccess }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAccountFields, setShowAccountFields] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      title: "",
      email: "",
      phone: "",
      officeLocation: "",
      bio: "",
      createAccount: false,
      password: "",
    },
  });

  const watchCreateAccount = form.watch("createAccount");

  // Update UI when createAccount changes
  React.useEffect(() => {
    setShowAccountFields(watchCreateAccount);
  }, [watchCreateAccount]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      let userId = null;

      // If creating account is enabled, create user first
      if (values.createAccount && values.password) {
        // Create a new user account
        const { data: userData, error: userError } = await supabase.auth.signUp({
          email: values.email,
          password: values.password as string,
          options: {
            data: {
              first_name: values.firstName,
              last_name: values.lastName,
            }
          }
        });

        if (userError) {
          throw userError;
        }

        if (userData.user) {
          userId = userData.user.id;

          // Create role entry for the new user (faculty role)
          const { data: rolesData, error: rolesError } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'faculty')
            .single();

          if (rolesError) {
            throw rolesError;
          }

          // Assign the faculty role to the user
          const { error: userRoleError } = await supabase
            .from('user_roles')
            .insert([{
              user_id: userId,
              role_id: rolesData.id,
              department_id: departmentId
            }]);

          if (userRoleError) {
            throw userRoleError;
          }
        }
      }

      // Insert new faculty member
      const { data, error } = await supabase
        .from('faculty_members')
        .insert([
          {
            first_name: values.firstName,
            last_name: values.lastName,
            title: values.title,
            email: values.email,
            phone: values.phone || null,
            office_location: values.officeLocation || null,
            bio: values.bio || null,
            department_id: departmentId,
            user_id: userId // Link to user if an account was created
          }
        ])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "Faculty Added",
        description: `${values.firstName} ${values.lastName} has been added successfully${values.createAccount ? " with a user account" : ""}.`,
      });
      
      form.reset();
      onSuccess();
      
    } catch (error: any) {
      toast({
        title: "Error",
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
                  <Input placeholder="example@university.edu" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (123) 456-7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="officeLocation"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Office Location</FormLabel>
                <FormControl>
                  <Input placeholder="Building A, Room 123" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Short biography and research interests" 
                  className="min-h-[100px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator className="my-4" />
        
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="createAccount"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                <div className="space-y-0.5">
                  <FormLabel>Create User Account</FormLabel>
                  <FormDescription>
                    Create a user account for this faculty member
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
            <>
              <Alert>
                <AlertDescription>
                  This will create a user account with the email provided above and the password below.
                  The faculty member will be able to log in to the system.
                </AlertDescription>
              </Alert>
              
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input 
                        type="password" 
                        placeholder="Enter a password for the new user" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
        </div>
        
        <Button type="submit" disabled={isSubmitting} className="w-full">
          <UserPlus className="h-4 w-4 mr-2" />
          {isSubmitting ? "Adding Faculty..." : "Add Faculty Member"}
        </Button>
      </form>
    </Form>
  );
};
