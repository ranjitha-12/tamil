import { Suspense } from 'react';
import SelectTeacher from '@/components/SelectTeacherClient';

export default function SelectTeacherPage() {
  return (
    <div className="p-4">
      <Suspense fallback={<p>Loading teachers...</p>}>
        <SelectTeacher />
      </Suspense>
    </div>
  );
}