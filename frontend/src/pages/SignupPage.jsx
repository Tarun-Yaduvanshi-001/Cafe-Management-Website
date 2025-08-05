import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { register, reset } from "../features/auth/authSlice";
import Spinner from "../components/common/Spinner";
import toast from "react-hot-toast";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });
  const { name, email, password, password2 } = formData;

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
    if (password !== password2) {
      toast.error("Passwords do not match");
    } else {
      dispatch(register({ name, email, password }));
    }
  };

  if (status === "loading") {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-primary p-4">
      <div className="max-w-md w-full bg-dark-secondary rounded-lg shadow-lg p-8">
        <h2 className="text-3xl font-bold text-center text-dark-accent mb-6">
          Create Account
        </h2>
        <form onSubmit={onSubmit}>
          <div className="mb-4">
            <label
              className="block text-dark-text-secondary text-sm font-bold mb-2"
              htmlFor="name"
            >
              Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-dark-text leading-tight focus:outline-none focus:shadow-outline focus:border-dark-accent"
              id="name"
              type="text"
              name="name"
              value={name}
              onChange={onChange}
              required
            />
          </div>
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
          <div className="mb-4">
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
          <div className="mb-6">
            <label
              className="block text-dark-text-secondary text-sm font-bold mb-2"
              htmlFor="password2"
            >
              Confirm Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-dark-text leading-tight focus:outline-none focus:shadow-outline focus:border-dark-accent"
              id="password2"
              type="password"
              name="password2"
              value={password2}
              onChange={onChange}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-dark-accent hover:opacity-90 text-dark-primary font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
              type="submit"
            >
              Sign Up
            </button>
          </div>
        </form>
        <p className="text-center text-dark-text-secondary text-sm mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="font-bold text-dark-accent hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
