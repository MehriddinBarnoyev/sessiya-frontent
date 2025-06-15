
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
import { Calendar, User, Phone, Users, Star, Crown } from "lucide-react";

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
    <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-2 h-12 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full mr-4"></div>
          <h2 className="text-2xl font-serif font-bold text-gray-800">Book This Venue</h2>
          <Crown size={24} className="ml-4 text-yellow-500" />
        </div>
        <p className="text-gray-600">Secure your dream wedding venue today</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Personal Information */}
          <div className="bg-gradient-to-r from-emerald-50 to-blue-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <User size={20} className="mr-2 text-emerald-600" />
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">First Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="John" 
                        {...field} 
                        className="border-2" 
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
                    <FormLabel className="text-gray-700 font-medium">Last Name</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="Doe" 
                        {...field} 
                        className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-emerald-500 focus:ring-emerald-200 transition-all duration-300" 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Contact & Event Details */}
          <div className="bg-gradient-to-r from-blue-50 to-yellow-50 rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Phone size={20} className="mr-2 text-blue-600" />
              Contact & Event Details
            </h3>
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium">Phone Number</FormLabel>
                    <FormControl>
                      <Input 
                        placeholder="+998931234567" 
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
                name="guestCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 font-medium flex items-center">
                      <Users size={16} className="mr-2" />
                      Number of Guests
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={venue.capacity}
                        {...field}
                        className="border-2 border-gray-200 rounded-xl px-4 py-3 focus:border-blue-500 focus:ring-blue-200 transition-all duration-300"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

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

          {/* Date Selection Status */}
          <div className="bg-gradient-to-r from-yellow-50 to-emerald-50 rounded-2xl p-6">
            {!selectedDate ? (
              <div className="flex items-center text-yellow-700">
                <Calendar size={20} className="mr-3" />
                <div>
                  <p className="font-medium">Select Your Wedding Date</p>
                  <p className="text-sm text-yellow-600">Choose a date from the calendar to proceed with your booking</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center text-emerald-700">
                <Calendar size={20} className="mr-3" />
                <div>
                  <p className="font-medium">Selected Date</p>
                  <p className="text-sm">{new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-white"
            disabled={isSubmitting || !isFormValid}
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                Processing Your Booking...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Star size={20} />
                Book Your Dream Venue
              </span>
            )}
          </Button>

          {!isFormValid && (
            <p className="text-center text-sm text-gray-500 mt-2">
              Please complete all fields and select a date to proceed
            </p>
          )}
        </form>
      </Form>
    </div>
  );
};

export default BookingForm;
