
import { useState, useEffect } from "react";
import { addDays, format, parseISO, isBefore, startOfDay } from "date-fns";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface VenueCalendarProps {
  venueId: string;
  bookedDates: string[];
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

const VenueCalendar = ({ venueId, bookedDates, onDateSelect, selectedDate }: VenueCalendarProps) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Date[]>([]);
  const today = startOfDay(new Date());

  useEffect(() => {
    // Generate 30 days starting from current date
    const days = Array.from({ length: 42 }, (_, i) => addDays(currentDate, i - currentDate.getDay()));
    setCalendarDays(days);
  }, [currentDate]);

  // Format booked dates for comparison
  const formattedBookedDates = bookedDates.map(dateStr => {
    // Parse the ISO date string and format it to YYYY-MM-DD
    try {
      return format(new Date(dateStr), "yyyy-MM-dd");
    } catch (error) {
      console.error(`Error parsing date: ${dateStr}`, error);
      return "";
    }
  }).filter(Boolean);

  const isDateBooked = (date: Date): boolean => {
    const dateString = format(date, "yyyy-MM-dd");
    return formattedBookedDates.includes(dateString);
  };

  const isDatePast = (date: Date): boolean => {
    return isBefore(date, today);
  };

  const isDateSelected = (date: Date): boolean => {
    if (!selectedDate) return false;
    return format(date, "yyyy-MM-dd") === selectedDate;
  };

  const handleDateClick = (date: Date) => {
    if (isDateBooked(date) || isDatePast(date) || !onDateSelect) return;
    
    const formattedDate = format(date, "yyyy-MM-dd");
    onDateSelect(formattedDate);
  };

  const goToNextMonth = () => {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    setCurrentDate(nextMonth);
  };

  const goToPrevMonth = () => {
    const prevMonth = new Date(currentDate);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    
    // Don't allow going to past months
    const firstDayOfMonth = new Date(prevMonth.getFullYear(), prevMonth.getMonth(), 1);
    if (!isBefore(firstDayOfMonth, today)) {
      setCurrentDate(prevMonth);
    }
  };

  const getCurrentMonthYear = () => {
    return format(currentDate, "MMMM yyyy");
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToPrevMonth}
          disabled={isBefore(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1), today)}
        >
          <ChevronLeft size={16} className="mr-1" /> Previous
        </Button>
        <div className="text-sm font-medium">
          {getCurrentMonthYear()}
        </div>
        <Button 
          variant="outline" 
          size="sm"
          onClick={goToNextMonth}
        >
          Next <ChevronRight size={16} className="ml-1" />
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 sm:gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center text-sm font-medium py-1">
            {day}
          </div>
        ))}

        {calendarDays.map((date, index) => {
          const isPast = isDatePast(date);
          const isBooked = isDateBooked(date);
          const isSelected = isDateSelected(date);
          const isCurrentMonth = date.getMonth() === currentDate.getMonth();
          
          return (
            <button
              key={index}
              className={cn(
                "h-10 rounded-md text-center text-sm font-medium transition-colors",
                !isCurrentMonth && "opacity-30",
                isPast && "bg-muted text-muted-foreground cursor-not-allowed",
                isBooked && "bg-red-200 text-red-700 cursor-not-allowed",
                isSelected && "bg-primary text-primary-foreground",
                !isPast && !isBooked && !isSelected && isCurrentMonth && "bg-secondary hover:bg-secondary/80 cursor-pointer"
              )}
              onClick={() => handleDateClick(date)}
              disabled={isPast || isBooked || !isCurrentMonth}
            >
              {format(date, "d")}
            </button>
          );
        })}
      </div>
      
      <div className="flex justify-center items-center space-x-4 mt-4 text-sm">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-secondary rounded-full mr-1"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-red-200 rounded-full mr-1"></div>
          <span>Booked</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 bg-muted rounded-full mr-1"></div>
          <span>Past</span>
        </div>
      </div>
    </div>
  );
};

export default VenueCalendar;
