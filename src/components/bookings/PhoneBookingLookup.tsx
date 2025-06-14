
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search, Phone, Crown } from "lucide-react";

const phoneSchema = z.object({
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
});

type PhoneFormValues = z.infer<typeof phoneSchema>;

interface PhoneBookingLookupProps {
  onSubmit: (phoneNumber: string) => void;
  isLoading: boolean;
}

const PhoneBookingLookup = ({ onSubmit, isLoading }: PhoneBookingLookupProps) => {
  const form = useForm<PhoneFormValues>({
    resolver: zodResolver(phoneSchema),
    defaultValues: {
      phoneNumber: "",
    },
  });

  const handleSubmit = (data: PhoneFormValues) => {
    onSubmit(data.phoneNumber);
  };

  console.log("Form Data:", form.getValues());
  
  return (
    <div className="text-center">
      <div className="flex items-center justify-center mb-6">
        <div className="w-2 h-12 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full mr-4"></div>
        <h2 className="text-2xl font-serif font-bold text-gray-800">Find Your Bookings</h2>
        <Crown size={24} className="ml-4 text-yellow-500" />
      </div>
      <p className="text-gray-600 mb-8">Enter your phone number to access your wedding venue reservations</p>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="max-w-md mx-auto">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem className="mb-6">
                <FormLabel className="text-gray-700 font-medium flex items-center justify-center mb-3">
                  <Phone size={16} className="mr-2" />
                  Phone Number
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input 
                      placeholder="Enter your phone number" 
                      {...field} 
                      className="border-2 border-gray-200 rounded-xl px-5 py-4 pr-12 text-center text-lg focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-300"
                    />
                    <Search className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white"
          >
            {isLoading ? (
              <span className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Searching...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Search size={20} />
                Find My Bookings
              </span>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PhoneBookingLookup;
