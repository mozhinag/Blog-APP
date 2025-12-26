import { Link, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')); // get logged user

  // const handleLogout = () => {
  //   localStorage.removeItem('user'); // remove token/user
  //   navigate('/'); // redirect
  // };
  const handleLogout = () => {
    dispatch(logout());
    dispatch(reset());
    navigate('/');
  };

  return (
    <nav className="navbar navbar-light bg-light px-4 shadow-sm">
      <h3
        className="fw-bold"
        style={{ color: '#25b6acff' }}
      >
        Bee BlogPosts
      </h3>

      <div>
        {/* If NOT logged in → show Login + Signup */}
        {!user && (
          <>
            <Link
              to="/login"
              className="btn btn-secondary btn-sm me-2"
            >
              Login
            </Link>

            <Link
              to="/register"
              className="btn btn-secondary btn-sm"
            >
              Signup
            </Link>
          </>
        )}

        {/* If logged in → show My Page + Logout */}
        {user && (
          <>
            <Link
              to="/dashboard"
              className="btn btn-secondary btn-sm me-2"
            >
              My Page
            </Link>

            <button
              className="btn btn-danger btn-sm"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
