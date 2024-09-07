import React, { useEffect, useState } from "react";
import { IoIosLock } from "react-icons/io";
import { MdEmail, MdRemoveRedEye } from "react-icons/md";
import { FaUser, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/features/authSlice";
import { useLoginMutation, useRegisterMutation } from "../redux/api/userApi";
import { toast } from "react-toastify";

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
      navigate("/home");
    }
  }, []);

  // register handling
  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name) return toast.error("Name is Required.");
    if (!email) return toast.error("Email is Required.");
    if (!password) return toast.error("Password is Required.");
    if (!confirmPassword) return toast.error("Confirm Password is Required.");
    if (password !== confirmPassword) toast.error("Password not Matched.");

    try {
      const data = {
        name,
        email,
        password,
      };
      const res = await register(data).unwrap();
      dispatch(login(res.user));
      toast.success(res.message);
      navigate("/home");
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };

  if (registerLoading) {
  }
  if (registerError) {
  }

  // login handling
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!loginEmail) return toast.error("Email is Required.");
    if (!loginPassword) return toast.error("Password is Required.");
    try {
      const data = {
        email: loginEmail,
        password: loginPassword,
      };
      const res = await Login(data).unwrap();
      dispatch(login(res.user));
      toast.success(res.message);
      navigate("/home");
    } catch (err) {
      toast.error(err?.data?.message);
    }
  };
  if (loginLoading) {
  }
  if (loginError) {
  }

  return (
    <div className="mt-[64px] min-h-[calc(100vh-64px)] w-screen bg-background flex items-center justify-center ">
      <div className="w-full md:max-w-md p-4 bg-btn1 shadow-md sm:rounded-lg h-[calc(100vh-64px)] md:h-[33rem] overflow-hidden">
        <h1 className="text-3xl font-bold mb-4 text-center overflow-hidden">
          WELCOME TO ED MACHINE
        </h1>
        <div className="w-full overflow-hidden flex justify-between text-2xl relative px-4">
          <div
            onClick={() => setSignin(true)}
            className={`w-1/2 text-center cursor-pointer py-2 uppercase tracking-wide font-semibold z-10 ${
              signin ? " text-text" : ""
            }`}
          >
            Login
          </div>
          <div
            onClick={() => setSignin(false)}
            className={`w-1/2 text-center cursor-pointer  py-2 uppercase tracking-wide font-semibold z-10 ${
              signin ? "" : " text-text"
            }`}
          >
            Register
          </div>
          <div
            className={`absolute top-0 left-0 w-1/2  h-12 bg-box3 transition-all ease-in z-0 ${
              signin ? "translate-x-0" : "translate-x-full "
            }`}
          ></div>
        </div>

        {/* Auth Forms */}
        <div className="relative w-full h-full my-4 flex">
          {/* Register Form */}

          <form
            className={`flex flex-col gap-2 w-full h-full absolute top-0 left-0 transition-all ease-in  ${
              signin ? "translate-x-full" : "translate-x-0"
            }`}
            onSubmit={handleRegister}
          >
            <label htmlFor="name" className="flex flex-col">
              <span className="font-semibold">Name</span>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Name"
                  className="rounded pl-6 pr-5 py-1 focus:outline-none text-box1 w-full border-2 border-background "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <div className="text-background absolute top-[0.6rem] left-2">
                  <FaUser />
                </div>
              </div>
            </label>
            <label htmlFor="email" className="flex flex-col">
              <span className="font-semibold">Email</span>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="rounded pl-6 pr-5 py-1 focus:outline-none text-box1 w-full border-2 border-background "
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <div className="text-background absolute top-[0.6rem] left-2">
                  <MdEmail />
                </div>
              </div>
            </label>
            <label htmlFor="password" className="flex flex-col">
              <span className="font-semibold">Password</span>
              <div className="relative">
                <input
                  type={showPasswordSignup ? "text" : "password"}
                  placeholder="Password"
                  className="rounded pl-6 pr-5 py-1 focus:outline-none text-box1 w-full border-2 border-background "
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={5}
                />
                <div className="text-background text-xl absolute top-2 left-2">
                  <IoIosLock className="text-xl" />
                </div>
                <div
                  className="text-background absolute top-1 right-2 text-2xl cursor-pointer"
                  onClick={() => setShowPasswordSignup(!showPasswordSignup)}
                >
                  {showPasswordSignup ? <FaEyeSlash /> : <MdRemoveRedEye />}
                </div>
              </div>
            </label>
            <label htmlFor="confirmPassword" className="flex flex-col">
              <span className="font-semibold">Confirm Password</span>
              <div className="relative">
                <input
                  type="password"
                  placeholder="Confirm Password"
                  className="rounded pl-6 pr-5 py-1 focus:outline-none text-box1 w-full border-2 border-background "
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  minLength={5}
                />
                <div className="text-background text-xl absolute top-2 left-2">
                  <IoIosLock className="text-xl" />
                </div>
              </div>
            </label>
            <button
              type="submit"
              className="bg-secondary text-white w-[200px] m-auto rounded py-1 font-medium uppercase my-3"
            >
              Register
            </button>
          </form>

          {/* Login Form */}

          <form
            className={`flex flex-col gap-2 w-full h-full absolute top-0 left-0 transition-all ease-in ${
              signin ? "translate-x-0" : "translate-x-full"
            }`}
            onSubmit={handleLogin}
          >
            <label htmlFor="email" className="flex flex-col">
              <span className="font-semibold">Email</span>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email"
                  className="rounded pl-6 pr-5 py-1 focus:outline-none text-box1 w-full border-2 border-background "
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                />
                <div className="text-background absolute top-[0.6rem] left-2">
                  <MdEmail />
                </div>
              </div>
            </label>
            <label htmlFor="password" className="flex flex-col">
              <span className="font-semibold">Password</span>
              <div className="relative">
                <input
                  type={showPasswordLogin ? "text" : "password"}
                  placeholder="Password"
                  className="rounded pl-6 pr-5 py-1 focus:outline-none text-box1 w-full border-2 border-background "
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  minLength={5}
                />
                <div className="text-background text-xl absolute top-2 left-2">
                  <IoIosLock className="text-xl" />
                </div>
                <div
                  className="text-background absolute top-1 right-2 text-2xl cursor-pointer"
                  onClick={() => setShowPasswordLogin(!showPasswordLogin)}
                >
                  {showPasswordLogin ? <FaEyeSlash /> : <MdRemoveRedEye />}
                </div>
              </div>
            </label>
            <button
              type="submit"
              className="bg-secondary text-white w-[200px] m-auto rounded py-1 font-medium uppercase my-3"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupSignin;
