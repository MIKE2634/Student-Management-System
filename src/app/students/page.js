'use client';

import { useState, useEffect } from 'react';
import Navigation from '../../components/Navigation';
import toast from 'react-hot-toast';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    admissionNo: '',
    name: '',
    email: '',
    phone: '',
    address: '',
    classStreamId: ''
  });

  useEffect(() => {
    fetchStudents();
    fetchClasses();
  }, []);

  const fetchStudents = async () => {
    const res = await fetch('/api/students');
    const data = await res.json();
    setStudents(data);
  };

  const fetchClasses = async () => {
    const res = await fetch('/api/classes');
    const data = await res.json();
    setClasses(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingStudent ? '/api/students' : '/api/students';
    const method = editingStudent ? 'PUT' : 'POST';
    const body = editingStudent ? { id: editingStudent.id, ...formData } : formData;

    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (res.ok) {
      toast.success(editingStudent ? 'Student updated' : 'Student registered');
      setShowModal(false);
      setEditingStudent(null);
      setFormData({ admissionNo: '', name: '', email: '', phone: '', address: '', classStreamId: '' });
      fetchStudents();
    } else {
      toast.error('Operation failed');
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Delete this student?')) {
      const res = await fetch(`/api/students?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Student deleted');
        fetchStudents();
      }
    }
  };

  const handleEdit = (student) => {
    setEditingStudent(student);
    setFormData({
      admissionNo: student.admissionNo,
      name: student.name,
      email: student.email || '',
      phone: student.phone || '',
      address: student.address || '',
      classStreamId: student.classStreamId
    });
    setShowModal(true);
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between mb-6">
            <h1 className="text-2xl font-bold">Students</h1>
            <button onClick={() => setShowModal(true)} className="bg-blue-600 text-white px-4 py-2 rounded">
              + Register Student
            </button>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Admission No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {students.map((student) => (
                  <tr key={student.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.admissionNo}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.classStream?.name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{student.email || '-'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button onClick={() => handleEdit(student)} className="text-blue-600 hover:text-blue-800 mr-3">Edit</button>
                      <button onClick={() => handleDelete(student.id)} className="text-red-600 hover:text-red-800">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {students.length === 0 && (
              <div className="p-8 text-center text-gray-500">No students registered yet</div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-96 max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingStudent ? 'Edit Student' : 'Register Student'}</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Admission Number" className="w-full p-2 border rounded mb-2"
                value={formData.admissionNo} onChange={e => setFormData({...formData, admissionNo: e.target.value})} required />
              <input type="text" placeholder="Full Name" className="w-full p-2 border rounded mb-2"
                value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              <input type="email" placeholder="Email (optional)" className="w-full p-2 border rounded mb-2"
                value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              <input type="text" placeholder="Phone (optional)" className="w-full p-2 border rounded mb-2"
                value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              <textarea placeholder="Address (optional)" className="w-full p-2 border rounded mb-2"
                value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              <select className="w-full p-2 border rounded mb-4"
                value={formData.classStreamId} onChange={e => setFormData({...formData, classStreamId: e.target.value})} required>
                <option value="">Select Class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => { setShowModal(false); setEditingStudent(null); }} 
                  className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
                  {editingStudent ? 'Update' : 'Register'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}