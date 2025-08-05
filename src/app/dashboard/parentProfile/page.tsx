'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const ProfilePage = () => {
  const { data: session } = useSession();
  const userId = session?.user?.id;
  const userRole = session?.user?.role;
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [formData, setFormData] = useState<any>({});
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (userId && userRole) fetchProfile();
  }, [userId, userRole]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`/api/parents/${userId}`);
      const data = await res.json();
      setUserData(data);
      setFormData(data);
      setImagePreview(data.profileImage || null);
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  };

  const handleImageChange = (e: any) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev: any) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  const form = new FormData();
  form.append('id', userId as string);

  Object.keys(formData).forEach((key) => {
    if (
      key !== "profileImage" && 
      (typeof formData[key] === 'string' || typeof formData[key] === 'number')
    ) {
      form.append(key, formData[key].toString());
    }
  });

  if (profileImage) {
    form.append('profileImage', profileImage);
  }

  try {
    setLoading(true);
    const res = await fetch(`/api/parents?id=${userId}`, {
      method: 'PUT',
      body: form,
    });

    if (res.ok) {
      toast.success('Profile updated!');
      setProfileImage(null);
      fetchProfile();
      router.push('/dashboard/parent');
    } else {
      toast.error('Failed to update profile');
    }
  } catch (err) {
    console.error(err);
    toast.error('Something went wrong');
  } finally {
    setLoading(false);
  }
};

  if (!userData) return <p>Loading...</p>;

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Left Column: Image Upload */}
        <div className="flex flex-col items-center">
          <Image
            src={imagePreview || '/noimage.png'}
            alt="Profile"
            width={150}
            height={150}
            className="rounded-full border object-cover"
          />
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
           className="w-full file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 mb-4 items-center mt-4"
          />
        </div>

        {/* Right Column: Editable Info */}
        <div className="space-y-4">
          {[
            { label: 'Username', name: 'username' },
            { label: 'Email', name: 'email' },
            { label: 'WhatsApp', name: 'whatsapp' },
            { label: 'Father First Name', name: 'fatherFirstName' },
            { label: 'Father Last Name', name: 'fatherLastName' },
            { label: 'Mother First Name', name: 'motherFirstName' },
            { label: 'Mother Last Name', name: 'motherLastName' },
            { label: 'State', name: 'state' },
            { label: 'Country', name: 'country' },
          ].map(({ label, name }) => (
            <div key={name}>
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <input
                type="text"
                name={name}
                value={formData[name] || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          ))}
          <div className="flex gap-4 justify-end">
          <button type="submit" onClick={handleSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md" disabled={loading}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
        </div>
      </div>
    </div>
  );
}
export default ProfilePage;