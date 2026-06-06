'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import toast from 'react-hot-toast';

export default function ClassesPage() {
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', code: '' });

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/classes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    if (res.ok) {
      toast.success('Class created');
      setShowModal(false);
      setFormData({ name: '', code: '' });
      fetchClasses();
    } else {
      toast.error('Failed to create class');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this class?')) {
      await fetch(`/api/classes?id=${id}`, { method: 'DELETE' });
      toast.success('Class deleted');
      fetchClasses();
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">Class Streams</h1>
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
              + New Class
            </button>
          </div>

          <div className="bg-white rounded-lg shadow">
            {classes.map(c => (
              <div key={c.id} className="p-4 border-b flex justify-between items-center">
                <div>
                  <div className="font-semibold">{c.name}</div>
                  <div className="text-sm text-gray-600">Code: {c.code}</div>
                  <div className="text-sm text-gray-600">Students: {c.students?.length || 0}</div>
                </div>
                <button onClick={() => handleDelete(c.id)} className="text-red-600">Delete</button>
              </div>
            ))}
            {classes.length === 0 && (
              <div className="p-8 text-center text-gray-500">No classes yet</div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">Create Class</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Class Name" className="w-full p-2 border rounded mb-2"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input type="text" placeholder="Class Code" className="w-full p-2 border rounded mb-4"
                value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}