
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

const Profile: React.FC<ProfileProps> = ({ user, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    department: user.department
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate({ ...user, ...formData });
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Manage Profile</h1>
      
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <div className="bg-indigo-600 h-32 relative">
          <div className="absolute -bottom-10 left-8">
            <div className="h-24 w-24 bg-white rounded-full p-1 border-4 border-white shadow-lg">
              <div className="h-full w-full bg-indigo-100 rounded-full flex items-center justify-center text-3xl font-bold text-indigo-700">
                {user.name.charAt(0)}
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-16 pb-8 px-8">
          <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
          <p className="text-gray-500">{user.role} &bull; {user.employeeCode}</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email Address</label>
                <input
                  type="email"
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <select
                  className="mt-1 block w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                  value={formData.department}
                  onChange={(e) => setFormData({...formData, department: e.target.value})}
                >
                  <option>Engineering</option>
                  <option>Human Resources</option>
                  <option>Marketing</option>
                  <option>Sales</option>
                  <option>Operations</option>
                </select>
              </div>
            </div>
            
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white px-8 py-2 rounded-lg font-medium hover:bg-indigo-700 transition"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
      
      <div className="bg-red-50 p-6 rounded-xl border border-red-100">
        <h3 className="text-red-800 font-bold mb-2">Privacy Control</h3>
        <p className="text-sm text-red-700 mb-4">
          Data privacy is critical. Your raw facial frames are processed locally and only anonymized logs are stored for long-term analytics. You can delete your historical session data at any time.
        </p>
        <button className="text-red-700 font-bold text-sm hover:underline">
          Purge Session History
        </button>
      </div>
    </div>
  );
};

export default Profile;
