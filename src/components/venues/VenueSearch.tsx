
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { VenueFilter } from "@/lib/types";
import { cn } from "@/lib/utils";

const searchFormSchema = z.object({
  name: z.string().optional(),
  district: z.string().optional(),
  minCapacity: z.coerce.number().min(0).optional(),
  maxCapacity: z.coerce.number().min(0).optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z.string().optional(),
  status: z.string().optional(),
});

export interface VenueSearchProps {
  onSearch: (searchParams: VenueFilter) => void;
  includeStatus?: boolean;
  className?: string;
}

const VenueSearch = ({ onSearch, includeStatus = false, className = "" }: VenueSearchProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const form = useForm<z.infer<typeof searchFormSchema>>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      name: "",
      district: "",
      minCapacity: undefined,
      maxCapacity: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: "newest",
      status: "",
    },
  });

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handleSubmit = (data: z.infer<typeof searchFormSchema>) => {
    // Filter out undefined or empty string values
    const filteredData = Object.fromEntries(
      Object.entries(data).filter(
        ([_, value]) => value !== undefined && value !== ""
      )
    );
    
    onSearch(filteredData);
  };

  const handleReset = () => {
    form.reset({
      name: "",
      district: "",
      minCapacity: undefined,
      maxCapacity: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      sort: "newest",
      status: "",
    });
    onSearch({});
  };

  return (
    <div className={cn("bg-card rounded-lg border p-4 shadow-sm", className)}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Venue Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder="Search venues..."
                          className="pl-8"
                          {...field}
                        />
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <Button type="submit" className="whitespace-nowrap">
                Search Venues
              </Button>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={toggleExpanded}
                className="ml-auto"
              >
                {isExpanded ? "Less filters" : "More filters"}
              </Button>
            </div>
          </div>

          {isExpanded && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
              <FormField
                control={form.control}
                name="district"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>District</FormLabel>
                    <FormControl>
                      <Input placeholder="Any district" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="sort"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sort By</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Sort by" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="newest">Newest</SelectItem>
                        <SelectItem value="price_asc">Price: Low to High</SelectItem>
                        <SelectItem value="price_desc">Price: High to Low</SelectItem>
                        <SelectItem value="capacity_asc">Capacity: Low to High</SelectItem>
                        <SelectItem value="capacity_desc">Capacity: High to Low</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />

              {includeStatus && (
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="All statuses" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="">All statuses</SelectItem>
                          <SelectItem value="Confirmed">Confirmed</SelectItem>
                          <SelectItem value="Unconfirmed">Unconfirmed</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              )}

              <div className="flex gap-4">
                <FormField
                  control={form.control}
                  name="minPrice"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Min Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxPrice"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Max Price</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Any"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4 col-span-1 md:col-span-2 lg:col-span-1">
                <FormField
                  control={form.control}
                  name="minCapacity"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Min Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="0"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="maxCapacity"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Max Capacity</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Any"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
};

export default VenueSearch;
