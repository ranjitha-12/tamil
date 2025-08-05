'use client';
import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from 'next/navigation';
import moment from "moment-timezone";
import { useSession } from "next-auth/react";
import { FaClock, FaBook, FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";

const ZONES = moment.tz.names().map((tz) => {
  const now = moment.tz(tz);
  const offsetMinutes = now.utcOffset();
  const abbreviation = now.zoneAbbr();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const hours = Math.floor(Math.abs(offsetMinutes) / 60)
    .toString()
    .padStart(2, "0");
  const minutes = (Math.abs(offsetMinutes) % 60).toString().padStart(2, "0");
  const gmtOffset = `GMT${sign}${hours}:${minutes}`;
  return {
    tz,
    label: `${tz} (${abbreviation}) — ${gmtOffset}`,
  };
}).sort((a, b) => a.label.localeCompare(b.label));

interface Slot {
  date: string;
  localTime: string;
  utcTime: string;
  _id: string;
}

interface Assignment {
  classes: string;
  subjects: string;
  slots: Slot[];
}

interface Teacher {
  _id: string;
  name: string;
  surname: string;
  phone: string;
  classes: { _id: string; name: string }[];
  subjects: { _id: string; name: string }[];
  assignments: Assignment[];
}

interface Booking {
  _id: string;
  teacherId: string;
  title: string;
  start: string;
  end: string;
  status: "available" | "booked";
  studentId?: {
    _id: string;
    name: string;
    surname: string;
  };
}

const SelectedTeacherPage = () => {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const studentId = searchParams.get('studentId');
  const { data: session } = useSession();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [student, setStudent] = useState<any>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [selectedZone, setSelectedZone] = useState("Asia/Kolkata");
  const [studentPlan, setStudentPlan] = useState<string>("");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("all");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSelectedZone(userZone);
    moment.tz.setDefault(userZone);
  }, []);

  useEffect(() => {
    if (selectedZone && moment.tz.zone(selectedZone)) {
      moment.tz.setDefault(selectedZone);
    }
  }, [selectedZone]);

  useEffect(() => {
    if (id) fetchTeacher();
    if (studentId) {
      fetchStudentAndPlan();
      fetchAllBookings();
    }
  }, [id, studentId]);

  const fetchTeacher = async () => {
    const res = await fetch("/api/teacher");
    const data = await res.json();
    const selected = data.teachers.find((t: Teacher) => t._id === id);
    setTeacher(selected || null);
  };

  const fetchStudentAndPlan = async () => {
    const res = await fetch(`/api/student/${studentId}`);
    const data = await res.json();
    setStudent(data);
    setStudentPlan(data?.selectedPlan || "");
  };

  const fetchAllBookings = async () => {
    try {
      setIsLoading(true);
      const res = await fetch("/api/booking");
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const timelineCards = useMemo(() => {
     if (!teacher?.assignments) return [];
     const showAllSlots = true; 
     const assignments = teacher.assignments.map((assignment) => {
       const slotDetails = assignment.slots.map((slot) => {
         const [startTime, endTime] = slot.localTime.split('-');
         const start = moment.tz(`${slot.date} ${startTime}`, "YYYY-MM-DD hh:mmA", "Asia/Kolkata");
         const end = moment.tz(`${slot.date} ${endTime}`, "YYYY-MM-DD hh:mmA", "Asia/Kolkata");
   
         if (!start.isValid() || !end.isValid()) {
           console.warn('Invalid date/time:', slot.date, slot.localTime);
           return null;
         }
         const displayStart = start.clone().tz(selectedZone);
         const displayEnd = end.clone().tz(selectedZone);
   
         const dateStr = displayStart.format("D MMMM, YYYY dddd");
         const timeStr = `${displayStart.format("hh:mmA")} - ${displayEnd.format("hh:mmA")}`;
         const booking = bookings.find((b) => {
           const bookingStart = moment(b.start).tz("Asia/Kolkata");
           const bookingEnd = moment(b.end).tz("Asia/Kolkata");
           return (
             bookingStart.isSame(start) &&
             bookingEnd.isSame(end)
           );
         });
         let statusIcon = (
           <span className="text-blue-500 flex items-center gap-1">
             <FaClock /> Available
           </span>
         );
         if (booking) {
             statusIcon = (
               <span className="text-yellow-500 flex items-center gap-1">
                 <FaClock /> Booked
               </span>
             );
         }
         return {
           dateStr,
           timeStr,
           statusIcon,
           status: booking ? "booked" : "available",
           start: start.toDate(),
           end: end.toDate(), 
           originalStart: start,
           booking, 
         };
       }).filter(slot => slot !== null);
   
       const sortedSlots = [...slotDetails].sort((a, b) => {
         return a.originalStart.diff(b.originalStart);
       });
   
       let filteredSlots = timeRange === "all"  
         ? sortedSlots 
         : sortedSlots.filter(slot => {
             const slotMoment = moment(slot.start).tz(selectedZone);
             const now = moment().tz(selectedZone);
             let rangeStart, rangeEnd;
             if (timeRange === "week") {
               rangeStart = now.clone().startOf('week');
               rangeEnd = now.clone().endOf('week');
             } else { 
               rangeStart = now.clone().startOf('month');
               rangeEnd = now.clone().endOf('month');
             }
             return slotMoment.isBetween(rangeStart, rangeEnd, null, "[]");
           });
       if (!showAllSlots) {
         filteredSlots = filteredSlots.filter(slot => !slot.booking);
       }
       return {
         class: assignment.classes,
         subject: assignment.subjects,
         slots: filteredSlots,
       };
     }).filter(assignment => assignment.slots.length > 0);
   
     return assignments.sort((a, b) => {
       const aEarliest = a.slots[0].originalStart;
       const bEarliest = b.slots[0].originalStart;
       return aEarliest.diff(bEarliest);
     });
   }, [teacher, selectedZone, bookings, timeRange]); 

  const alreadyBookedForFreePlan = () => {
    if (studentPlan !== "free") return false;
    return bookings.some(b => b.studentId === student?._id);
  };

  const bookSlot = async (start: Date, end: Date, studentId: string) => {
    if (alreadyBookedForFreePlan()) {
      alert("Free plan allows only one booking.");
      return;
    }
    if (student?.sessionUsed >= student?.sessionLimit) {
      alert("You have reached the session limit for your current plan.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId,
          teacherId: teacher?._id,
          title: "Lesson Booking",
          start,
          end,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        alert("Booking successful!");
        await fetchAllBookings();
        // setBookings(prev => [...prev, data.booking]);
        setSelectedSlot(null);
      } else {
        alert(data.error || "Booking failed.");
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Booking failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotClick = (slot: any) => {
    if (slot.status === "booked") {
      alert("This slot is already booked.");
      return;
    }

    if (alreadyBookedForFreePlan()) {
      alert("Your free plan allows only one booking.");
      return;
    }

    if (student?._id) {
      setSelectedSlot({ start: slot.start, end: slot.end });
    }
  };

  return (
    <div className="px-4">
      <div className="mt-4 bg-white rounded-md p-4 h-[85vh]">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-xl font-semibold">
            {teacher ? `${teacher.name} ${teacher.surname} Schedule` : "Loading..."}
          </h1>
          <button onClick={() => window.history.back()} className="bg-blue-600 text-white px-4 py-1 rounded">
            Back
          </button>
        </div>
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="font-medium whitespace-nowrap">Time Zone:</label>
            <select
              className="border p-2 rounded w-full sm:w-auto min-w-[200px] max-w-full truncate"
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
            >
              {ZONES.map((zone) => (
                <option key={zone.tz} value={zone.tz}>
                  {zone.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <label className="font-medium whitespace-nowrap">View:</label>
            <div className="flex border rounded-md overflow-hidden w-full sm:w-auto">
              <button
                className={`px-3 py-1 flex-1 ${timeRange === "week" ? "bg-[#3174ad] text-white" : "bg-white"}`}
                onClick={() => setTimeRange("week")}
              >
                Week
              </button>
              <button
                className={`px-3 py-1 flex-1 ${timeRange === "month" ? "bg-[#3174ad] text-white" : "bg-white"}`}
                onClick={() => setTimeRange("month")}
              >
                Month
              </button>
              <button
                className={`px-3 py-1 flex-1 ${timeRange === "all" ? "bg-[#3174ad] text-white" : "bg-white"}`}
                onClick={() => setTimeRange("all")}
              >
                All
              </button>
            </div>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            {timelineCards.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {timelineCards.map((assignment, i) => (
                  <div key={i} className="bg-white rounded-lg border shadow-md">
                    <div className="p-4">
                      <h2 className="font-bold text-md mb-2 text-gray-700 flex items-center gap-2">
                        <FaBook /> {assignment.class}
                      </h2>
                      <p className="text-sm text-gray-500 flex items-center gap-2 mb-3">
                        <FaChalkboardTeacher /> {assignment.subject}
                      </p>
                      <ul className="space-y-3">
                        {assignment.slots.map((slot, idx) => (
                          <li 
                            key={idx} 
                            className={`text-sm border-b pb-2 cursor-pointer transition-colors ${
                              slot.status === "booked" 
                                ? "bg-red-50 text-red-600 border-red-100 cursor-not-allowed" 
                                : "hover:bg-blue-50 text-gray-600 border-gray-100"
                            }`}
                            onClick={() => handleSlotClick(slot)}
                          >
                            <div className="font-medium flex items-center gap-2">
                              <FaCalendarAlt /> {slot.dateStr}
                            </div>
                            <div className={`mb-1 ${
                              slot.status === "booked" ? "text-red-500" : "text-gray-500"
                            }`}>
                              🕒 {slot.timeStr}
                            </div>
                            <span className={`flex items-center gap-1 ${
                              slot.status === "booked" ? "text-red-500" : "text-blue-500"
                            }`}>
                              <FaClock /> {slot.status === "booked" ? "Booked" : "Available"}
                            </span>
                            {slot.booking && (
                              <div className="mt-1 text-xs text-gray-500">
                                Student: {slot.booking.studentId?.name || 'Unknown'} {slot.booking.studentId?.surname || ''}
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No available slots found for the selected time range.
              </div>
            )}
          </div>
        )}
      </div>

      {selectedSlot && student && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-[300px]">
            <h2 className="text-lg font-semibold mb-4">Confirm Booking</h2>
            <p className="mb-4">Student: <strong>{student.name} {student.surname} ({student.grade?.name})</strong></p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                onClick={() => bookSlot(selectedSlot.start, selectedSlot.end, student._id)}
                disabled={isLoading}
              >
                {isLoading ? "Booking..." : "Book"}
              </button>
              <button
                className="bg-gray-300 px-3 py-1 rounded disabled:opacity-50"
                onClick={() => setSelectedSlot(null)}
                disabled={isLoading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SelectedTeacherPage;