"use client"

import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { toast } from "sonner"
import Layout from "@/components/layout/Layout"
import VenueForm from "@/components/forms/VenueForm"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { addOwnerVenue, getVenueById, updateOwnerVenue } from "@/services/venue-service"
import type { VenueFormData } from "@/lib/types"
import { PlusCircle, Edit } from "lucide-react"

const AddEditVenue = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [venueData, setVenueData] = useState<VenueFormData>({
    name: "",
    description: "",
    capacity: 0,
    pricePerSeat: 0,
    district: "",
    address: "",
    phoneNumber: "",
  })
  const [venueImages, setVenueImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const isEditing = !!id

  useEffect(() => {
    const fetchVenueData = async () => {
      if (!isEditing || !id) return

      setIsLoading(true)
      try {
        const venue = await getVenueById(id)

        // Handle different response structures
        const rawVenueData = venue.venue || venue

        // Ensure rawVenueData is an object with expected fields
        if (
          typeof rawVenueData === "object" &&
          rawVenueData !== null &&
          "name" in rawVenueData
        ) {
          setVenueData({
            name: (rawVenueData as any).name || "",
            description: (rawVenueData as any).description || "",
            capacity: (rawVenueData as any).capacity || 0,
            pricePerSeat: (rawVenueData as any).pricePerSeat || (rawVenueData as any).price_per_seat || 0,
            district: (rawVenueData as any).district || "",
            address: (rawVenueData as any).address || "",
            phoneNumber: (rawVenueData as any).phoneNumber || (rawVenueData as any).phone_number || "",
          })

          // Handle different image field names
          setVenueImages((rawVenueData as any).photos || (rawVenueData as any).images || [])
        } else {
          setVenueData({
            name: "",
            description: "",
            capacity: 0,
            pricePerSeat: 0,
            district: "",
            address: "",
            phoneNumber: "",
          })
          setVenueImages([])
        }
      } catch (error) {
        console.error("Error fetching venue data:", error)
        toast.error("Failed to load venue data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchVenueData()
  }, [id, isEditing])

  const handleSubmit = async (formData: VenueFormData, images: File[]) => {
    try {
      if (isEditing && id) {
        await updateOwnerVenue(id, formData, images)
        toast.success("Venue updated successfully")
      } else {
        await addOwnerVenue(formData, images)
        toast.success("Venue added successfully")
      }
      navigate("/owner/dashboard")
    } catch (error) {
      console.error("Error saving venue:", error)
      toast.error("Failed to save venue")
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center">
            <LoadingSpinner size="large" />
          </div>
        </div>
      </Layout>
    )
  }

  console.log("Venue data:", venueData);
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/50 backdrop-blur-sm rounded-lg p-6 shadow-sm border border-primary/10 mb-8">
            <h1 className="text-3xl font-serif font-bold mb-2 text-primary-foreground flex items-center">
              {isEditing ? (
                <>
                  <Edit size={24} className="mr-2" />
                  Edit Venue
                </>
              ) : (
                <>
                  <PlusCircle size={24} className="mr-2" />
                  Add New Venue
                </>
              )}
            </h1>
            <p className="text-muted-foreground">
              {isEditing
                ? "Update your venue details to keep information current for potential clients"
                : "List your venue on our platform and start receiving booking requests"}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-primary/10 p-6">
            <VenueForm initialValues={venueData} venueImages={venueImages} onSubmit={handleSubmit} />
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default AddEditVenue
