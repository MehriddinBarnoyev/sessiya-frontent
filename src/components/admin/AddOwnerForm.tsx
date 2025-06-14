
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Owner } from "@/lib/types";
import { User, Mail, Phone, Lock, UserPlus } from "lucide-react";

const ownerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  phonenumber: z.string().min(10, "Please enter a valid phone number"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type OwnerFormValues = z.infer<typeof ownerSchema>;

interface AddOwnerFormProps {
  onSubmit: (data: Partial<Owner>) => Promise<void>;
  isLoading: boolean;
}

const AddOwnerForm = ({ onSubmit, isLoading }: AddOwnerFormProps) => {
  const form = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerSchema),
    defaultValues: {
      name: "",
      email: "",
      phonenumber: "",
      password: "",
    },
  });

  const handleSubmit = async (data: OwnerFormValues) => {
    try {
      await onSubmit({
        name: data.name,
        email: data.email,
        phonenumber: data.phonenumber,
        password: data.password,
      });
      form.reset();
      toast.success("Owner added successfully");
    } catch (error) {
      console.error("Error adding owner:", error);
      toast.error("Failed to add owner");
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
      <div className="flex items-center mb-8">
        <div className="w-2 h-12 bg-gradient-to-b from-rose-500 to-emerald-500 rounded-full mr-4"></div>
        <h2 className="text-3xl font-serif font-bold text-gray-800">Add New Owner</h2>
        <UserPlus size={28} className="ml-4 text-rose-600" />
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium flex items-center mb-2">
                  <User size={16} className="mr-2 text-rose-500" />
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter owner's full name" 
                    {...field} 
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-rose-500 focus:ring-rose-200 transition-all duration-300"
                  />
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
                <FormLabel className="text-gray-700 font-medium flex items-center mb-2">
                  <Mail size={16} className="mr-2 text-emerald-500" />
                  Email Address
                </FormLabel>
                <FormControl>
                  <Input 
                    type="email" 
                    placeholder="Enter email address" 
                    {...field} 
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phonenumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium flex items-center mb-2">
                  <Phone size={16} className="mr-2 text-blue-500" />
                  Phone Number
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter phone number" 
                    {...field} 
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-gray-700 font-medium flex items-center mb-2">
                  <Lock size={16} className="mr-2 text-purple-500" />
                  Password
                </FormLabel>
                <FormControl>
                  <Input 
                    type="password" 
                    placeholder="Enter password" 
                    {...field} 
                    className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-purple-500 focus:ring-purple-200 transition-all duration-300"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-rose-500 to-emerald-500 hover:from-rose-600 hover:to-emerald-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white"
          >
            {isLoading ? (
              <span className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Adding Owner...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <UserPlus size={20} />
                Add Owner
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default AddOwnerForm;
