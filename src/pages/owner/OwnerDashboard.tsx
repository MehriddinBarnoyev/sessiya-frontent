"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import VenueCard from "@/components/venues/VenueCard"
import { Button } from "@/components/ui/button"
import { getOwnerBookings } from "@/services/booking-service"
import type { Venue, Booking } from "@/lib/types"
import { Edit, ImageIcon, Calendar } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { format, parseISO } from "date-fns"
import { getOwnerVenuesByOwner } from "@/services/owner-service"

const OwnerDashboard = () => {
  const [venues, setVenues] = useState<Venue[]>([])
  const [bookings, setBookings] = useState<Booking[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingBookings, setIsLoadingBookings] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      const ownerId = localStorage.getItem("userId")
      try {
        setIsLoading(true)
        // Use the updated API that doesn't require ownerId
        const venueResponse = await getOwnerVenuesByOwner(ownerId || "")
        console.log("Venue Response:", venueResponse)

        setVenues(venueResponse.venues || [])

        setIsLoadingBookings(true)
        const bookingResponse = await getOwnerBookings()
        if (Array.isArray(bookingResponse)) {
          setBookings(bookingResponse)
        } else if (bookingResponse && bookingResponse.bookings) {
          setBookings(bookingResponse.bookings)
        } else {
          setBookings([])
        }
      } catch (error) {
        console.error("Error fetching owner data:", error)
      } finally {
        setIsLoading(false)
        setIsLoadingBookings(false)
      }
    }

    fetchData()
  }, [])

  const renderVenueActions = (venue: Venue) => {
    // Use venueid consistently for all actions
    const venueId = venue.venueid || venue.id

    return (
      <div className="flex flex-wrap gap-2">
        <Link to={`/owner/edit-venue/${venueId}`}>
          <Button size="sm" variant="outline">
            <Edit size={16} className="mr-1" /> Edit
          </Button>
        </Link>
        {/* <Link to={`/owner/edit-venue/${venueId}`}>
          <Button size="sm" variant="outline">
            <ImageIcon size={16} className="mr-1" /> Photos
          </Button>
        </Link> */}
        <Link to={`/owner/bookings?venueId=${venueId}`}>
          <Button size="sm" variant="outline">
            <Calendar size={16} className="mr-1" /> Bookings
          </Button>
        </Link>
      </div>
    )
  }

  const getRecentBookings = () => {
    return bookings.slice(0, 5) // Get the first 5 bookings
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    try {
      return format(parseISO(dateString), "MMM d, yyyy")
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-serif font-bold">My Venues</h1>
              <Link to="/owner/add-venue">
                <Button>Add New Venue</Button>
              </Link>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
              </div>
            ) : venues.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {venues.map((venue) => (
                  <VenueCard
                    key={venue.id || venue.venueid}
                    venue={venue}
                    showStatus={true}
                    actions={renderVenueActions(venue)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-muted rounded-lg">
                <h3 className="text-xl font-medium mb-2">No venues yet</h3>
                <p className="text-muted-foreground mb-6">Get started by adding your first venue</p>
                <Link to="/owner/add-venue">
                  <Button>Add Venue</Button>
                </Link>
              </div>
            )}
          </div>

          <div>
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>Your latest venue bookings</CardDescription>
              </CardHeader>
              <CardContent>
                {isLoadingBookings ? (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
                  </div>
                ) : getRecentBookings().length > 0 ? (
                  <div className="space-y-4">
                    {getRecentBookings().map((booking) => (
                      <div key={booking.id || booking.bookingid} className="border-b pb-3 last:border-0">
                        <div className="font-medium">{booking.VenueName || booking.venueName}</div>
                        <div className="text-sm text-muted-foreground">
                          Date: {formatDate(booking.bookingdate || booking.bookingDate)}
                        </div>
                        <div className="text-sm">Guests: {booking.numberofguests}</div>
                        <div className="text-sm">Contact: {booking.phonenumber}</div>
                      </div>
                    ))}
                    <Link to="/owner/bookings" className="block text-center">
                      <Button variant="outline" size="sm" className="w-full">
                        View All Bookings
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No bookings yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default OwnerDashboard
