'use client';
import { useEffect, useMemo, useState } from "react";
import moment from "moment-timezone";
import { useSession } from "next-auth/react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaBook, FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";

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

interface Attendance {
  _id: string;
  booking: Booking;
  student: { name: string; surname: string };
  status: string;
  lateDuration: string;
}

const DashboardPage = () => {
  const { data: session } = useSession();
  const teacherId = session?.user?.id;
  const teachername = session?.user?.name;
  const userRole = session?.user?.role;
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>("Asia/Kolkata");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("all");
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [attendanceStatus, setAttendanceStatus] = useState<string>("PRESENT");
  const [lateDuration, setLateDuration] = useState("");

  useEffect(() => {
    const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setSelectedZone(userZone);
    moment.tz.setDefault(userZone);
  }, []);

  useEffect(() => {
    if (teacherId) {
      fetchTeacher();
      fetchBookings();
      fetchAttendances();
    }
  }, [teacherId]);

  const fetchTeacher = async () => {
    try {
      const res = await fetch(`/api/teacher/${teacherId}`);
      const data = await res.json();
      setTeacher(data.teacher || null);
    } catch (err) {
      console.error("Error fetching teacher:", err);
    }
  };

  const fetchBookings = async () => {
    try {
      const res = await fetch(`/api/booking?teacherId=${teacherId}`);
      const data = await res.json();
      setBookings(data.bookings || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  const fetchAttendances = async () => {
    try {
      const res = await fetch(`/api/attendance?teacherId=${teacherId}`);
      const data = await res.json();
      setAttendances(data.attendances || []);
    } catch (err) {
      console.error("Error fetching attendances:", err);
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
       const attendance = attendances.find((a) => a.booking._id === booking?._id);
       let statusIcon = (
         <span className="text-blue-500 flex items-center gap-1">
           <FaClock /> Available
         </span>
       );
       if (booking)   {
        if (attendance) {
          switch (attendance.status) {
            case "PRESENT":
            statusIcon = (
            <span className="text-green-600 flex items-center gap-1">
              <FaCheckCircle /> Present
            </span>
            );
          break;
          case "LATE":
            statusIcon = (
            <span className="text-yellow-600 flex items-center gap-1">
              <FaClock /> Late
              {attendance.lateDuration && (
                <span className="text-xs text-yellow-600 ml-1">({attendance.lateDuration})</span>
              )}
            </span>
            );
          break;
          case "ABSENT":
          default:
            statusIcon = (
            <span className="text-red-500 flex items-center gap-1">
              <FaTimesCircle /> Absent
            </span>
            );
          break;
          }
        } else {
          statusIcon = (
            <span className="text-yellow-500 flex items-center gap-1">
              <FaClock /> Booked
            </span>
          );
          }
        }
       return {
         dateStr,
         timeStr,
         statusIcon,
         start: start.toDate(),
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
 }, [teacher, selectedZone, bookings, attendances, timeRange]); 

  const handleMarkAttendance = (slot: any) => {
    if (slot.booking) {
      setSelectedBooking(slot.booking);
    }
  };

  const handleSubmitAttendance = async () => {
    if (!selectedBooking) return;
    try {
      const res = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedBooking.studentId,
          bookingId: selectedBooking._id,
          status: attendanceStatus,
          lateDuration: attendanceStatus === "LATE" ? lateDuration : undefined,
        }),
      });
      const result = await res.json();
      if (res.ok) {
        fetchAttendances();
        setSelectedBooking(null);
      } else {
        alert(result.error || "Failed to mark attendance");
      }
    } catch (err) {
      console.error("Submit error:", err);
    }
  };

  return (
    <div className="px-1 sm:px-2 md:px-3 lg:px-4">
      <div className="mt-4 bg-white rounded-md p-4">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold mb-6">
          Welcome, {teachername}
        </h1>

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

        <div className="overflow-x-auto">
          {timelineCards.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {timelineCards.map((assignment, i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg border shadow-md"
                >
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
                          className={`text-sm text-gray-600 border-b pb-2 ${
                              slot.booking?.status === "booked" 
                                ? "bg-red-50 text-red-600 border-red-100 cursor-pointer" 
                                : "hover:bg-blue-50 text-gray-600 border-gray-100"
                            }`}
                          onClick={() => slot.booking && handleMarkAttendance(slot)}
                        >
                          <div className="font-medium flex items-center gap-2">
                            <FaCalendarAlt /> {slot.dateStr}
                          </div>
                          <div className={`mb-1 ${
                              slot.booking?.status === "booked" ? "text-red-500" : "text-gray-500"
                            }`}>
                            🕒 {slot.timeStr}</div>
                          {slot.statusIcon}
                          {slot.booking && (
                            <div className="mt-1 text-xs">
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
      </div>

      {selectedBooking && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md max-w-md w-full">
            <h3 className="text-xl font-bold mb-4">Mark Attendance</h3>
            <p className="mb-2"><strong>Student:</strong> {selectedBooking.studentId?.name || 'Unknown'} {selectedBooking.studentId?.surname || ''}</p>
            <p className="mb-2"><strong>Time:</strong> {moment(selectedBooking.start).format("D MMMM, hh:mmA")}</p>
            <label className="block mb-2 font-medium">Status:</label>
            <select
              className="border p-2 rounded w-full mb-4"
              value={attendanceStatus}
              onChange={(e) => setAttendanceStatus(e.target.value)}
            >
              <option value="PRESENT">Present</option>
              <option value="ABSENT">Absent</option>
              <option value="LATE">Late</option>
            </select>
            {attendanceStatus === "LATE" && (
              <div className="mb-4">
                <label className="block mb-2 font-medium">Late Duration (e.g., 5 mins):</label>
                  <input type="text" className="border p-2 rounded w-full" value={lateDuration} 
                    onChange={(e) => setLateDuration(e.target.value)} placeholder="Enter minutes late"/>
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button 
                onClick={() => setSelectedBooking(null)} 
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitAttendance} 
                className="px-4 py-2 bg-[#3174ad] text-white rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;