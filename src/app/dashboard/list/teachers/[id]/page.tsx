'use client';
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import moment from "moment-timezone";
import { useSession } from "next-auth/react";
import { FaCheckCircle, FaTimesCircle, FaClock, FaCalendarAlt, FaBook, FaChalkboardTeacher } from "react-icons/fa";

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

interface SlotEvent {
  title: string;
  start: Date;
  end: Date;
  color: string;
  booked: boolean;
  attendanceStatus: string;
  dateStr: string;
  timeStr: string;
  class: string;
  subject: string;
}
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
  studentId?: {
    _id: string;
    name: string;
    surname: string;
  };
  teacherId: string;
  title: string;
  start: string;
  end: string;
  status: "available" | "booked";
}
interface Attendance {
  _id: string;
  booking: Booking;
  student: { name: string; surname: string };
  status: string;
  lateDuration: string;
}

const colors = ["#FF6633", "#FFB399", "#FF33FF", "#FFFF99", "#00B3E6", "#E6B333"];

const SingleTeacherPage = () => {
  const { id } = useParams();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [attendances, setAttendances] = useState<Attendance[]>([]);
  const { data: session } = useSession();
  const userRole = session?.user?.role;
  const [selectedZone, setSelectedZone] = useState<string>("Asia/Kolkata");
  const [timeRange, setTimeRange] = useState<"week" | "month" | "all">("all");
  const [localZone, setLocalZone] = useState<string>("");
   const [lateDuration, setLateDuration] = useState("");

  const findAttendanceStatus = (start: Date, end: Date): string => {
    const startUtc = moment(start).utc();
    const endUtc = moment(end).utc();
    const found = attendances.find((att) => {
      const bookingStart = moment(att.booking.start).utc();
      const bookingEnd = moment(att.booking.end).utc();
      return (
        bookingStart.isSame(startUtc, 'minute') &&
        bookingEnd.isSame(endUtc, 'minute')
      );
    });
    return found?.status || "N/A";
  };

  const isSlotBooked = (start: Date, end: Date) => {
    const startUtc = moment(start).utc();
    const endUtc = moment(end).utc();
    return bookings.some((booking) => {
      const bookingStart = moment(booking.start).utc();
      const bookingEnd = moment(booking.end).utc();
      return (
        bookingStart.isSame(startUtc, 'minute') &&
        bookingEnd.isSame(endUtc, 'minute') &&
        booking.status === "booked"
      );
    });
  };

  useEffect(() => {
    const userZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setLocalZone(userZone);
    setSelectedZone(userZone);
    moment.tz.setDefault(userZone);
  }, []);

  useEffect(() => {
    if (selectedZone && moment.tz.zone(selectedZone)) {
      moment.tz.setDefault(selectedZone);
    }
  }, [selectedZone]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [teacherRes, bookingsRes, attendanceRes] = await Promise.all([
          fetch(`/api/teacher/${id}`),
          fetch(`/api/booking?teacherId=${id}`),
          fetch(`/api/attendance?teacherId=${id}`)
        ]);
        const [teacherData, bookingsData, attendanceData] = await Promise.all([
          teacherRes.json(),
          bookingsRes.json(),
          attendanceRes.json()
        ]);
        setTeacher(teacherData.teacher || null);
        setBookings(bookingsData.bookings || []);
        setAttendances(attendanceData.attendances || []);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };
    if (id) fetchData();
  }, [id]);

 const parseUTCTimeRange = (utcTime: string) => {
    try {
      const [startUTC, endUTC] = utcTime.split('-');
      return {
        start: moment.utc(startUTC.trim()),
        end: moment.utc(endUTC.trim())
      };
    } catch (error) {
      console.error('Error parsing UTC time range:', utcTime, error);
      return { start: moment.invalid(), end: moment.invalid() };
    }
  };

  // Modified timelineEvents to use UTC times and convert to selected zone
  const timelineEvents = useMemo(() => {
    if (!teacher?.assignments) return [];
    const events: SlotEvent[] = [];
    teacher.assignments.forEach((assignment) => {
      assignment.slots.forEach((slot) => {
        const { start: startUTC, end: endUTC } = parseUTCTimeRange(slot.utcTime);
        if (!startUTC.isValid() || !endUTC.isValid()) {
          console.warn('Invalid UTC time range:', slot.utcTime);
          return;
        }
        const start = startUTC.tz(selectedZone);
        const end = endUTC.tz(selectedZone);

        const dateStr = start.format("D MMMM, YYYY dddd");
        const timeStr = `${start.format("hh:mmA")} - ${end.format("hh:mmA")}`;
        const booked = isSlotBooked(start.toDate(), end.toDate());
        const attendanceStatus = findAttendanceStatus(start.toDate(), end.toDate());

        events.push({
          title: `${assignment.classes} - ${assignment.subjects}`,
          start: start.toDate(),
          end: end.toDate(),
          color: colors[Math.floor(Math.random() * colors.length)],
          booked,
          attendanceStatus,
          dateStr,
          timeStr,
          class: assignment.classes,
          subject: assignment.subjects,
        });
      });
    });
    return events.sort((a, b) => a.start.getTime() - b.start.getTime());
  }, [teacher, bookings, attendances, selectedZone]);

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
  
  const sendSchedule = async () => {
    if (!teacher) return;
    const phoneNumber = teacher.phone;
    const formattedMessage = timelineEvents.map(event => 
      `${event.dateStr}: ${event.class} - ${event.subject} (${event.timeStr})`
    ).join("\n");
    try {
      const res = await fetch("/api/sendMessage", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phoneNumber, message: formattedMessage }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Schedule sent via WhatsApp!");
      } else {
        console.error("Failed to send:", data.error);
        alert("Failed to send schedule.");
      }
    } catch (error) {
      console.error("Send Error:", error);
      alert("Something went wrong.");
    }
  };

  return (
    <div className="px-1 sm:px-2 md:px-3 lg:px-4">
      <div className="mt-4 bg-white rounded-md p-4">
        <div className="flex g-5 items-center justify-between mb-4">
          <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold mb-6">
            {teacher ? `${teacher.name} ${teacher.surname} Available Slot Details` : 'Teacher Available Slot Details'}
          </h1>
          <div>
            {userRole === "Admin" && (
              <button
                onClick={sendSchedule}
                disabled={!teacher}
                className="bg-[#3174ad] hover:bg-blue-600 text-white px-4 py-1 rounded-md"
              >
                Send Schedule
              </button>
            )}
            <button
              onClick={() => window.history.back()}
              className="ml-[4px] bg-[#3174ad] hover:bg-blue-600 text-white px-4 py-1 mt-1 rounded-md"
            >
              Back
            </button>
          </div>
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
                         <li key={idx} 
                          className={`text-sm text-gray-600 border-b pb-2 ${
                              slot.booking?.status === "booked" 
                                ? "bg-red-50 text-red-600 border-red-100 cursor-not-allowed" 
                                : "hover:bg-blue-50 text-gray-600 border-gray-100"
                            }`}>
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
    </div>
  );
};
export default SingleTeacherPage;