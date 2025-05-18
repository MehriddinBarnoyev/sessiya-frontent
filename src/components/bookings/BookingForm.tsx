
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
    <div className="bg-card rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-serif font-semibold mb-6">Book This Venue</h2>

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
          </div>

          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="+1 (555) 123-4567" {...field} />
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
                <FormLabel>Number of Guests</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    max={venue.capacity}
                    {...field}
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

          <div className="pt-2">
            {!selectedDate && (
              <div className="text-sm text-amber-600 mb-2">
                Please select a date from the calendar to proceed with your booking
              </div>
            )}
            {selectedDate && (
              <div className="text-sm text-green-600 mb-2">
                Selected booking date: {new Date(selectedDate).toLocaleDateString()}
              </div>
            )}
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || !isFormValid}
            >
              {isSubmitting ? "Booking..." : "Book Now"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
