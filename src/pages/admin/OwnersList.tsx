

import { useState, useEffect } from "react";
import { toast } from "sonner";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Owner, Venue } from "@/lib/types";
import { format } from "date-fns";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import VenueCard from "@/components/venues/VenueCard";
import { Edit, Trash, Trash2 } from "lucide-react";
import { addOwner, deleteOwner, getOwners, getOwnerVenueByAdmin } from "@/services/owner-service";


const OwnersList = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    firstname: "",
    lastname: "",
    phoneNumber: "",
    username: "",
    email: "",
    password: "",
  });
  // New state for owner venues
  const [selectedOwner, setSelectedOwner] = useState<Owner | null>(null);
  const [ownerVenues, setOwnerVenues] = useState<Venue[]>([]);
  const [loadingVenues, setLoadingVenues] = useState(false);
  const [venuesDialogOpen, setVenuesDialogOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [totalOwners, setTotalOwners] = useState(0);


  useEffect(() => {
    const fetchOwners = async () => {
      try {
        setIsLoading(true);
        const data = await getOwners();
        setOwners(data.owners || []);
      } catch (error) {
        console.error("Failed to fetch owners:", error);
        toast.error("Could not load owners");
      } finally {
        setIsLoading(false);
      }
    };


    fetchOwners();
  }, []);


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Ensure all required fields are filled
    if (!formData.firstname || !formData.lastname || !formData.username ||
      !formData.phoneNumber || !formData.email || !formData.password) {
      toast.error("All fields are required");
      return;
    }

    try {
      await addOwner({
        firstname: formData.firstname,
        lastname: formData.lastname,
        phonenumber: formData.phoneNumber,
        username: formData.username,
        email: formData.email,
        password: formData.password,
      });

      toast.success("Owner added successfully");
      setIsModalOpen(false);

      // Reset form
      setFormData({
        firstname: "",
        lastname: "",
        phonenumber: "",
        username: "",
        email: "",
        password: "",
      });

      // Refresh owners list
      const data = await getOwners();
      setOwners(data.owners || []);
    } catch (error) {
      console.error("Failed to add owner ss:", error);
      toast.error("Could not add owner");
    }
  };


  // New function to fetch and display owner's venues
  const handleViewOwnerVenues = async (owner: Owner) => {
    setSelectedOwner(owner);
    setLoadingVenues(true);
    setVenuesDialogOpen(true);

    try {
      const response = await getOwnerVenueByAdmin(owner.ownerid);
      setOwnerVenues(response.venues || []);
    } catch (error) {
      console.error("Failed to fetch owner venues:", error);
      toast.error("Could not load owner venues");
      setOwnerVenues([]);
    } finally {
      setLoadingVenues(false);
    }
  };

  const handleDeleteOwner = async (id: string) => {    
    try {
      await deleteOwner(id);
      toast.success("Owner deleted successfully");

      // Refresh the list of owners
      const updatedData = await getOwners();
      setOwners(updatedData.owners || []);
      setTotalPages(updatedData.totalPages || 1);
      setTotalOwners(updatedData.totalOwners || 0);
    } catch (error) {
      console.error("Error deleting owner:", error);
      toast.error("Failed to delete owner");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-serif font-bold">Owners Management</h1>
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button>Add Owner</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Owner</DialogTitle>
                <DialogDescription>
                  Create a new owner account.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="firstname" className="text-right">
                      First Name
                    </Label>
                    <Input
                      type="text"
                      id="firstname"
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="lastname" className="text-right">
                      Last Name
                    </Label>
                    <Input
                      type="text"
                      id="lastname"
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="username" className="text-right">
                      Username
                    </Label>
                    <Input
                      type="text"
                      id="username"
                      name="username"
                      value={formData.username}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="phoneNumber" className="text-right">
                      Phone Number
                    </Label>
                    <Input
                      type="tel"
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="email" className="text-right">
                      Email
                    </Label>
                    <Input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="password" className="text-right">
                      Password
                    </Label>
                    <Input
                      type="password"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Create account</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>


        {isLoading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="large" />
          </div>
        ) : owners.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No owners found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owners.map((owner) => (
                  <TableRow key={owner.id}>
                    <TableCell className="font-medium">
                      {owner.firstname} {owner.lastname}
                    </TableCell>
                    <TableCell>{owner.username}</TableCell>
                    <TableCell>{owner.phonenumber}</TableCell>
                    <TableCell>{owner.email}</TableCell>
                    <TableCell>
                      {/* Add validation to ensure createdat is valid before formatting */}
                      {owner.createdat && typeof owner.createdat === 'string' && owner.createdat.trim() !== ''
                        ? format(new Date(owner.createdat), "MMM d, yyyy")
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">Active</Badge>
                    </TableCell>
                    <TableCell className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center gap-1"
                        onClick={() => handleViewOwnerVenues(owner)}
                      >
                        <Edit size={16} />
                      </Button>
                      <Button variant="outline"
                       size="sm" 
                       className="flex items-center gap-1"
                       onClick={() => handleDeleteOwner(owner.ownerid)}
                      >
                        <Trash size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}


        {/* Dialog to display owner venues */}
        <Dialog open={venuesDialogOpen} onOpenChange={setVenuesDialogOpen}>
          <DialogContent className="sm:max-w-[80%] max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {selectedOwner && `${selectedOwner.firstname} ${selectedOwner.lastname}'s Venues`}
              </DialogTitle>
              <DialogDescription>
                Venues owned by this account
              </DialogDescription>
            </DialogHeader>

            {loadingVenues ? (
              <div className="flex justify-center py-8">
                <LoadingSpinner size="medium" />
              </div>
            ) : ownerVenues.length === 0 ? (
              <div className="text-center py-4">
                <p>No venues found for this owner.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
                {ownerVenues.map(venue => (
                  <VenueCard
                    key={venue.id || venue.venueid}
                    venue={venue}
                    showStatus={true}
                  />
                ))}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};


export default OwnersList;

