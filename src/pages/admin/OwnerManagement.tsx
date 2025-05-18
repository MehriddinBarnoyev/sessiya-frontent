
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { User, Plus, ChevronDown, ChevronUp } from "lucide-react";
import { format } from "date-fns";
import Layout from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Owner } from "@/lib/types";
import { getOwners } from "@/services/owner-service";
import { getAllVenuesByAdmin } from "@/services/venue-service";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { postData } from "@/services/api-service";

const ownerFormSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  phoneNumber: z.string().min(10, "Phone number must be at least 10 digits"),
  username: z.string().min(3, "Username must be at least 3 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type OwnerFormValues = z.infer<typeof ownerFormSchema>;

const OwnerManagement = () => {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [expandedOwner, setExpandedOwner] = useState<string | null>(null);
  const [ownerVenues, setOwnerVenues] = useState<Record<string, any[]>>({});

  const form = useForm<OwnerFormValues>({
    resolver: zodResolver(ownerFormSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      phoneNumber: "",
      username: "",
      email: "",
      password: "",
    },
  });

  const fetchOwners = async () => {
    setIsLoading(true);
    try {
      const response = await getOwners();
      setOwners(response.owners || []);
    } catch (error) {
      console.error("Failed to fetch owners:", error);
      toast.error("Failed to load owners");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOwners();
  }, []);

  const fetchOwnerVenues = async (ownerId: string) => {
    try {
      // If we already have the venues for this owner, don't fetch again
      if (ownerVenues[ownerId]) return;
      
      const allVenues = await getAllVenuesByAdmin();
      const filteredVenues = allVenues.venues.filter(venue => venue.ownerId === ownerId);
      
      setOwnerVenues(prev => ({
        ...prev,
        [ownerId]: filteredVenues,
      }));
    } catch (error) {
      console.error("Failed to fetch owner venues:", error);
      toast.error("Failed to load owner venues");
    }
  };

  const toggleOwnerExpansion = (ownerId: string) => {
    if (expandedOwner === ownerId) {
      setExpandedOwner(null);
    } else {
      setExpandedOwner(ownerId);
      fetchOwnerVenues(ownerId);
    }
  };

  const onSubmit = async (data: OwnerFormValues) => {
    try {
      await postData('/admin/owners', data);
      toast.success("Owner added successfully");
      setIsDialogOpen(false);
      form.reset();
      fetchOwners();
    } catch (error) {
      console.error("Failed to add owner:", error);
      toast.error("Failed to add owner");
    }
  };
  console.log(owners, 'owners');
  

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-serif font-bold">Owners Management</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> Add New Owner
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Add New Owner</DialogTitle>
              </DialogHeader>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name</FormLabel>
                          <FormControl>
                            <Input placeholder="First name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="lastname"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Last name" {...field} />
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
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="username"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input placeholder="Username" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="Password" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="flex justify-end gap-2">
                    <Button 
                      type="button" 
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit">Add Owner</Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="large" />
          </div>
        ) : owners.length === 0 ? (
          <div className="text-center py-12 border border-dashed rounded-lg">
            <p className="text-muted-foreground">No owners found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone Number</TableHead>
                  <TableHead>Registered Date</TableHead>
                  <TableHead>Venues</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {owners.map((owner) => (
                  <>
                    <TableRow key={owner.id} className="cursor-pointer" onClick={() => toggleOwnerExpansion(owner.id)}>
                      <TableCell className="font-medium">{owner.firstname} {owner.lastname}</TableCell>
                      <TableCell>{owner.username}</TableCell>
                      <TableCell>{owner.email}</TableCell>
                      <TableCell>{owner.phonenumber || 'N/A'}</TableCell>
                      <TableCell>{format(new Date(owner.createdat), 'PP')}</TableCell>
                      <TableCell>{ownerVenues[owner.id]?.length || 0}</TableCell>
                      <TableCell>
                        {expandedOwner === owner.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </TableCell>
                    </TableRow>
                    
                    {expandedOwner === owner.id && (
                      <TableRow>
                        <TableCell colSpan={7} className="p-0 border-t-0">
                          <div className="bg-muted/30 p-4">
                            <h3 className="text-sm font-medium mb-2">Venues Owned</h3>
                            
                            {!ownerVenues[owner.id] ? (
                              <div className="py-2">
                                <LoadingSpinner size="small" />
                              </div>
                            ) : ownerVenues[owner.id].length === 0 ? (
                              <p className="text-sm text-muted-foreground">No venues found for this owner.</p>
                            ) : (
                              <div className="space-y-2">
                                {ownerVenues[owner.id].map((venue) => (
                                  <div key={venue.id} className="border rounded-md p-3 bg-background flex justify-between items-center">
                                    <div>
                                      <p className="font-medium">{venue.name}</p>
                                      <p className="text-sm text-muted-foreground">
                                        {venue.district} • Capacity: {venue.capacity} • ${venue.pricePerSeat}/seat
                                      </p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default OwnerManagement;
