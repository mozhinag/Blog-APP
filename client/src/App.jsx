import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import DashBoard from './pages/DashBoard';
import Login from './pages/Login';
import Register from './pages/Register';
import PostForm from './components/PostForm';
import SinglePost from './pages/SinglePost';
import PublicSinglePost from './pages/PublicSinglePost';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <Router>
        <Routes>
          {/* Public Home */}
          <Route
            path="/"
            element={<Home />}
          />

          {/* Auth Pages */}
          <Route
            path="/login"
            element={
              <>
                <Header />
                <div className="container mt-4">
                  <Login />
                </div>
              </>
            }
          />
          <Route
            path="/register"
            element={
              <>
                <Header />
                <div className="container mt-4">
                  <Register />
                </div>
              </>
            }
          />

          {/* Dashboard (private posts) */}
          <Route
            path="/dashboard"
            element={
              <>
                <Header />
                <div className="container mt-4">
                  <DashBoard />
                </div>
              </>
            }
          />

          {/* Single Post */}
          <Route
            path="/post/:id"
            element={
              <>
                <Header />
                <div className="container mt-4">
                  <SinglePost />
                </div>
              </>
            }
          />
          <Route
            path="/post/public/:id"
            element={
              <>
                <Header />
                <div className="container mt-4">
                  <PublicSinglePost />
                </div>
              </>
            }
          />

          {/* Edit Post */}
          <Route
            path="/edit/:id"
            element={
              <>
                <Header />
                <div className="container mt-4">
                  <PostForm />
                </div>
              </>
            }
          />
        </Routes>
      </Router>

      <ToastContainer />
    </>
  );
}

export default App;
