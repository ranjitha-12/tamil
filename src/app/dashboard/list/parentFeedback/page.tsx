'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

type FeedbackForm = {
  parentId: string;
  parentName: string;
  studentName: string;
  teacherId: string;
  rating: number;
  discussionSummary: string;
  feedbackText: string;
  suggestions: string;
};

type FeedbackItem = FeedbackForm & {
  _id: string;
  createdAt: string;
  teacher?: { name: string; surname: string };
};

export default function FeedbackPage() {
  const { data: session } = useSession();
  const parentId = session?.user?.id;
  const parentName = session?.user?.name;
  const [students, setStudents] = useState<any[]>([]);
  const [teachers, setTeachers] = useState<any[]>([]);
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [formData, setFormData] = useState<FeedbackForm>({
    parentId: '',
    parentName: '',
    studentName: '',
    teacherId: '',
    rating: 1,
    discussionSummary: '',
    feedbackText: '',
    suggestions: '',
  });

  const fetchFeedbacks = async (parentId: string) => {
    try {
      const res = await fetch(`/api/feedback?parentId=${parentId}`);
      const data = await res.json();
      if (data.success) setFeedbacks(data.feedbacks || []);
    } catch (error) {
      toast.error('Failed to fetch feedbacks');
    }
  };

  useEffect(() => {
    if (parentId && parentName) {
      setFormData((prev) => ({
        ...prev,
        parentName,
        parentId,
      }));
    }
  }, [parentId, parentName]);

  useEffect(() => {
    if (!parentId) return;

    fetch(`/api/student/fetchStudentsByParent?parentId=${parentId}`)
      .then((res) => res.json())
      .then((data) => setStudents(data.students || []));

    fetch(`/api/teacher/byParent?parentId=${parentId}`)
      .then((res) => res.json())
      .then((data) => setTeachers(data.teachers || []));

    fetchFeedbacks(parentId);
  }, [parentId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      studentName: selectedStudent,
      teacherId: selectedTeacher,
    };

    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json();

      if (json.success) {
        toast.success('Feedback submitted successfully');
        setFormData({
          parentId: parentId || '',
          parentName: parentName || '',
          studentName: '',
          teacherId: '',
          rating: 1,
          discussionSummary: '',
          feedbackText: '',
          suggestions: '',
        });
        setSelectedStudent('');
        setSelectedTeacher('');
      } else {
        toast.error('Failed to submit: ' + (json.error || 'Unknown error'));
      }
    } catch (err) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const renderStars = (count: number) =>
    Array.from({ length: 5 }).map((_, i) => (
      <span key={i} className={`text-xl ${i < count ? 'text-yellow-400' : 'text-gray-300'}`}>★</span>
    ));

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      <h1 className="text-lg font-semibold mb-6">📝 Submit Feedback</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-2 border-b pb-14">
        <select
          value={selectedStudent}
          onChange={(e) => setSelectedStudent(e.target.value)}
          className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
          required
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s._id} value={s.name}>{s.name}</option>
          ))}
        </select>

        <select
          value={selectedTeacher}
          onChange={(e) => setSelectedTeacher(e.target.value)}
          className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
          required
        >
          <option value="">Select Teacher</option>
          {teachers.map((t) => (
            <option key={t._id} value={t._id}>
              {t.name} {t.surname} ({t.email})
            </option>
          ))}
        </select>

        <textarea
          placeholder="Discussion Summary"
          value={formData.discussionSummary}
          onChange={(e) => setFormData({ ...formData, discussionSummary: e.target.value })}
          className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
          required
        />

        <textarea
          placeholder="Feedback"
          value={formData.feedbackText}
          onChange={(e) => setFormData({ ...formData, feedbackText: e.target.value })}
          className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
          required
        />

        <textarea
          placeholder="Suggestions (optional)"
          value={formData.suggestions}
          onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
          className="w-full ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm mb-5"
        />

        <div className="flex items-center space-x-2 mb-5">
          <span className="text-sm font-medium">Rating:</span>
          {renderStars(formData.rating).map((star, i) => (
            <span key={i} onClick={() => setFormData({ ...formData, rating: i + 1 })} className="cursor-pointer">
              {star}
            </span>
          ))}
          <span className="text-sm text-gray-500 ml-2">({formData.rating})</span>
        </div>

        <button disabled={submitting} type="submit" className="bg-blue-500 hover:bg-blue-600 float-end text-white py-2 px-6 rounded-md">
          {submitting ? 'Submitting...' : 'Submit Feedback'}
        </button>
      </form>

      <h2 className="text-md sm:text-lg font-semibold mb-4">📋 Your Feedbacks</h2>
      {feedbacks.length === 0 ? (
        <p className="text-gray-500">No feedback submitted yet.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((fb) => (
            <li key={fb._id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="text-md font-bold text-blue-600 mb-1">
                {fb.studentName} → {fb.teacher?.name || 'Teacher'} {fb.teacher?.surname || ''}
              </h3>
              <div className="flex items-center mb-1">{renderStars(fb.rating)}</div>
              <p className="text-sm text-gray-700 mb-1"><strong>Summary:</strong> {fb.discussionSummary}</p>
              <p className="text-sm text-gray-700 mb-1"><strong>Feedback:</strong> {fb.feedbackText}</p>
              {fb.suggestions && (
                <p className="text-sm text-gray-600"><strong>Suggestions:</strong> {fb.suggestions}</p>
              )}
              <p className="text-xs text-gray-400 mt-2">🗓 {new Date(fb.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
