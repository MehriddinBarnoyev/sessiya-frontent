
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createBooking } from "@/services/booking-service";
import { Venue } from "@/lib/types";
import { BookingFormData } from "@/lib/types";
import { Calendar, User, Phone, Users } from "lucide-react";

const bookingFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  phoneNumber: z.string().min(10, "Please enter a valid phone number"),
  guestCount: z.coerce.number()
    .min(1, "Guest count must be at least 1")
    .max(1000, "Guest count exceeds maximum capacity"),
  bookingDate: z.string().min(1, "Please select a date"),
});

type BookingFormValues = z.infer<typeof bookingFormSchema>;

interface BookingFormProps {
  venue: Venue;
  bookedDates: string[];
  onSuccess?: () => void;
  preselectedDate?: string;
}

const BookingForm = ({ venue, bookedDates, onSuccess, preselectedDate }: BookingFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>(preselectedDate || "");

  // Extract venueId from venue object, using either venueid or id
  const venueId = venue.venueid || venue.id;

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      guestCount: 1,
      bookingDate: preselectedDate || "",
    },
  });

  // Watch form state to determine if all fields are valid
  const { formState } = form;
  const watchedValues = form.watch();

  // Update the selected date whenever it changes in the form
  useEffect(() => {
    if (watchedValues.bookingDate) {
      setSelectedDate(watchedValues.bookingDate);
    }
  }, [watchedValues.bookingDate]);

  // Update form when preselected date changes or when a date is selected on the calendar
  useEffect(() => {
    if (preselectedDate) {
      form.setValue("bookingDate", preselectedDate, { shouldValidate: true });
      setSelectedDate(preselectedDate);
    }
  }, [preselectedDate, form]);

  const onSubmit = async (data: BookingFormValues) => {
    if (!venueId) {
      toast.error("Venue ID is missing. Cannot complete booking.");
      return;
    }
    
    if (!data.bookingDate) {
      toast.error("Please select a date for your booking.");
      return;
    }
    
    setIsSubmitting(true);
    try {
      const formData: BookingFormData = {
        venueId: venueId,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        numberOfGuests: Number(data.guestCount),
        bookingDate: data.bookingDate,
      };
      
      console.log("Booking venue with ID:", venueId);
      console.log("Submitting booking data:", formData);
      
      await createBooking(formData, venueId);
      toast.success("Booking successful! Check your bookings page for details.");
      form.reset();
      setSelectedDate("");
      onSuccess?.();
    } catch (error) {
      console.error("Booking error:", error);
      toast.error("Failed to create booking. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Check if all required fields are filled to enable button
  const isFormValid = 
    watchedValues.firstName?.length >= 2 && 
    watchedValues.lastName?.length >= 2 && 
    watchedValues.phoneNumber?.length >= 10 && 
    Number(watchedValues.guestCount) >= 1 && 
    watchedValues.bookingDate?.length > 0;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md border border-primary/10">
      <h2 className="text-2xl font-serif font-semibold mb-6 text-primary-foreground">Book This Venue</h2>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center text-primary-foreground">
                    <User size={16} className="mr-1.5" /> First Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="John" 
                      {...field} 
                      className="border-primary/20 focus-visible:ring-primary/30" 
                    />
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
                  <FormLabel className="flex items-center text-primary-foreground">
                    <User size={16} className="mr-1.5" /> Last Name
                  </FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="Doe" 
                      {...field} 
                      className="border-primary/20 focus-visible:ring-primary/30" 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-primary-foreground">
                  <Phone size={16} className="mr-1.5" /> Phone Number
                </FormLabel>
                <FormControl>
                  <Input 
                    placeholder="+998931234567" 
                    {...field} 
                    className="border-primary/20 focus-visible:ring-primary/30" 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="guestCount"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="flex items-center text-primary-foreground">
                  <Users size={16} className="mr-1.5" /> Number of Guests
                </FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={venue.capacity}
                    {...field}
                    className="border-primary/20 focus-visible:ring-primary/30"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="bookingDate"
            render={({ field }) => (
              <FormItem className="hidden">
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div>
            {!selectedDate ? (
              <div className="py-2 px-4 bg-amber-50 border border-amber-200 rounded-md flex items-center text-amber-700">
                <Calendar size={18} className="mr-2" />
                <span className="text-sm">Please select a date from the calendar to proceed with your booking</span>
              </div>
            ) : (
              <div className="py-2 px-4 bg-secondary/40 border border-secondary rounded-md flex items-center text-secondary-foreground">
                <Calendar size={18} className="mr-2" />
                <span className="text-sm">Selected date: {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full py-6 text-base bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow transition-all duration-300"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                "Book Now"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
