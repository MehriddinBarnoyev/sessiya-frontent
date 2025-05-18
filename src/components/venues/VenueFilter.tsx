
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { VenueFilter as VenueFilterType } from "@/lib/types";
import { Search, Filter, X } from "lucide-react";

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
    district: "",
    sort: ""
  });

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFilter(prev => ({ ...prev, name }));
  };

  const handlePriceChange = (value: number[]) => {
    setFilter(prev => ({ 
      ...prev, 
      minPrice: value[0], 
      maxPrice: value[1] 
    }));
  };

  const handleCapacityChange = (value: number[]) => {
    setFilter(prev => ({ 
      ...prev, 
      minCapacity: value[0], 
      maxCapacity: value[1] 
    }));
  };

  const handleDistrictChange = (value: string) => {
    setFilter(prev => ({ ...prev, district: value }));
  };

  const handleSortChange = (value: string) => {
    setFilter(prev => ({ ...prev, sort: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange(filter);
  };

  const handleReset = () => {
    const resetFilter = {
      name: "",
      minPrice: 0,
      maxPrice,
      minCapacity: 0,
      maxCapacity,
      district: "",
      sort: ""
    };
    setFilter(resetFilter);
    onFilterChange(resetFilter);
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };  
  return (
    <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Input
                placeholder="Search venues..."
                value={filter.name}
                onChange={handleNameChange}
                className="pl-10"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
          </div>

          <div className="flex gap-2">
            <Button 
              type="button" 
              variant="outline" 
              size="icon" 
              onClick={toggleFilters}
              className="h-10 w-10"
            >
              {showFilters ? <X size={18} /> : <Filter size={18} />}
            </Button>
            <Button type="submit">Search</Button>
            <Button type="button" variant="ghost" onClick={handleReset}>Reset</Button>
          </div>
        </div>

        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-4 pt-4 border-t">
            <div>
              <Label>Price Range (${filter.minPrice} - ${filter.maxPrice})</Label>
              <Slider
                defaultValue={[filter.minPrice, filter.maxPrice]}
                min={0}
                max={maxPrice}
                step={10}
                value={[filter.minPrice || 0, filter.maxPrice || maxPrice]}
                onValueChange={handlePriceChange}
                className="mt-4"
              />
            </div>
            
            <div>
              <Label>Capacity ({filter.minCapacity} - {filter.maxCapacity} guests)</Label>
              <Slider
                defaultValue={[filter.minCapacity, filter.maxCapacity]}
                min={0}
                max={maxCapacity}
                step={10}
                value={[filter.minCapacity || 0, filter.maxCapacity || maxCapacity]}
                onValueChange={handleCapacityChange}
                className="mt-4"
              />
            </div>
            
            <div>
              <Label>District</Label>
              <Select 
                value={filter.district} 
                onValueChange={handleDistrictChange}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="All Districts" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All Districts</SelectItem>
                  {districts.map((district) => (
                    <SelectItem key={district} value={district}>
                      {district}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Sort By</Label>
              <Select 
                value={filter.sort} 
                onValueChange={handleSortChange}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue placeholder="Sort by..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Default</SelectItem>
                  <SelectItem value="priceAsc">Price (Low to High)</SelectItem>
                  <SelectItem value="priceDesc">Price (High to Low)</SelectItem>
                  <SelectItem value="capacityAsc">Capacity (Low to High)</SelectItem>
                  <SelectItem value="capacityDesc">Capacity (High to Low)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default VenueFilter;
