import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getPublicPosts } from '../features/posts/postSlice';
import PostItem from './PostItem';
import Spinner from './Spinner';

function PublicPosts({ selectedCategory }) {
  const dispatch = useDispatch();
  const { posts, isLoading, isError, message } = useSelector(
    (state) => state.posts
  );

  // Logged-in user (if any)
  const { user } = useSelector((state) => state.auth);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;

  useEffect(() => {
    dispatch(getPublicPosts());
  }, [dispatch]);

  const postList = Array.isArray(posts) ? posts : [];

  const filteredPosts =
    selectedCategory === 'All'
      ? postList
      : postList.filter((post) => post.category === selectedCategory);

  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentPosts = filteredPosts.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  if (isLoading) return <Spinner />;
  if (isError) return <h4 className="text-center text-danger">{message}</h4>;

  return (
    <>
      <div className="row">
        {currentPosts.length > 0 ? (
          currentPosts.map((post) => (
            <div
              className="col-md-4 mb-4"
              key={post._id}
            >
              <PostItem
                id={post._id}
                title={post.title}
                content={post.content}
                image={post.image}
                category={post.category}
                likes={post.likes}
                isPublic={true}
                userId={post.user} // ✅ Correct
              />
            </div>
          ))
        ) : (
          <h4 className="text-center">No posts available</h4>
        )}
      </div>

      {totalPages > 1 && (
        <div className="d-flex justify-content-center gap-2 mt-3">
          <button
            className="btn btn-warning btn-sm"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
          >
            Prev
          </button>

          {[...Array(totalPages)].map((_, index) => (
            <button
              key={index}
              className={`btn btn-sm ${
                currentPage === index + 1
                  ? 'btn-warning'
                  : 'btn-outline-warning'
              }`}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </button>
          ))}

          <button
            className="btn btn-warning btn-sm"
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}

export default PublicPosts;
