import ChangePasswordForm from '@/components/forms/changePasswordForm';
import { Suspense } from 'react';

export default function ChangePasswordPage() {
  return (
    <div className="p-4">
      <Suspense fallback={<p>Loading Change Password Form...</p>}>
        <ChangePasswordForm />
      </Suspense>
    </div>
  );
}