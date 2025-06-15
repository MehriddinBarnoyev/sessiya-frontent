import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VenueFilter as VenueFilterType } from "@/lib/types";
import { Filter, X, RefreshCw } from "lucide-react";

interface VenueFilterProps {
  onFilterChange: (filter: VenueFilterType) => void;
  districts: string[];
  maxPrice?: number;
  maxCapacity?: number;
}

const VenueFilter = ({
  onFilterChange,
  districts,
  maxPrice = 10000,
  maxCapacity = 1000
}: VenueFilterProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [filter, setFilter] = useState<VenueFilterType>({
    name: "",
    minPrice: 0,
    maxPrice,
    minCapacity: 0,
    maxCapacity,
    district: "all",
    sort: "default"
  });

  const handleCapacityChange = (value: number[]) => {
    const newFilter = {
      ...filter,
      minCapacity: value[0],
      maxCapacity: value[1]
    };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleDistrictChange = (value: string) => {
    const newFilter = { ...filter, district: value };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleSortChange = (value: string) => {
    const validSorts = ["default", "priceAsc", "priceDesc", "capacityAsc", "capacityDesc"];
    const newFilter = { ...filter, sort: validSorts.includes(value) ? value : "default" };
    setFilter(newFilter);
    onFilterChange(newFilter);
  };

  const handleReset = () => {
    const resetFilter: VenueFilterType = {
      name: "",
      minPrice: 0,
      maxPrice,
      minCapacity: 0,
      maxCapacity,
      district: "all",
      sort: "default"
    };
    setFilter(resetFilter);
    onFilterChange(resetFilter);
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  return (
    <div className=" rounded-xl p-6 mb-8 shadow-sm border-gray-900">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-foreground">Refine Your Search</h3>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={toggleFilters}
            className="h-9 w-9 rounded-full border-border hover:bg-muted/50 transition-colors"
            aria-label={showFilters ? "Hide filters" : "Show filters"}
          >
            {showFilters ? <X size={16} /> : <Filter size={16} />}
          </Button>
          <Button
            type="button"
            variant="ghost"
            onClick={handleReset}
            className="h-9 px-3 rounded-full text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5"
            aria-label="Reset filters"
          >
            <RefreshCw size={16} />
            <span>Reset</span>
          </Button>
        </div>
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 pt-6 border-t border-border/30">
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Capacity ({filter.minCapacity} - {filter.maxCapacity} guests)
            </Label>
            <Slider
              defaultValue={[0, maxCapacity]}
              min={0}
              max={maxCapacity}
              step={10}
              value={[filter.minCapacity || 0, filter.maxCapacity || maxCapacity]}
              onValueChange={handleCapacityChange}
              className="mt-3"
            />
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">District</Label>
            <Select value={filter.district} onValueChange={handleDistrictChange}>
              <SelectTrigger className="mt-2 rounded-lg border-border/50 focus:ring-2 focus:ring-primary/50">
                <SelectValue placeholder="All Districts" />
              </SelectTrigger>
              <SelectContent className="rounded-lg bg-card border-border/50">
                <SelectItem value="all" className="rounded-md">All Districts</SelectItem>
                {districts.map((district) => (
                  <SelectItem key={district} value={district} className="rounded-md">
                    {district}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">Sort By</Label>
            <Select value={filter.sort} onValueChange={handleSortChange}>
              <SelectTrigger className="mt-2 rounded-lg border-border/50 focus:ring-2 focus:ring-primary/50">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent className="rounded-lg bg-card border-border/50">
                <SelectItem value="default" className="rounded-md">Default</SelectItem>
                <SelectItem value="priceDesc" className="rounded-md">Price (High to Low)</SelectItem>
                <SelectItem value="capacityAsc" className="rounded-md">Capacity (Low to High)</SelectItem>
                <SelectItem value="capacityDesc" className="rounded-md">Capacity (High to Low)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueFilter;