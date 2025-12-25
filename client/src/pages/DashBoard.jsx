import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import PostForm from '../components/PostForm';
import PostItem from '../components/PostItem';
import Spinner from '../components/Spinner';
import { getAllPosts, reset } from '../features/posts/postSlice';
import { FaSearch } from 'react-icons/fa';

function DashBoard() {
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  // PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 4;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const { posts, isError, isLoading, message } = useSelector(
    (state) => state.posts
  );

  console.log('POSTS:', posts);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }
    dispatch(getAllPosts());
  }, [user, navigate, dispatch]);

  useEffect(() => {
    if (isError) {
      console.log(message);
    }
  }, [isError, message]);

  if (isLoading) return <Spinner />;

  // FILTER POSTS BY SEARCH
  const filteredPosts = posts.filter(
    (post) =>
      post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // PAGINATION LOGIC
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirstPost, indexOfLastPost);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <>
      <section className="heading">
        <h1>Welcome {user && user.name}</h1>

        <p className="mt-3 mb-2 fs-4 fw-semibold">
          My BlogPosts
        </p>

        <div className="d-flex justify-content-between align-items-center flex-wrap mb-3">
          <div
            className="d-flex align-items-center gap-1"
            style={{ maxWidth: '260px' }}
          >
            {/* Search Box */}
            <div className="input-group input-group-sm">
              <span className="input-group-text p-1 px-2">
                <FaSearch size={12} />
              </span>

              <input
                type="text"
                className="form-control p-1"
                style={{ fontSize: '13px' }}
                placeholder="title / category"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* All Button */}
            <button
              className={`btn btn-sm ${
                selectedCategory === 'All' ? 'btn-warning' : 'btn-light'
              }`}
              onClick={() => {
                setSelectedCategory('All');
                setSearchTerm('');
              }}
            >
              All
            </button>
          </div>

          {/* Show/Hide Form */}
          <button
            className="btn btn-warning btn-sm mt-2 mt-md-0"
            onClick={() => setShowForm((prev) => !prev)}
          >
            {showForm ? 'Close Form' : 'Create Post'}
          </button>
        </div>
      </section>

      {/* POST FORM */}
      {showForm && <PostForm onClose={() => setShowForm(false)} />}

      {/* POSTS SECTION */}
      <section className="content">
        {currentPosts.length > 0 ? (
          <div className="posts">
            {currentPosts.map((post) => (
              <PostItem
                key={post._id}
                id={post._id}
                title={post.title}
                image={post.image}
                category={post.category}
                content={post.content}
                likes={post.likes}
                isPublic={false}
                userId={post.user}
              />
            ))}
          </div>
        ) : (
          <h3>No posts found</h3>
        )}
      </section>

      {/* PAGINATION */}
      {filteredPosts.length > postsPerPage && (
        <div className="d-flex justify-content-center mt-4 gap-2">
          <button
            className="btn btn-warning btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm ${
                currentPage === index + 1 ? 'btn-warning' : 'btn-light'
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="btn btn-warning btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default DashBoard;
