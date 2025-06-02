
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "sonner";
import { Venue, VenueFormData } from "@/lib/types";
import { updateOwnerVenue, updateAdminVenue } from "@/services/venue-service";
import { getRole } from "@/lib/auth";

interface EditVenueModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  venue: Venue | null;
  onVenueUpdated: () => void;
}

const EditVenueModal = ({ open, onOpenChange, venue, onVenueUpdated }: EditVenueModalProps) => {
  const [formData, setFormData] = useState<VenueFormData>({
    name: "",
    description: "",
    capacity: 0,
    pricePerSeat: 0,
    district: "",
    address: "",
    phoneNumber: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const role = getRole();

  useEffect(() => {
    if (venue && open) {
      setFormData({
        name: venue.name || "",
        description: venue.description || "",
        capacity: venue.capacity || 0,
        pricePerSeat: venue.pricePerSeat || venue.priceperseat || 0,
        district: venue.district || "",
        address: venue.address || "",
        phoneNumber: venue.phoneNumber || venue.phone_number || "",
      });
    }
  }, [venue, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!venue) return;

    setIsLoading(true);
    try {
      const venueId = venue.venueid || venue.id;
      
      if (role === 'admin') {
        await updateAdminVenue(venueId, formData);
      } else {
        await updateOwnerVenue(venueId, formData);
      }
      
      toast.success("Venue updated successfully");
      onVenueUpdated();
      onOpenChange(false);
    } catch (error) {
      console.error("Error updating venue:", error);
      toast.error("Failed to update venue");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof VenueFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Venue</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Venue Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="district">District</Label>
              <Input
                id="district"
                value={formData.district}
                onChange={(e) => handleInputChange("district", e.target.value)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="capacity">Capacity</Label>
              <Input
                id="capacity"
                type="number"
                value={formData.capacity}
                onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || 0)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="pricePerSeat">Price Per Seat</Label>
              <Input
                id="pricePerSeat"
                type="number"
                value={formData.pricePerSeat}
                onChange={(e) => handleInputChange("pricePerSeat", parseFloat(e.target.value) || 0)}
                required
              />
            </div>
            
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                required
              />
            </div>
          </div>
          
          <div>
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              rows={4}
              required
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <LoadingSpinner size="small" /> : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditVenueModal;
