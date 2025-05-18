
import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { format, parseISO, isBefore, startOfToday } from "date-fns";
import { toast } from "sonner";

interface EnhancedCalendarProps {
  venueId: string;
  bookedDates: string[];
  onDateSelect?: (dateStr: string) => void;
  selectedDate?: string;
}

const EnhancedCalendar = ({
  venueId,
  bookedDates,
  onDateSelect,
  selectedDate,
}: EnhancedCalendarProps) => {
  const [events, setEvents] = useState<any[]>([]);
  const today = startOfToday();

  // Convert booked dates to FullCalendar event objects
  useEffect(() => {
    if (!bookedDates || !bookedDates.length) {
      // If there are no booked dates but there's a selected date, just add the selected date
      if (selectedDate) {
        try {
          const date = parseISO(selectedDate);
          setEvents([{
            title: 'Selected',
            start: format(date, 'yyyy-MM-dd'),
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            textColor: '#FFFFFF',
            allDay: true,
            classNames: ['selected-date']
          }]);
        } catch (error) {
          console.error("Invalid selected date format:", selectedDate, error);
          setEvents([]);
        }
      } else {
        setEvents([]);
      }
      return;
    }

    const formattedEvents = bookedDates.map(dateStr => {
      // Parse ISO string to ensure valid date
      try {
        const date = parseISO(dateStr);
        return {
          title: 'Booked',
          start: format(date, 'yyyy-MM-dd'),
          backgroundColor: '#FF4040',
          borderColor: '#FF4040',
          textColor: '#FFFFFF',
          allDay: true,
          classNames: ['booked-date']
        };
      } catch (error) {
        console.error("Invalid date format:", dateStr, error);
        return null;
      }
    }).filter(Boolean);

    // Add selected date if available
    if (selectedDate) {
      try {
        const date = parseISO(selectedDate);
        formattedEvents.push({
          title: 'Selected',
          start: format(date, 'yyyy-MM-dd'),
          backgroundColor: '#4CAF50',
          borderColor: '#4CAF50',
          textColor: '#FFFFFF',
          allDay: true,
          classNames: ['selected-date']
        });
      } catch (error) {
        console.error("Invalid selected date format:", selectedDate, error);
      }
    }

    setEvents(formattedEvents);
  }, [bookedDates, selectedDate]);

  // Handle date click
  const handleDateClick = (info: any) => {
    const dateStr = info.dateStr;
    const clickedDate = parseISO(`${dateStr}T00:00:00.000Z`);
    
    // Check if date is in the past
    if (isBefore(clickedDate, today)) {
      toast.error("You cannot select a date in the past");
      return;
    }
    
    // Check if date is already booked
    const isBooked = bookedDates.some(bookedDate => {
      try {
        const formattedBookedDate = format(parseISO(bookedDate), 'yyyy-MM-dd');
        return formattedBookedDate === dateStr;
      } catch {
        return false;
      }
    });

    if (isBooked) {
      toast.warning("This date is already booked");
      return;
    }

    if (onDateSelect) {
      onDateSelect(`${dateStr}T00:00:00.000Z`);
    }
  };

  return (
    <div className="enhanced-calendar bg-white rounded-lg overflow-hidden shadow-sm">
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: ''
        }}
        events={events}
        dateClick={handleDateClick}
        eventContent={(eventInfo) => {
          return (
            <div className="text-xs p-1 overflow-hidden">
              {eventInfo.event.title}
            </div>
          );
        }}
        height="auto"
        eventClassNames="rounded-md"
        dayMaxEvents={1}
        moreLinkContent={(args) => `+${args.num} more`}
        dayCellClassNames={(arg) => {
          const today = startOfToday();
          const cellDate = arg.date;
          
          // If date is in the past
          if (isBefore(cellDate, today)) {
            return ['past-date', 'opacity-50', 'bg-gray-100', 'cursor-not-allowed'];
          }
          
          return [];
        }}
      />
      <div className="p-3 border-t text-xs text-muted-foreground">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-[#FF4040]"></div>
          <span>Booked Date - Unavailable</span>
        </div>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-3 h-3 rounded-full bg-[#4CAF50]"></div>
          <span>Selected Date</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span>Past Date - Not Available</span>
        </div>
      </div>
    </div>
  );
};

export default EnhancedCalendar;
