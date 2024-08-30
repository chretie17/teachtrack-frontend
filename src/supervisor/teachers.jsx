import React, { useState, useEffect } from 'react';

const apiService = {
  getBaseURL: () => 'http://localhost:5000', // Replace with your actual base URL
};

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ id: null, username: '', email: '' });

  useEffect(() => {
    fetchTeachers();
  }, []);

  const fetchTeachers = async () => {
    try {
      const response = await fetch(`${apiService.getBaseURL()}/api/supervisor/teachers`);
      const data = await response.json();
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (form.id) {
        await fetch(`${apiService.getBaseURL()}/api/supervisor/teachers/${form.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(form),
        });
      } else {
        // Create teacher logic here
      }
      setOpen(false);
      fetchTeachers();
    } catch (error) {
      console.error('Error saving teacher:', error);
    }
  };

  const handleEdit = (teacher) => {
    setForm(teacher);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`${apiService.getBaseURL()}/api/supervisor/teachers/${id}`, {
        method: 'DELETE',
      });
      fetchTeachers();
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  const handleClose = () => {
    setForm({ id: null, username: '', email: '' });
    setOpen(false);
  };

  return (
    <div className="manage-teachers">
      <div className="container">
        <div className="header">
          <h1>Manage Teachers</h1>
        </div>
        <div className="content">
          <table>
            <thead>
              <tr>
                <th>Username</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {teachers.map((teacher) => (
                <tr key={teacher.id}>
                  <td>{teacher.username}</td>
                  <td>{teacher.email}</td>
                  <td>
                    <button className="btn btn-edit" onClick={() => handleEdit(teacher)}>
                      Edit
                    </button>
                    <button className="btn btn-delete" onClick={() => handleDelete(teacher.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {open && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{form.id ? 'Edit Teacher' : 'Add Teacher'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={handleClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .manage-teachers {
          font-family: Arial, sans-serif;
          background-color: #f0f0f0;
          min-height: 100vh;
          padding: 2rem;
        }
        .container {
          max-width: 800px;
          margin: 0 auto;
          background-color: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
          background-color: #00447b;
          color: white;
          padding: 1.5rem;
        }
        h1 {
          margin: 0;
          font-size: 1.5rem;
        }
        .content {
          padding: 1.5rem;
        }
        table {
          width: 100%;
          border-collapse: collapse;
        }
        th, td {
          text-align: left;
          padding: 0.75rem;
          border-bottom: 1px solid #e0e0e0;
        }
        th {
          background-color: #f5f5f5;
          font-weight: bold;
        }
        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background-color 0.3s;
        }
        .btn-edit {
          background-color: #4caf50;
          color: white;
          margin-right: 0.5rem;
        }
        .btn-delete {
          background-color: #f44336;
          color: white;
        }
        .btn-edit:hover {
          background-color: #45a049;
        }
        .btn-delete:hover {
          background-color: #d32f2f;
        }
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
        }
        .modal {
          background-color: white;
          padding: 2rem;
          border-radius: 8px;
          width: 100%;
          max-width: 400px;
        }
        .form-group {
          margin-bottom: 1rem;
        }
        label {
          display: block;
          margin-bottom: 0.5rem;
        }
        input {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid #ccc;
          border-radius: 4px;
        }
        .form-actions {
          display: flex;
          justify-content: flex-end;
          margin-top: 1rem;
        }
        .btn-secondary {
          background-color: #f0f0f0;
          color: #333;
          margin-right: 0.5rem;
        }
        .btn-primary {
          background-color: #00447b;
          color: white;
        }
        .btn-secondary:hover {
          background-color: #e0e0e0;
        }
        .btn-primary:hover {
          background-color: #003366;
        }
      `}</style>
    </div>
  );
};

export default ManageTeachers;