'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Calendar, momentLocalizer, View, Views } from 'react-big-calendar';
import moment from 'moment-timezone';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

const ZONES = [
  { label: "IST", tz: "Asia/Kolkata" },
  { label: "CST", tz: "America/Chicago" },
  { label: "MST", tz: "America/Denver" },
  { label: "PST", tz: "America/Los_Angeles" },
];

interface CalendarEvent {
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  booked?: boolean;
}

const DAYS_OF_WEEK = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const colors = [
  "#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", "#E6B333", "#3366E6", "#999966",
  "#99FF99", "#B34D4D", "#80B300", "#809900", "#E6B3B3", "#6680B3", "#66991A", "#FF99E6",
  "#CCFF1A", "#FF1A66", "#E6331A", "#33FFCC", "#66994D", "#B366CC", "#4D8000", "#B33300",
  "#CC80CC", "#66664D", "#991AFF", "#E666FF", "#4DB3FF", "#1AB399", "#E666B3", "#33991A",
  "#CC9999", "#B3B31A", "#00E680", "#4D8066", "#809980", "#E6FF80", "#1AFF33", "#999933",
  "#FF3380", "#CCCC00", "#66E64D", "#4D80CC", "#9900B3", "#FF4D4D", "#99E6E6", "#6666FF",
  "#B3B300", "#FF6666"
];

const CalendarPage = () => {
  const { id } = useParams();
  const router = useRouter();

  const [teacher, setTeacher] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [date, setDate] = useState(new Date());
  const [view, setView] = useState<View>(Views.WEEK);
  const [selectedZone, setSelectedZone] = useState("Asia/Kolkata");
  const [localZone, setLocalZone] = useState("");

  useEffect(() => {
    const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setLocalZone(userZone);
    setSelectedZone(userZone);
  }, []);

  useEffect(() => {
    const fetchTeacher = async () => {
      const res = await fetch(`/api/teacher/${id}`);
      const data = await res.json();
      setTeacher(data.teacher);
    };
    const fetchBookings = async () => {
      const res = await fetch(`/api/booking?teacherId=${id}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    };

    if (id) {
      fetchTeacher();
      fetchBookings();
    }
  }, [id]);

  const parseTime = (timeStr: string) => {
    const time = moment(timeStr.trim(), ["hh:mm A", "HH:mm A"]);
    return {
      hour: time.hour(),
      minute: time.minute(),
    };
  };

  const isSlotBooked = (start: Date, end: Date) => {
    return bookings.some((booking) =>
      moment(booking.start).isSame(moment(start)) &&
      moment(booking.end).isSame(moment(end)) &&
      booking.status === "booked"
    );
  };

  const calendarEvents: CalendarEvent[] = useMemo(() => {
    if (!teacher || !teacher.assignments) return [];

    return teacher.assignments.flatMap((assignment: any, index: number) => {
      const { day, slots, classes, subjects } = assignment;
      const dayIndex = DAYS_OF_WEEK.indexOf(day);
      if (dayIndex === -1 || !slots) return [];

      return slots.flatMap((slot: string) => {
        const [startStrRaw, endStrRaw] = slot.split("-");
        if (!startStrRaw || !endStrRaw) return [];
        const startStr = startStrRaw.trim();
        const endStr = endStrRaw.trim();
        const startTime = parseTime(startStr);
        const endTime = parseTime(endStr);

        return Array.from({ length: 4 }).map((_, weekOffset) => {
          const baseDate = moment(date).startOf("week").add(dayIndex, "days").add(weekOffset, "weeks");
          const start = baseDate.clone().hour(startTime.hour).minute(startTime.minute).toDate();
          const end = baseDate.clone().hour(endTime.hour).minute(endTime.minute).toDate();
          const booked = isSlotBooked(start, end);
          const className = classes || "Unknown Class";
          const subjectName = subjects || "Unknown Subject";
          return {
            title: `${className} - ${subjectName}${booked ? " (Booked)" : ""}`,
            start,
            end,
            allDay: false,
            color: colors[(index + weekOffset) % colors.length],
            booked,
          };
        });
      });
    });
  }, [teacher, bookings, date]);

  const handleEventClick = () => {
    alert("⚠️ Please login first to book a class!");
    router.push(`/login`);
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold">View {teacher?.name}&apos;s Calendar</h1>
        <button
          onClick={() => window.history.back()}
          className="bg-[#3174ad] hover:bg-blue-600 text-white px-4 py-1 rounded-md"
        >
          Back
        </button>
      </div>
      <div className="mb-4 flex items-center gap-2">
        <label className="font-medium">Time Zone:</label>
        <select
          className="border p-2 rounded"
          value={selectedZone}
          onChange={(e) => setSelectedZone(e.target.value)}
        >
          {ZONES.map((zone) => (
            <option key={zone.tz} value={zone.tz}>
              {zone.label} ({zone.tz})
            </option>
          ))}
        </select>
        {selectedZone === localZone && (
          <span className="text-green-600 text-sm ml-2">(Your Local Time Zone)</span>
        )}
      </div>

      <div className="bg-white rounded shadow p-4">
        <Calendar
          localizer={localizer}
          events={calendarEvents}
          startAccessor="start"
          endAccessor="end"
          view={view}
          onView={(v) => setView(v)}
          date={date}
          onNavigate={(newDate) => setDate(newDate)}
          style={{ height: 600 }}
          onSelectEvent={handleEventClick}
          formats={{
            timeGutterFormat: (date) =>
              moment(date).tz(selectedZone).format("h:mm A"),
          }}
          min={new Date(2025, 0, 1, 4)}
          max={new Date(2025, 0, 1, 23)}
          eventPropGetter={(event: CalendarEvent) => ({
            style: {
              backgroundColor: event.booked ? "#d50000" : `${event.color || "#ccc"}99`,
              color: "black",
              border: "none",
              fontWeight: "500",
              textAlign: "center",
            },
          })}
        />
      </div>
    </div>
  );
};

export default CalendarPage;