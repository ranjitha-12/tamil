"use client";
import React from "react";
const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <div className="overflow-x-auto mt-5">
    <table className="w-full text-md text-center text-gray-700">
      <thead className="mt-2">
        <tr className="text-left text-gray-500 text-md bg-gray-50">
          {columns.map((col) => (
            <th key={col.accessor} className={col.className}>{col.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>{Array.isArray(data) ? data.map((item) => renderRow(item)) : null}</tbody>
    </table>
    </div>
  );
};

export default Table;
