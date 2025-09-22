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
      if (!res.ok) throw new Error('Failed to fetch profile');
      const data = await res.json();
      setUserData(data);
      setFormData(data);
      setImagePreview(data.profileImage || null);
    } catch (error) {
      console.error('Failed to load profile:', error);
      toast.error('Failed to load profile');
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
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setFormData((prev: any) => ({
        ...prev,
        address: { ...prev.address, [key]: value },
      }));
    } else {
      setFormData((prev: any) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    //Required field validation
    const requiredFields = [
      'username',
      'email',
      'whatsapp',
      'fatherFirstName',
      'motherFirstName',
      'address.street',
      'address.city',
      'address.state',
      'address.postalCode',
      'address.country',
    ];

    for (const field of requiredFields) {
      if (field.startsWith('address.')) {
        const key = field.split('.')[1];
        if (!formData.address?.[key]) {
          toast.error(`Please fill out ${key}`);
          return;
        }
      } else {
        if (!formData[field]) {
          toast.error(`Please fill out ${field}`);
          return;
        }
      }
    }

    const form = new FormData();
    form.append('id', userId as string);

    Object.keys(formData).forEach((key) => {
      if (key !== 'address' && key !== 'profileImage' && key !== '_id' && key !== '__v') {
        if (typeof formData[key] === 'string' || typeof formData[key] === 'number') {
          form.append(key, formData[key].toString());
        }
      }
    });

    if (formData.address) {
      Object.keys(formData.address).forEach((key) => {
        if (formData.address[key]) {
          form.append(`address[${key}]`, formData.address[key]);
        }
      });
    }

    if (profileImage) {
      form.append('profileImage', profileImage);
    }

    try {
      setLoading(true);
      const res = await fetch(`/api/parents?id=${userId}`, {
        method: 'PUT',
        body: form,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success('Profile updated successfully!');
        setProfileImage(null);
        fetchProfile();
        router.push('/dashboard/parent');
      } else {
        console.error('Update failed:', data);
        toast.error(data.error || 'Failed to update profile');
      }
    } catch (err) {
      console.error('Update error:', err);
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (!userData) return <div className="flex justify-center items-center h-64">Loading...</div>;

  return (
    <div className="bg-white rounded-md flex-1 m-4 mt-0 p-1 sm:p-2 md:p-3 lg:p-4">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* Profile Image & Address */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="flex flex-col items-center md:col-span-1">
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
            className="w-full mt-4 mb-4 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="md:col-span-2">
          <h2 className="text-xl font-semibold mb-4">Address</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block font-medium text-gray-700">
                Street <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address.street"
                required
                value={formData.address?.street || ''}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
            {[
              { label: 'City', name: 'address.city' },
              { label: 'State', name: 'address.state' },
              { label: 'Postal Code', name: 'address.postalCode' },
              { label: 'Country', name: 'address.country' },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block font-medium text-gray-700">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name={name}
                  required
                  value={
                    name.split('.')[1] && formData.address
                      ? formData.address[name.split('.')[1]] || ''
                      : ''
                  }
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            {[
              { label: 'User Name', name: 'username' },
              { label: 'Email', name: 'email' },
              { label: 'WhatsApp Number', name: 'whatsapp' },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block font-medium text-gray-700">
                  {label} <span className="text-red-500">*</span>
                </label>
                <input
                  type={name === 'email' ? 'email' : 'text'}
                  name={name}
                  required
                  value={formData[name] || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            ))}
          </div>

          <div className="space-y-4">
            {[
              { label: 'Father First Name', name: 'fatherFirstName' },
              { label: 'Father Last Name', name: 'fatherLastName' },
              { label: 'Mother First Name', name: 'motherFirstName' },
              { label: 'Mother Last Name', name: 'motherLastName' },
            ].map(({ label, name }) => (
              <div key={name}>
                <label className="block font-medium text-gray-700">
                  {label} {name.includes('First') && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name={name}
                  required={name.includes('First')}
                  value={formData[name] || ''}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:border-blue-300"
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex gap-4 justify-end">
        <button
          type="submit"
          onClick={handleSubmit}
          className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;