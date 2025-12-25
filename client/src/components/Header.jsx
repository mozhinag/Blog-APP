import React from 'react';

import { FaSignInAlt, FaUser, FaSignOutAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout, reset } from '../features/auth/authSlice';

function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  const onLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <header className="header">
      <div className="logo">
        <Link
          to="/"
          style={{ color: '#25b6acff', textDecoration: 'none' }}
        >
         Bee BlogPost
        </Link>
      </div>

      <ul>
        {user ? (
          <>
            <li>
              <button
                style={{
                  color: '#25b6acff',
                  border: '1px solid #25b6acff',
                  background: 'transparent',
                  padding: '6px 10px',
                  borderRadius: '6px',
                }}
                onClick={onLogout}
              >
                <FaSignOutAlt /> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link
                to="/login"
                style={{ color: '#25b6acff' }}
              >
                <FaSignInAlt /> Login
              </Link>
            </li>
            <li>
              <Link
                to="/register"
                style={{ color: '#25b6acff' }}
              >
                <FaUser /> Register
              </Link>
            </li>
          </>
        )}
      </ul>
    </header>
  );
}

export default Header;
