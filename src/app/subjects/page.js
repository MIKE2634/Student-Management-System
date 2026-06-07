'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import toast from 'react-hot-toast';

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({ name: '', code: '' });

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const res = await fetch('/api/subjects');
    const data = await res.json();
    setSubjects(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = '/api/subjects';
    const method = editingSubject ? 'PUT' : 'POST';
    const body = editingSubject ? { id: editingSubject.id, ...formData } : formData;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      toast.success(editingSubject ? 'Subject updated' : 'Subject created');
      setShowModal(false);
      setEditingSubject(null);
      setFormData({ name: '', code: '' });
      fetchSubjects();
    } else {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this subject?')) {
      const res = await fetch(`/api/subjects?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Subject deleted');
        fetchSubjects();
      }
    }
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">Subjects</h1>
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
              + Add Subject
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Subject Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Code</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {subjects.map((subject) => (
                  <tr key={subject.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subject.code}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => {
                        setEditingSubject(subject);
                        setFormData({ name: subject.name, code: subject.code });
                        setShowModal(true);
                      }} className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                      <button onClick={() => handleDelete(subject.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {subjects.length === 0 && (
              <div className="p-8 text-center text-gray-500">No subjects added yet</div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96">
            <h2 className="text-xl font-bold mb-4">{editingSubject ? 'Edit Subject' : 'Add Subject'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Subject Name" className="w-full p-2 border rounded mb-2"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input type="text" placeholder="Subject Code" className="w-full p-2 border rounded mb-4"
                value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingSubject(null); }} 
                  className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  {editingSubject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}