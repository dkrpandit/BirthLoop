import { useState, useEffect } from "react";

const MemberFormModal = ({ isOpen, onClose, onSubmit, existingData }) => {
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    email: "",
    phone: "",
    relationship: "friend",
    notificationPreferences: { enabled: true, time: "09:00" }
  });

  useEffect(() => {
    if (existingData) {
      setFormData(existingData);
    } else {
      setFormData({
        name: "",
        birthDate: "",
        email: "",
        phone: "",
        relationship: "friend",
        notificationPreferences: { enabled: true, time: "09:00" }
      });
    }
  }, [existingData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-lg font-bold mb-4">{existingData ? "Edit Member" : "Add Member"}</h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="date"
            name="birthDate"
            value={formData.birthDate}
            onChange={handleChange}
            required
            className="w-full border p-2 rounded"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border p-2 rounded"
          />
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Phone Number"
            className="w-full border p-2 rounded"
          />
          <select
            name="relationship"
            value={formData.relationship}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="family">Family</option>
            <option value="friend">Friend</option>
            <option value="colleague">Colleague</option>
            <option value="other">Other</option>
          </select>
          <button type="submit" className="bg-blue-600 text-white w-full p-2 rounded">
            {existingData ? "Update Member" : "Add Member"}
          </button>
        </form>
        <button onClick={onClose} className="mt-2 text-gray-600">Cancel</button>
      </div>
    </div>
  );
};

export default MemberFormModal;
