import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, googleSignIn, reset } from "../features/auth/authSlice";
import Spinner from "../components/common/Spinner";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, status, error } = useSelector((state) => state.auth);

  useEffect(() => {
    if (error) {
      // Toast is handled in the slice
    }
    if (user) {
      navigate("/dashboard");
    }
    dispatch(reset());
  }, [user, error, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  const onGoogleSignIn = () => {
    dispatch(googleSignIn());
  };

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-primary p-4">
      <div className="max-w-md w-full bg-dark-secondary rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-dark-accent mb-6">
          Login
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              className="block text-dark-text-secondary text-sm font-bold mb-2"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-dark-text leading-tight focus:outline-none focus:shadow-outline focus:border-dark-accent"
              id="email"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          <div className="mb-6">
            <label
              className="block text-dark-text-secondary text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-dark-text leading-tight focus:outline-none focus:shadow-outline focus:border-dark-accent"
              id="password"
              type="password"
              name="password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-dark-accent hover:opacity-90 text-dark-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Sign In
            </button>
          </div>
        </form>
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-600"></div>
          <span className="flex-shrink mx-4 text-dark-text-secondary">OR</span>
          <div className="flex-grow border-t border-gray-600"></div>
        </div>
        <button
          onClick={onGoogleSignIn}
          className="bg-white text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow w-full flex items-center justify-center"
        >
          <svg
            className="w-4 h-4 mr-2"
            aria-hidden="true"
            focusable="false"
            data-prefix="fab"
            data-icon="google"
            role="img"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 488 512"
          >
            <path
              fill="currentColor"
              d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 172.9 60.3l-66.8 64.2C324.5 99.8 289.3 80 248 80c-82.6 0-150.2 67.5-150.2 150.2S165.4 406.2 248 406.2c96.4 0 135.2-70.3 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"
            ></path>
          </svg>
          Sign in with Google
        </button>
        <p className="text-center text-dark-text-secondary text-sm mt-6">
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="font-bold text-dark-accent hover:underline"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
