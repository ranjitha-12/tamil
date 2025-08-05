'use client';
import { useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

const SubmitAssignmentPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async () => {
    if (!file || !id) {
      toast.error("File and Assignment ID required");
      return;
    }
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("assignmentId", id as string);
      formData.append("studentFile", file);

      const res = await fetch("/api/assignment/submit", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Submission failed");
        return;
      }

      toast.success("Assignment submitted successfully!");
      setFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setTimeout(() => {
        router.push("/dashboard/list/assignment/student");
      }, 1500);
    } catch (err) {
      console.error(err);
      toast.error("Error submitting assignment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-md sm:text-md md:text-lg lg:text-xl 2xl:text-xl font-semibold mb-6">Submit Assignment</h1>
        <button
          onClick={() => window.history.back()}
          className="ml-[4px] bg-[#3174ad] hover:bg-blue-600 text-white px-4 py-1 rounded-md"
        >
          Back
        </button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        accept=".pdf,.doc,.docx,.txt,.xls,.xlsx"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4"
      />

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
      >
        {loading ? "Submitting..." : "Submit Assignment"}
      </button>
    </div>
  );
};

export default SubmitAssignmentPage;
