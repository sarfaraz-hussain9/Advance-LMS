import React, { useEffect, useState } from "react";
import { IoIosLock } from "react-icons/io";
import { MdEmail, MdRemoveRedEye } from "react-icons/md";
import { FaUser, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/features/authSlice";
import { useLoginMutation, useRegisterMutation } from "../redux/api/userApi";
import { toast } from "react-toastify";

// Theme constants
const theme = {
  colors: {
    primary: "bg-indigo-600",
    primaryDark: "bg-indigo-700",
    primaryLight: "bg-indigo-100",
    textPrimary: "text-indigo-600",
    textMuted: "text-gray-500",
    border: "border-gray-300",
  },
};

const SignupSignin = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state) => state.auth);

  const [showPasswordSignup, setShowPasswordSignup] = useState(false);
  const [showPasswordLogin, setShowPasswordLogin] = useState(false);
  const [signin, setSignin] = useState(true);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [register, { isLoading: registerLoading, isError: registerError }] =
    useRegisterMutation();
  const [Login, { isLoading: loginLoading, isError: loginError }] =
    useLoginMutation();

  useEffect(() => {
    if (userInfo) {
      navigate("/");
    }
  }, [userInfo, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name) return toast.error("Name is required");
    if (!email) return toast.error("Email is required");
    if (!password) return toast.error("Password is required");
    if (!confirmPassword) return toast.error("Please confirm your password");
    if (password !== confirmPassword) return toast.error("Passwords don't match");

    try {
      const data = { name, email, password };
      const res = await register(data).unwrap();
      dispatch(login(res.user));
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail) return toast.error("Email is required");
    if (!loginPassword) return toast.error("Password is required");

    try {
      const data = { email: loginEmail, password: loginPassword };
      const res = await Login(data).unwrap();
      dispatch(login(res.user));
      toast.success("Login successful!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-indigo-600 mb-2">
            Welcome to Ed Machine
          </h1>
          <p className="text-gray-500">
            {signin ? "Sign in to your account" : "Create a new account"}
          </p>
        </div>

        {/* Toggle between Login/Register */}
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setSignin(true)}
            className={`flex-1 py-2 rounded-md font-medium transition-colors ${
              signin
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => setSignin(false)}
            className={`flex-1 py-2 rounded-md font-medium transition-colors ${
              !signin
                ? "bg-white text-indigo-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            Register
          </button>
        </div>

        {/* Register Form */}
        <form
          className={`space-y-4 ${signin ? "hidden" : "block"}`}
          onSubmit={handleRegister}
        >
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaUser className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdEmail className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoIosLock className="text-gray-400" />
              </div>
              <input
                type={showPasswordSignup ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPasswordSignup(!showPasswordSignup)}
              >
                {showPasswordSignup ? (
                  <FaEyeSlash className="text-gray-400 hover:text-gray-500" />
                ) : (
                  <MdRemoveRedEye className="text-gray-400 hover:text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoIosLock className="text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={registerLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              registerLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {registerLoading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login Form */}
        <form
          className={`space-y-4 ${signin ? "block" : "hidden"}`}
          onSubmit={handleLogin}
        >
          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MdEmail className="text-gray-400" />
              </div>
              <input
                type="email"
                placeholder="email@example.com"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <IoIosLock className="text-gray-400" />
              </div>
              <input
                type={showPasswordLogin ? "text" : "password"}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                minLength={6}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={() => setShowPasswordLogin(!showPasswordLogin)}
              >
                {showPasswordLogin ? (
                  <FaEyeSlash className="text-gray-400 hover:text-gray-500" />
                ) : (
                  <MdRemoveRedEye className="text-gray-400 hover:text-gray-500" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-700"
              >
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a
                href="#"
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Forgot password?
              </a>
            </div>
          </div>

          <button
            type="submit"
            disabled={loginLoading}
            className={`w-full py-2 px-4 border border-transparent rounded-lg shadow-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
              loginLoading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
          >
            {loginLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="text-center text-sm text-gray-500">
          {signin ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setSignin(false)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Register
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button
                onClick={() => setSignin(true)}
                className="font-medium text-indigo-600 hover:text-indigo-500"
              >
                Sign In
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default SignupSignin;