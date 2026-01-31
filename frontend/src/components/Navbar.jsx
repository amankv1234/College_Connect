import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const navStyle = {
    background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
    padding: '1rem 2rem',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    fontWeight: '600',
    fontSize: '1.1rem',
    margin: '0 1rem',
    padding: '0.5rem 0',
    transition: 'color 0.3s, border-bottom 0.3s',
    borderBottom: '2px solid transparent',
  };

  const buttonStyle = {
    padding: '0.75rem 1.5rem',
    background: '#fff',
    color: '#764ba2',
    border: 'none',
    borderRadius: '8px',
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
  };

  return (
    <nav style={navStyle}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <Link to="/" style={{ textDecoration: 'none', color: 'white', fontSize: '1.8rem', fontWeight: '700', textAlign:'left' }}>
          Rajkiya Engineering College Kannauj
        </Link>
        <div>
          {user ? (
            <>
              <Link to="/students" style={linkStyle} onMouseOver={(e) => e.target.style.borderBottom = '2px solid white'} onMouseOut={(e) => e.target.style.borderBottom = '2px solid transparent'}>
                Students
              </Link>
              <Link to="/profile" style={linkStyle} onMouseOver={(e) => e.target.style.borderBottom = '2px solid white'} onMouseOut={(e) => e.target.style.borderBottom = '2px solid transparent'}>
                Profile
              </Link>
              <Link to="/chat" style={linkStyle} onMouseOver={(e) => e.target.style.borderBottom = '2px solid white'} onMouseOut={(e) => e.target.style.borderBottom = '2px solid transparent'}>
                Chat
              </Link>
              <button 
                onClick={logout} 
                style={buttonStyle}
                onMouseOver={(e) => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)'; }}
                onMouseOut={(e) => { e.target.style.transform = 'translateY(0)'; e.target.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)'; }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" style={linkStyle} onMouseOver={(e) => e.target.style.borderBottom = '2px solid white'} onMouseOut={(e) => e.target.style.borderBottom = '2px solid transparent'}>
                Login
              </Link>
              <Link to="/register" style={{...linkStyle, marginLeft: '1rem'}} onMouseOver={(e) => e.target.style.borderBottom = '2px solid white'} onMouseOut={(e) => e.target.style.borderBottom = '2px solid transparent'}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
