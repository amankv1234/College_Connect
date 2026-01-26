import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfile();
      const userData = response.data;
      setProfile(userData);
      setFormData({
        ...userData,
        // Convert array fields to comma-separated strings for form editing
        skills: userData.skills ? userData.skills.join(', ') : '',
        currentLearning: userData.currentLearning ? userData.currentLearning.join(', ') : '',
      });
      setError('');
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Failed to load profile. Please ensure you are logged in and your profile exists.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle nested profileLinks update
    if (name.startsWith('profileLinks.')) {
      const linkName = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        profileLinks: { ...prev.profileLinks, [linkName]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const dataToSend = {
        ...formData,
        // Convert comma-separated strings back to arrays for backend
        skills: formData.skills ? formData.skills.split(',').map((s) => s.trim()).filter(Boolean) : [],
        currentLearning: formData.currentLearning ? formData.currentLearning.split(',').map((s) => s.trim()).filter(Boolean) : [],
      };

      const response = await userAPI.updateProfile(dataToSend);
      setProfile(response.data);
      setFormData({
        ...response.data,
        skills: response.data.skills ? response.data.skills.join(', ') : '',
        currentLearning: response.data.currentLearning ? response.data.currentLearning.join(', ') : '',
      });
      setEditing(false);
      setError('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  // Styles for inputs and buttons (reused from Login/Register for consistency)
  const inputStyle = {
    width: '100%',
    padding: '0.75rem',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '1rem',
    transition: 'border-color 0.3s',
    boxSizing: 'border-box',
  };

  const selectStyle = {
    ...inputStyle,
    background: 'white',
    cursor: 'pointer',
  };

  const tagStyle = {
    display: 'inline-block',
    background: '#e0e7ff',
    color: '#4a67e0',
    padding: '0.3rem 0.7rem',
    borderRadius: '5px',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
    fontSize: '0.9rem',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    border: 'none',
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(102, 126, 234, 0.6)',
    }
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: '#f0f0f0',
    color: '#555',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
    marginLeft: '1rem',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 6px 20px rgba(0,0,0,0.2)',
    }
  };

  const renderField = (label, value) => (
    <div style={{ marginBottom: '0.75rem' }}>
      <p style={{ margin: '0', fontWeight: '600', color: '#333' }}>{label}:</p>
      <p style={{ margin: '0.25rem 0 0 0', color: '#555' }}>{value || 'N/A'}</p>
    </div>
  );

  const renderEditableInput = (label, name, type = 'text', placeholder, isRequired = false, isTextArea = false, valuePath = name) => {
    const value = valuePath.startsWith('profileLinks.')
      ? formData.profileLinks?.[valuePath.split('.')[1]] || ''
      : formData[valuePath] || '';

    return (
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
          {label} {isRequired && '*'}
        </label>
        {isTextArea ? (
          <textarea
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={isRequired}
            rows={3}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#667eea')}
            onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
          />
        ) : (
          <input
            type={type}
            name={name}
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            required={isRequired}
            style={inputStyle}
            onFocus={(e) => (e.target.style.borderColor = '#667eea')}
            onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
          />
        )}
      </div>
    );
  };

  const renderEditableSelect = (label, name, options, isRequired = false) => (
    <div style={{ marginBottom: '1rem' }}>
      <label style={{ display: 'block', marginBottom: '0.5rem', color: '#555', fontWeight: '500' }}>
        {label} {isRequired && '*'}
      </label>
      <select
        name={name}
        value={formData[name] || ''}
        onChange={handleChange}
        required={isRequired}
        style={selectStyle}
        onFocus={(e) => (e.target.style.borderColor = '#667eea')}
        onBlur={(e) => (e.target.style.borderColor = '#e0e0e0')}
      >
        <option value=''>Select {label}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  if (loading)
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', fontSize: '1.2rem', color: '#667eea' }}>
        Loading profile...
      </div>
    );
  if (error && !profile)
    return (
      <div style={{ color: 'red', textAlign: 'center', marginTop: '2rem', fontSize: '1.1rem' }}>
        {error}
      </div>
    );
  if (!profile)
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem', fontSize: '1.1rem', color: '#666' }}>
        No profile data found. Please log in to view or create your profile.
      </div>
    );

  return (
    <div
      style={{
        maxWidth: '900px',
        margin: '2rem auto',
        padding: '2rem',
        background: 'white',
        borderRadius: '20px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <h2 style={{ textAlign: 'center', color: '#333', marginBottom: '2.5rem', fontSize: '2.5rem', fontWeight: '700' }}>
        My Profile
      </h2>

      {error && (
        <div
          style={{
            background: '#fee',
            color: '#c33',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            border: '1px solid #fcc',
          }}
        >
          {error}
        </div>
      )}

      {!editing ? (
        <div>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src={profile.profilePhoto || 'https://via.placeholder.com/150/667eea/ffffff?text=User'}
              alt="Profile"
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #667eea' }}
            />
            <h3 style={{ marginTop: '1rem', color: '#333', fontSize: '1.8rem' }}>{profile.name}</h3>
            <p style={{ color: '#666', fontSize: '1.1rem' }}>{profile.email}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
            {renderField('College Name', profile.collegeName)}
            {renderField('Branch', profile.branch)}
            {renderField('Year', profile.year)}
            {renderField('Contact Number', profile.contactNumber)}
            {renderField('Roll No / University ID', profile.rollNo)}
          </div>

          {profile.bio && renderField('Bio', profile.bio)}

          {profile.skills && profile.skills.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: '0', fontWeight: '600', color: '#333' }}>Skills:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {profile.skills.map((skill, idx) => (
                  <span key={idx} style={tagStyle}>
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.currentLearning && profile.currentLearning.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ margin: '0', fontWeight: '600', color: '#333' }}>Current Learning / Interests:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                {profile.currentLearning.map((item, idx) => (
                  <span key={idx} style={tagStyle}>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {profile.hackathonParticipation && renderField('Hackathon Participation', profile.hackathonParticipation)}
          {profile.codingContestRanks && renderField('Coding Contest Ranks', profile.codingContestRanks)}
          {profile.internship && renderField('Internship', profile.internship)}
          {profile.collegeClubs && renderField('College Clubs', profile.collegeClubs)}

          <div style={{ marginTop: '2rem', borderTop: '1px solid #eee', paddingTop: '1.5rem' }}>
            <p style={{ margin: '0', fontWeight: '600', color: '#333', marginBottom: '1rem' }}>Profile Links:</p>
            {profile.profileLinks?.github && (
              <a href={profile.profileLinks.github} target="_blank" rel="noopener noreferrer" style={{ ...primaryButtonStyle, background: '#24292e', marginRight: '1rem', marginBottom: '1rem', display: 'inline-block' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(36, 41, 46, 0.4)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(36, 41, 46, 0.2)'; }}>
                GitHub
              </a>
            )}
            {profile.profileLinks?.linkedin && (
              <a href={profile.profileLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ ...primaryButtonStyle, background: '#0077B5', marginRight: '1rem', marginBottom: '1rem', display: 'inline-block' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(0, 119, 181, 0.4)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(0, 119, 181, 0.2)'; }}>
                LinkedIn
              </a>
            )}
            {profile.profileLinks?.portfolio && (
              <a href={profile.profileLinks.portfolio} target="_blank" rel="noopener noreferrer" style={{ ...primaryButtonStyle, background: '#d35400', marginRight: '1rem', marginBottom: '1rem', display: 'inline-block' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(211, 84, 0, 0.4)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(211, 84, 0, 0.2)'; }}>
                Portfolio
              </a>
            )}
            {profile.profileLinks?.resume && (
              <a href={profile.profileLinks.resume} target="_blank" rel="noopener noreferrer" style={{ ...primaryButtonStyle, background: '#27ae60', marginBottom: '1rem', display: 'inline-block' }} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(39, 174, 96, 0.4)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(39, 174, 96, 0.2)'; }}>
                Resume (Drive)
              </a>
            )}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <button onClick={() => setEditing(true)} style={primaryButtonStyle}>
              Edit Profile
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <img
              src={formData.profilePhoto || 'https://via.placeholder.com/150/667eea/ffffff?text=User'}
              alt="Profile"
              style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #667eea' }}
            />
            {renderEditableInput('Profile Photo URL', 'profilePhoto', 'url', 'Link to your profile picture')}
          </div>
          
          {renderEditableInput('Full Name', 'name', 'text', 'Your full name', true)}
          {renderEditableInput('Contact Number', 'contactNumber', 'tel', 'Your contact number')}
          {renderEditableInput('College Name', 'collegeName', 'text', 'Your college name')}
          {renderEditableSelect('Branch', 'branch', ['CSE', 'ECE', 'EE', 'Civil', 'Other'], true)}
          {renderEditableSelect('Year', 'year', ['First', 'Second', 'Third', 'Fourth', 'Other'], true)}
          {renderEditableInput('Roll No / University ID', 'rollNo', 'text', 'Your university roll number/ID')}
          {renderEditableInput('Bio / About', 'bio', 'text', 'A short description about yourself', false, true)}
          
          <h3 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            Skills & Interests
          </h3>
          {renderEditableInput('Skills (comma-separated)', 'skills', 'text', 'e.g., React, Node.js, MongoDB', false, true)}
          {renderEditableInput('Current Learning / Interests (comma-separated)', 'currentLearning', 'text', 'e.g., Learning Backend, Preparing for GSoC', false, true)}
          
          <h3 style={{ color: '#333', marginBottom: '1rem', fontSize: '1.5rem', fontWeight: '600', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            Achievements & Experience
          </h3>
          {renderEditableInput('Hackathon Participation', 'hackathonParticipation', 'text', 'e.g., 5 hackathons, 2 wins')}
          {renderEditableInput('Coding Contest Ranks', 'codingContestRanks', 'text', 'e.g., Codeforces: Expert, LeetCode: Guardian')}
          {renderEditableInput('Internship Experience', 'internship', 'text', 'e.g., Software Engineer Intern at Google')}
          {renderEditableInput('College Clubs', 'collegeClubs', 'text', 'e.g., Tech Club, Photography Club')}

          <h3 style={{ color: '#333', marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: '600', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
            Profile Links
          </h3>
          {renderEditableInput('GitHub Profile Link', 'profileLinks.github', 'url', 'https://github.com/your-username')}
          {renderEditableInput('LinkedIn Profile Link', 'profileLinks.linkedin', 'url', 'https://linkedin.com/in/your-profile')}
          {renderEditableInput('Portfolio Link', 'profileLinks.portfolio', 'url', 'https://your-portfolio.com')}
          {renderEditableInput('Resume (Google Drive Link)', 'profileLinks.resume', 'url', 'https://drive.google.com/file/d/...')}

          <div style={{ textAlign: 'center', marginTop: '2.5rem' }}>
            <button type="submit" style={primaryButtonStyle} onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)'; }} onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)'; }}>
              Save Changes
            </button>
            <button
              type="button"
              onClick={() => {
                setEditing(false);
                loadProfile(); // Reload original profile data to discard changes
              }}
              style={secondaryButtonStyle}
              onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'; }}
              onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.1)'; }}
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default Profile;
