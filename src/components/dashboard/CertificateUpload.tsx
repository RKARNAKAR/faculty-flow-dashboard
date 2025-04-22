
import React, { useState, useEffect } from 'react';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from '@/hooks/use-toast';
import { supabase } from "@/integrations/supabase/client";
import { Upload, FileText } from 'lucide-react';

// Create the certificate storage bucket if it doesn't exist
const createBucketIfNotExists = async () => {
  try {
    const { data: buckets } = await supabase.storage.listBuckets();
    if (!buckets?.find(bucket => bucket.name === 'certificates')) {
      await supabase.storage.createBucket('certificates', {
        public: false,
        fileSizeLimit: 5242880, // 5MB
      });
    }
  } catch (error) {
    console.error("Error creating bucket:", error);
  }
};

const formSchema = z.object({
  facultyId: z.string({
    required_error: "Please select a faculty member",
  }),
  certificateName: z.string().min(3, {
    message: "Certificate name must be at least 3 characters.",
  }),
  issueDate: z.string().min(1, {
    message: "Issue date is required",
  }),
  certificateFile: z.instanceof(FileList).refine(files => files.length > 0, {
    message: "Please select a file.",
  }),
});

interface CertificateUploadProps {
  departmentId: string;
  facultyMembers: any[];
}

export const CertificateUpload: React.FC<CertificateUploadProps> = ({ departmentId, facultyMembers }) => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedCertificates, setUploadedCertificates] = useState<any[]>([]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      facultyId: "",
      certificateName: "",
      issueDate: "",
    },
  });

  useEffect(() => {
    createBucketIfNotExists();
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const { data, error } = await supabase.storage.from('certificates').list();
      
      if (error) {
        throw error;
      }
      
      if (data) {
        setUploadedCertificates(data.filter(item => !item.id.endsWith('/')));
      }
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!values.certificateFile?.[0]) {
      toast({
        title: "Error",
        description: "Please select a file to upload",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const file = values.certificateFile[0];
      const faculty = facultyMembers.find(f => f.id === values.facultyId);
      
      if (!faculty) {
        throw new Error("Selected faculty member not found");
      }

      // Format faculty name for the file path
      const facultyName = `${faculty.first_name}_${faculty.last_name}`.toLowerCase().replace(/\s+/g, '_');
      
      // Create a safe filename
      const fileExt = file.name.split('.').pop();
      const fileName = `${facultyName}_${values.certificateName.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}.${fileExt}`;
      
      // Upload the file
      const { data, error } = await supabase.storage
        .from('certificates')
        .upload(`faculty/${faculty.id}/${fileName}`, file);

      if (error) {
        throw error;
      }

      // Store metadata about the certificate
      const metadataPath = `faculty/${faculty.id}/metadata.json`;
      
      // Try to get existing metadata
      const { data: existingData } = await supabase.storage
        .from('certificates')
        .download(metadataPath);
      
      let metadata = [];
      
      if (existingData) {
        try {
          metadata = JSON.parse(await existingData.text());
        } catch (e) {
          console.error("Failed to parse existing metadata:", e);
          metadata = [];
        }
      }
      
      // Add new certificate metadata
      metadata.push({
        fileName,
        certificateName: values.certificateName,
        issueDate: values.issueDate,
        uploadDate: new Date().toISOString(),
        facultyId: faculty.id,
        facultyName: `${faculty.first_name} ${faculty.last_name}`,
      });
      
      // Upload updated metadata
      const { error: metadataError } = await supabase.storage
        .from('certificates')
        .upload(metadataPath, JSON.stringify(metadata), {
          upsert: true,
          contentType: 'application/json',
        });
        
      if (metadataError) {
        console.error("Failed to update metadata:", metadataError);
      }

      toast({
        title: "Certificate Uploaded",
        description: `${values.certificateName} has been uploaded successfully for ${faculty.first_name} ${faculty.last_name}.`,
      });
      
      form.reset();
      fetchCertificates();
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to upload certificate",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="facultyId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Faculty Member</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a faculty member" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {facultyMembers.map((faculty) => (
                      <SelectItem key={faculty.id} value={faculty.id}>
                        {faculty.first_name} {faculty.last_name} ({faculty.title})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="certificateName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Certificate Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Machine Learning Proficiency" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="issueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Issue Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="certificateFile"
            render={({ field: { value, onChange, ...fieldProps } }) => (
              <FormItem>
                <FormLabel>Certificate File</FormLabel>
                <FormControl>
                  <Input 
                    type="file"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => onChange(e.target.files)}
                    {...fieldProps}
                  />
                </FormControl>
                <FormDescription>
                  Upload PDF, image, or document files (max 5MB)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" disabled={isSubmitting} className="w-full">
            <Upload className="h-4 w-4 mr-2" />
            {isSubmitting ? "Uploading..." : "Upload Certificate"}
          </Button>
        </form>
      </Form>
      
      <div className="mt-8">
        <h3 className="text-lg font-medium mb-2">Recent Uploads</h3>
        {uploadedCertificates.length === 0 ? (
          <div className="text-center py-8 border rounded-md">
            <FileText className="h-8 w-8 mx-auto text-gray-400" />
            <p className="text-muted-foreground mt-2">No certificates uploaded yet.</p>
          </div>
        ) : (
          <div className="border rounded-md divide-y">
            {uploadedCertificates.map((cert) => (
              <div key={cert.id} className="p-3 flex justify-between items-center">
                <div className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-blue-600" />
                  <span>{cert.name}</span>
                </div>
                <Button variant="outline" size="sm" onClick={() => {
                  toast({
                    title: "Download functionality",
                    description: "This functionality will be implemented soon.",
                  });
                }}>
                  View
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
