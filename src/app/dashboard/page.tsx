"use client";

import React, { useEffect, useState } from "react";
import {
  BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip as BarTooltip, Legend as BarLegend,
  ResponsiveContainer as BarResponsive
} from "recharts";
import {
  LineChart, Line, Tooltip as LineTooltip, ResponsiveContainer as LineResponsive
} from "recharts";
import {
  RadialBarChart, RadialBar, Legend as RadialLegend,
  Tooltip as RadialTooltip, ResponsiveContainer as RadialResponsive
} from "recharts";
import Table from "@/components/Table";

interface Teacher {
  _id: string;
  name: string;
  phone: string;
  address: string;
  subjects: { name: string }[];
  classes: { name: string }[];
}

const AdminDashboard = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [studentCount, setStudentCount] = useState<any[]>([]);
  const [parentCount, setParentCount] = useState<any[]>([]);
  const [allCount, setAllCount] = useState<any[]>([]);

  useEffect(() => {
    fetchTeachers();
    fetchAllCount();
    fetchStudentsCount();
    fetchParentsCount();
  }, []);

  const fetchTeachers = async () => {
    try {
      const res = await fetch("/api/teacher");
      const data = await res.json();
      setTeachers(data.teachers || []);
    } catch (error) {
      console.error("Failed to fetch teachers", error);
    }
  };

  const fetchAllCount = async () => {
    try {
      const res = await fetch("/api/allCount");
      const data = await res.json();
      setAllCount(data || []);
    } catch (error) {
      console.error("Failed to fetch all count", error);
    }
  };

  const fetchStudentsCount = async () => {
    try {
      const res = await fetch("/api/student/studentCount");
      const data = await res.json();
      setStudentCount(data || []);
    } catch (err) {
      console.error("Failed to fetch all students:", err);
    }
  };

  const fetchParentsCount = async () => {
    try {
      const res = await fetch("/api/parents/parentCount");
      const data = await res.json();
      setParentCount(data || []);
    } catch (err) {
      console.error("Failed to fetch parents:", err);
    }
  };

  const formatMonthlyData = (data: any[]) => {
    return data.map((entry) => ({
      month: entry.month.toString(),
      count: entry.count
    }));
  };

  const studentMonthlyData = formatMonthlyData(studentCount);
  const parentMonthlyData = formatMonthlyData(parentCount);

  const renderRow = (teacher: Teacher) => (
    <tr
      key={teacher._id}
      className="text-left text-gray-500 text-sm even:bg-slate-50 hover:bg-purple-100 mr-2"
    >
      <td className="py-3">{teacher.name}</td>
      <td className="py-3 hidden md:table-cell">{teacher.subjects.map(s => s.name).join(", ")}</td>
      <td className="py-3 hidden md:table-cell">{teacher.classes.map(c => c.name).join(", ")}</td>
      <td className="py-3">{teacher.phone}</td>
      <td className="py-3 hidden lg:table-cell">{teacher.address}</td>
    </tr>
  );

  const columns = [
    { header: "Info", accessor: "info" },
    { header: "Subjects", accessor: "subjects", className: "hidden md:table-cell" },
    { header: "Classes", accessor: "classes", className: "hidden md:table-cell" },
    { header: "Phone", accessor: "phone" },
    { header: "Address", accessor: "address", className: "hidden lg:table-cell" },
  ];

  return (
    <div className="px-1 sm:px-2 md:px-4 lg:px-3">
      <div className="mt-4 bg-gray rounded-md p-2 sm:p-1 md:p-2 lg:p-3 h-fit">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>

        {/* Charts Grid */}
        <div className="flex flex-col lg:flex-row gap-6 mb-12">
          {/* RadialBarChart - User Distribution */}
          <div className="bg-white rounded-xl shadow p-4 w-full lg:w-1/3">
            <h2 className="text-lg font-semibold text-center mb-4">User Distribution</h2>
            <div className="w-full h-64 sm:h-72">
              <RadialResponsive width="100%" height="100%">
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius="20%"
                  outerRadius="90%"
                  barSize={15}
                  data={allCount.map((item) => ({
                    name: item.name,
                    value: item.value,
                    fill:
                      item.name === "Parents"
                        ? "#ffc658"
                        : item.name === "Students"
                        ? "#82ca9d"
                        : "#8884d8"
                  }))}
                >
                  <RadialBar background dataKey="value" />
                  <RadialTooltip />
                  <RadialLegend
                    iconSize={10}
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    wrapperStyle={{
                      display: "flex",
                      flexWrap: "wrap",
                      justifyContent: "center",
                      paddingTop: 16,
                      rowGap: 8,
                    }}
                  />
                </RadialBarChart>
              </RadialResponsive>
            </div>
          </div>

          {/* Line Chart - Parent Count */}
          <div className="bg-white rounded-xl shadow p-4 w-full lg:w-1/3">
            <h2 className="text-lg font-semibold mb-2 text-center">Parent Growth</h2>
            <div className="h-64 sm:h-72">
              <LineResponsive width="100%" height="100%">
                <LineChart data={parentMonthlyData}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <LineTooltip />
                  <Line type="monotone" dataKey="count" stroke="#8884d8" />
                </LineChart>
              </LineResponsive>
            </div>
          </div>

          {/* Bar Chart - Student Enrollments */}
          <div className="bg-white rounded-xl shadow p-4 w-full lg:w-1/3">
            <h2 className="text-lg font-semibold mb-2 text-center">Student Enrollments</h2>
            <div className="h-64 sm:h-72">
              <BarResponsive width="100%" height="100%">
                <BarChart data={studentMonthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <BarTooltip />
                  <BarLegend />
                  <Bar dataKey="count" fill="#82ca9d" activeBar={<Rectangle fill="#8884d8" />} />
                </BarChart>
              </BarResponsive>
            </div>
          </div>
        </div>

        {/* Teacher Table */}
        <div className="bg-white rounded-xl shadow p-4">
          <Table columns={columns} renderRow={renderRow} data={teachers} />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;