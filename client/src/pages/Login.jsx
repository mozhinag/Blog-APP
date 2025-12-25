import { FaSignInAlt } from "react-icons/fa"
import { useState ,useEffect} from "react"
import { useDispatch,useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { login, reset } from "../features/auth/authSlice";
import { toast } from 'react-toastify';
import Spinner from "../components/Spinner";

function Login() {

  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });

  const { email, password } = formData;

   const dispatch = useDispatch();
   const navigate = useNavigate();

  const { user, isLoading, isError, message, isSuccess } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isLoading, isError, message, isSuccess]);


  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]:e.target.value
}))
  }

  const onSubmit = (e) => {

    e.preventDefault();

    const userData = {
      email,
      password
    }
    dispatch(login(userData))
  }

  if (isLoading) {
return <Spinner/>
}

  return (
    <>
      <section className="heading">
        <h1>
          <FaSignInAlt />
          Login
        </h1>
        <p>please loging and post your Blogs</p>
      </section>
      <section className="form">
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <input
              type="text"
              className="form-control"
              name="email"
              id="email"
              value={email}
              placeholder="please ennter your email"
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              className="form-control"
              name="password"
              id="password"
              value={password}
              placeholder="please ennter your password"
              onChange={onChange}
            />
          </div>
          <div className="form-group">
            <button
              type="submit"
              className="btn-custom btn-block"
            >
              Submit
            </button>
          </div>
        </form>
      </section>
    </>
  );
}

export default Login
