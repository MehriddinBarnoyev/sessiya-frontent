import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import BookingList from "@/components/bookings/BookingList";
import PhoneBookingLookup from "@/components/bookings/PhoneBookingLookup";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Booking } from "@/lib/types";
import { getUserBookings, getBookingsByPhoneNumber } from "@/services/booking-service";
import { isAuthenticated } from "@/lib/auth";

const MyBookings = () => {
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [phoneBookings, setPhoneBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState<string | null>(null);
  const authenticated = isAuthenticated();

  useEffect(() => {
    if (authenticated) {
      fetchUserBookings();
    }
  }, [authenticated]);

  const fetchUserBookings = async () => {
    setIsLoading(true);
    try {
      const response = await getUserBookings();
      setUserBookings(response.bookings || []);
    } catch (error) {
      console.error("Error fetching user bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneLookup = async (phoneNumber: string) => {
    setIsLoading(true);
    setPhoneError(null);
    try {
      const response = await getBookingsByPhoneNumber(phoneNumber);
      setPhoneBookings(response.bookings || []);
    } catch (error) {
      console.error("Error fetching bookings by phone:", error);
      setPhoneError("No bookings found for this phone number");
      setPhoneBookings([]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-serif font-bold mb-6 text-primary-foreground">My Bookings</h1>
        
        <Tabs defaultValue={authenticated ? "user" : "phone"} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            {authenticated && <TabsTrigger value="user">My Account Bookings</TabsTrigger>}
            <TabsTrigger value="phone">Lookup by Phone</TabsTrigger>
          </TabsList>
          
          {authenticated && (
            <TabsContent value="user">
              <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-6">
                <h2 className="text-xl font-serif font-semibold mb-4 text-primary-foreground">Your Bookings</h2>
                {isLoading ? (
                  <div className="flex justify-center py-8">
                    <LoadingSpinner size="large" />
                  </div>
                ) : (
                  <BookingList bookings={userBookings} />
                )}
              </div>
            </TabsContent>
          )}
          
          <TabsContent value="phone">
            <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-6">
              <h2 className="text-xl font-serif font-semibold mb-4 text-primary-foreground">Lookup Bookings by Phone Number</h2>
              <PhoneBookingLookup onLookup={handlePhoneLookup} />
              
              {phoneError && (
                <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="text-destructive">{phoneError}</p>
                </div>
              )}
              
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <LoadingSpinner size="large" />
                </div>
              ) : phoneBookings.length > 0 ? (
                <div className="mt-6">
                  <BookingList bookings={phoneBookings} />
                </div>
              ) : null}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default MyBookings;
