import { Link, useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import { likePost } from '../features/posts/postSlice';

function PostItem({
  id,
  title,
  image,
  category,
  content,
  likes,
  isPublic,
  userId, // <-- owner ID
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const likesArray = Array.isArray(likes) ? likes : [];
  const isLiked = user?._id ? likesArray.includes(user._id) : false;

  const handleOpen = () => {
    if (isPublic) {
      navigate(`/post/public/${id}`, {
        state: { userId: user?._id || null },
      });
    } else {
      navigate(`/post/${id}`);
    }
  };

  const handleLike = () => {
    if (!user) return;

    if (user._id === userId) return; // owner can't like

    dispatch(likePost(id));
  };

  return (
    <div
      className="card p-3 d-flex flex-column shadow-sm"
      style={{ height: '100%', borderRadius: '12px' }}
    >
      {/* <div className="d-flex justify-content-end">
        {isPublic ? (
          <span className="badge bg-success">Public</span>
        ) : (
          <span className="badge bg-danger">Private</span>
        )}
      </div> */}

      <h4 className="mb-3 text-center">{title}</h4>

      {image && (
        <img
          src={`http://localhost:5000/uploads/${image}`}
          alt={title}
          style={{
            width: '100%',
            height: '200px',
            objectFit: 'cover',
            borderRadius: '10px',
            marginBottom: '12px',
          }}
        />
      )}

      {category && (
        <p className="text-center text-secondary mb-1">
          <strong>Category:</strong> {category}
        </p>
      )}

      <p
        className="mt-2"
        style={{ flexGrow: 1 }}
      >
        {content?.substring(0, 80)}...
      </p>

      <div className="d-flex justify-content-center mt-2">
        <button
          onClick={handleOpen}
          className="btn btn-info btn-sm"
        >
          Read More
        </button>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <button
          className="btn btn-light btn-sm"
          onClick={handleLike}
          disabled={!user || user._id === userId}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            cursor: !user || user._id === userId ? 'not-allowed' : 'pointer',
            opacity: !user || user._id === userId ? 0.6 : 1,
          }}
        >
          <FaHeart color={isLiked ? 'red' : 'grey'} />
          {likesArray.length}
        </button>
      </div>
    </div>
  );
}


export default PostItem;


