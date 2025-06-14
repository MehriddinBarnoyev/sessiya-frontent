
"use client"
import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import Layout from "@/components/layout/Layout"
import VenueCard from "@/components/venues/VenueCard"
import { Button } from "@/components/ui/button"
import { getOwnerBookings } from "@/services/booking-service"
import type { Venue, Booking } from "@/lib/types"
import { Edit, ImageIcon, Calendar, Crown, Star, Plus } from "lucide-react"
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
        setBookings(Array.isArray(bookingResponse) ? bookingResponse : [])
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
          <Button size="sm" variant="outline" className="border-emerald-200 text-emerald-700 hover:bg-emerald-50">
            <Edit size={16} className="mr-1" /> Edit
          </Button>
        </Link>
        <Link to={`/owner/bookings?venueId=${venueId}`}>
          <Button size="sm" variant="outline" className="border-blue-200 text-blue-700 hover:bg-blue-50">
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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-blue-50 to-yellow-50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-r from-emerald-500 to-blue-600 py-20">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative container mx-auto px-6">
            <div className="text-center text-white">
              <div className="flex items-center justify-center mb-4">
                <Crown size={40} className="mr-3 text-yellow-300" />
                <h1 className="text-4xl md:text-5xl font-serif font-bold">Owner Dashboard</h1>
              </div>
              <p className="text-xl font-light">Manage your wedding venues and bookings</p>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 mb-8">
                <div className="flex justify-between items-center mb-8">
                  <div className="flex items-center">
                    <div className="w-2 h-12 bg-gradient-to-b from-emerald-500 to-blue-500 rounded-full mr-4"></div>
                    <h2 className="text-3xl font-serif font-bold text-gray-800">My Venues</h2>
                  </div>
                  <Link to="/owner/add-venue">
                    <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300">
                      <Plus size={18} className="mr-2" />
                      Add New Venue
                    </Button>
                  </Link>
                </div>

                {isLoading ? (
                  <div className="flex justify-center py-16">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-4 border-emerald-500 border-t-transparent mx-auto mb-4"></div>
                      <p className="text-lg font-medium text-gray-700">Loading your venues...</p>
                    </div>
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
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-emerald-100 to-blue-100 rounded-full flex items-center justify-center">
                      <Plus size={40} className="text-emerald-600" />
                    </div>
                    <h3 className="text-xl font-serif font-semibold text-gray-800 mb-2">No venues yet</h3>
                    <p className="text-gray-600 mb-6">Get started by adding your first wedding venue</p>
                    <Link to="/owner/add-venue">
                      <Button className="bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white px-8 py-3 rounded-2xl font-semibold transition-all duration-300">
                        <Plus size={18} className="mr-2" />
                        Add Venue
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>

            <div>
              <Card className="bg-white/90 backdrop-blur-xl border border-white/50 shadow-2xl rounded-3xl overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-yellow-50 to-emerald-50 border-b border-white/50 p-6">
                  <div className="flex items-center">
                    <Star size={24} className="mr-3 text-yellow-500" />
                    <div>
                      <CardTitle className="text-xl font-serif font-bold text-gray-800">Recent Bookings</CardTitle>
                      <CardDescription className="text-gray-600">Your latest venue bookings</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  {isLoadingBookings ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-emerald-500 border-t-transparent"></div>
                    </div>
                  ) : getRecentBookings().length > 0 ? (
                    <div className="space-y-4">
                      {getRecentBookings().map((booking) => (
                        <div key={booking.id || booking.bookingid} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border-l-4 border-emerald-500">
                          <div className="font-semibold text-gray-800 mb-1">{booking.VenueName || booking.venueName}</div>
                          <div className="text-sm text-gray-600 space-y-1">
                            <div>📅 {formatDate(booking.bookingdate || booking.bookingDate)}</div>
                            <div>👥 {booking.numberofguests} guests</div>
                            <div>📞 {booking.phonenumber}</div>
                          </div>
                        </div>
                      ))}
                      <Link to="/owner/bookings" className="block">
                        <Button variant="outline" size="sm" className="w-full border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl">
                          <Calendar size={16} className="mr-2" />
                          View All Bookings
                        </Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                        <Calendar size={24} className="text-gray-500" />
                      </div>
                      <p className="text-gray-500">No bookings yet</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default OwnerDashboard
