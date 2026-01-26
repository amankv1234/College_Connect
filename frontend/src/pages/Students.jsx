import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';
import ProfileCard from '../components/ProfileCard';

const Students = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ branch: '', year: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    loadStudents();
  }, [user]); // Reload students if user changes (e.g., logout/login)

  const loadStudents = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getAllStudents();
      setStudents(response.data);
      setError('');
    } catch (error) {
      console.error('Error loading students:', error);
      setError('Failed to load student list. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student => {
    // Filter by branch
    if (filter.branch && student.branch !== filter.branch) return false;
    // Filter by year
    if (filter.year && student.year && student.year !== filter.year) return false; // Check for student.year existence
    // Exclude the current user's profile
    return String(student._id) !== String(user?.id);
  });

  if (loading) return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', fontSize: '1.2rem', color: '#667eea' }}>
      Loading students...
    </div>
  );
  if (error) return (
    <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem', fontSize: '1.1rem' }}>
      {error}
    </div>
  );

  return (
    <div style={{ maxWidth: '1200px', margin: '2rem auto', padding: '2rem', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '2.5rem', fontSize: '2.5rem', fontWeight: '700' }}>
        All Students
      </h2>
      
      <div style={{ 
        marginBottom: '2rem', 
        display: 'flex', 
        gap: '1rem', 
        flexWrap: 'wrap',
        justifyContent: 'center',
        padding: '1rem',
        background: '#f8f8f8',
        borderRadius: '10px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
      }}>
        <select
          value={filter.branch}
          onChange={(e) => setFilter({ ...filter, branch: e.target.value })}
          style={{ 
            padding: '0.75rem', 
            border: '2px solid #e0e0e0', 
            borderRadius: '8px', 
            fontSize: '1rem', 
            minWidth: '150px',
            cursor: 'pointer',
            background: 'white'
          }}
        >
          <option value="">All Branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EE">EE</option>
          <option value="Civil">Civil</option>
          <option value="Other">Other</option>
        </select>
        
        <select
          value={filter.year}
          onChange={(e) => setFilter({ ...filter, year: e.target.value })}
          style={{ 
            padding: '0.75rem', 
            border: '2px solid #e0e0e0', 
            borderRadius: '8px', 
            fontSize: '1rem', 
            minWidth: '150px',
            cursor: 'pointer',
            background: 'white'
          }}
        >
          <option value="">All Years</option>
          <option value="First">First</option>
          <option value="Second">Second</option>
          <option value="Third">Third</option>
          <option value="Fourth">Fourth</option>
          <option value="Other">Other</option>
        </select>
        {/* Potentially add search by name here later */}
      </div>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
        gap: '2rem'
      }}>
        {filteredStudents.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#666', fontSize: '1.1rem' }}>
            No students found matching your criteria.
          </p>
        ) : (
          filteredStudents.map((student) => (
            <ProfileCard key={student._id} student={student} />
          ))
        )}
      </div>
    </div>
  );
};

export default Students;
