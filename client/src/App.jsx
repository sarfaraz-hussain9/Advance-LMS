import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

import Loader from "./components/Loader";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";

const SignupSignin = lazy(() => import("./pages/SignupSignin"));
const Home = lazy(() => import("./pages/Home"));
const Landing = lazy(() => import("./pages/Landing"));
const Profile = lazy(() => import("./pages/user/Profile"));

const App = () => {
  return (
    <>
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <ToastContainer position="top-center" />
          <NavBar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/signin" element={<SignupSignin />} />

            {/* only login user can access this route*/}
            <Route element={<PrivateRoute />}>
              <Route path="/home" element={<Home />} />
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* only Admin can access this route */}
            <Route element={<AdminRoute />}></Route>
          </Routes>
        </Suspense>
      </BrowserRouter>
    </>
  );
};

export default App;
