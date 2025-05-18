
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

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
    <div className="bg-card p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-medium mb-4">Find Your Bookings</h2>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input placeholder="Enter your phone number" {...field} />
                    <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Searching..." : "Find Bookings"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default PhoneBookingLookup;
