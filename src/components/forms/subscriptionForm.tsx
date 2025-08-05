'use client';

import { useState, useEffect } from 'react';

interface SubscriptionData {
  _id?: string;
  name: string;
  price: string;
  value: string;
  features: string[];
}

interface SubscriptionFormProps {
  existingSubscription?: SubscriptionData;
  onClose: () => void;
}

export default function SubscriptionForm({ existingSubscription, onClose }: SubscriptionFormProps) {
  const [formData, setFormData] = useState<SubscriptionData>({
    name: '',
    price: '',
    value: '',
    features: [''],
  });

  useEffect(() => {
    if (existingSubscription) {
      setFormData(existingSubscription);
    } else {
      setFormData({ name: '', price: '', value: '', features: [''] });
    }
  }, [existingSubscription]);

  const handleChange = ( e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFeatureChange = (index: number, value: string) => {
    const updatedFeatures = [...formData.features];
    updatedFeatures[index] = value;
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures,
    }));
  };

  const addFeature = () => {
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, ''],
    }));
  };

  const removeFeature = (index: number) => {
    const updatedFeatures = formData.features.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      features: updatedFeatures,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = existingSubscription ? 'PUT' : 'POST';
    const endpoint = existingSubscription
      ? `/api/subscription?id=${existingSubscription._id}`
      : '/api/subscription';

    try {
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error('Request failed');

      alert(`Subscription ${existingSubscription ? 'updated' : 'created'} successfully!`);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error saving Subscription');
    }
  };

  return (
    <form className="flex flex-col gap-6 p-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-2">
        <label className="font-medium">Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="Enter subscription name"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Price:</label>
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          required
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="Enter price"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Value:</label>
        <input
          type="text"
          name="value"
          value={formData.value}
          onChange={handleChange}
          required
          className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm"
          placeholder="Enter value"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label className="font-medium">Features:</label>
        {formData.features.map((feature, index) => (
          <div key={index} className="flex items-center gap-2">
            <input
              type="text"
              value={feature}
              onChange={e => handleFeatureChange(index, e.target.value)}
              className="ring-[1.5px] ring-gray-300 p-2 rounded-md text-sm flex-1"
              placeholder={`Feature ${index + 1}`}
            />
            {formData.features.length > 1 && (
              <button
                type="button"
                onClick={() => removeFeature(index)}
                className="text-red-500 font-bold text-sm"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={addFeature}
          className="text-blue-600 underline text-sm"
        >
          + Add Feature
        </button>
      </div>

      <div className="flex gap-4 justify-end">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-6 rounded-md"
          >
           {existingSubscription ? "Update" : "Create"}
          </button>
          <button
            type="button"
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-2 px-6 rounded-md"
           onClick={onClose}
          >
            Cancel
          </button>
        </div>
    </form>
  );
}
