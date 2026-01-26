import React from 'react';
import { Link } from 'react-router-dom';

const ProfileCard = ({ student }) => {
  const tagStyle = {
    display: 'inline-block',
    background: '#e0e7ff',
    color: '#4a67e0',
    padding: '0.2rem 0.6rem',
    borderRadius: '5px',
    marginRight: '0.4rem',
    marginBottom: '0.4rem',
    fontSize: '0.85rem',
  };

  const linkButtonStyle = {
    display: 'inline-block',
    padding: '0.5rem 1rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '8px',
    fontSize: '0.9rem',
    fontWeight: '500',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 10px rgba(102, 126, 234, 0.3)',
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
  };

  return (
    <div
      style={{
        border: '1px solid #ddd',
        borderRadius: '12px',
        padding: '1.5rem',
        marginBottom: '1.5rem',
        background: 'white',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
      }}
    >
      <img
        src={student.profilePhoto || 'https://via.placeholder.com/150/667eea/ffffff?text=User'}
        alt="Profile"
        style={{ width: '100px', height: '100px', borderRadius: '50%', objectFit: 'cover', border: '3px solid #667eea', marginBottom: '1rem' }}
      />
      <h3 style={{ margin: '0.5rem 0', color: '#333', fontSize: '1.5rem' }}>{student.name}</h3>
      <p style={{ color: '#666', fontSize: '0.95rem' }}>{student.email}</p>

      <div style={{ margin: '1rem 0', width: '100%' }}>
        <p style={{ margin: '0.25rem 0', color: '#555' }}>
          <strong>Branch:</strong> {student.branch || 'N/A'}
        </p>
        <p style={{ margin: '0.25rem 0', color: '#555' }}>
          <strong>Year:</strong> {student.year || 'N/A'}
        </p>
        {student.collegeName && (
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            <strong>College:</strong> {student.collegeName}
          </p>
        )}
        {student.contactNumber && (
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            <strong>Contact:</strong> {student.contactNumber}
          </p>
        )}
        {student.rollNo && (
          <p style={{ margin: '0.25rem 0', color: '#555' }}>
            <strong>Roll No:</strong> {student.rollNo}
          </p>
        )}
      </div>

      {student.bio && (
        <div style={{ margin: '1rem 0', width: '100%', fontSize: '0.95rem', color: '#555' }}>
          <strong>About:</strong> {student.bio}
        </div>
      )}

      {student.skills && student.skills.length > 0 && (
        <div style={{ margin: '1rem 0', width: '100%' }}>
          <p style={{ margin: '0', fontWeight: '600', color: '#333' }}>Skills:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            {student.skills.map((skill, idx) => (
              <span key={idx} style={tagStyle}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {student.currentLearning && student.currentLearning.length > 0 && (
        <div style={{ margin: '1rem 0', width: '100%' }}>
          <p style={{ margin: '0', fontWeight: '600', color: '#333' }}>Learning / Interests:</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
            {student.currentLearning.map((item, idx) => (
              <span key={idx} style={tagStyle}>
                {item}
              </span>
            ))}
          </div>
        </div>
      )}

      {(student.hackathonParticipation || student.codingContestRanks || student.internship || student.collegeClubs) && (
        <div style={{ margin: '1rem 0', width: '100%', fontSize: '0.95rem', color: '#555' }}>
          {student.hackathonParticipation && <p style={{ margin: '0.25rem 0' }}><strong>Hackathons:</strong> {student.hackathonParticipation}</p>}
          {student.codingContestRanks && <p style={{ margin: '0.25rem 0' }}><strong>Coding Ranks:</strong> {student.codingContestRanks}</p>}
          {student.internship && <p style={{ margin: '0.25rem 0' }}><strong>Internship:</strong> {student.internship}</p>}
          {student.collegeClubs && <p style={{ margin: '0.25rem 0' }}><strong>Clubs:</strong> {student.collegeClubs}</p>}
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        {student.profileLinks?.github && (
          <a href={student.profileLinks.github} target="_blank" rel="noopener noreferrer" style={{ ...linkButtonStyle, background: '#24292e' }}>
            GitHub
          </a>
        )}
        {student.profileLinks?.linkedin && (
          <a href={student.profileLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ ...linkButtonStyle, background: '#0077B5' }}>
            LinkedIn
          </a>
        )}
        {student.profileLinks?.portfolio && (
          <a href={student.profileLinks.portfolio} target="_blank" rel="noopener noreferrer" style={{ ...linkButtonStyle, background: '#d35400' }}>
            Portfolio
          </a>
        )}
        {student.profileLinks?.resume && (
          <a href={student.profileLinks.resume} target="_blank" rel="noopener noreferrer" style={{ ...linkButtonStyle, background: '#27ae60' }}>
            Resume
          </a>
        )}
        <Link 
          to={`/chat?userId=${student._id}&userName=${student.name}`}
          style={{ ...linkButtonStyle, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
        >
          Message
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
