import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Components
import Loader from "./components/Loader";
import NavBar from "./components/NavBar";
import PrivateRoute from "./components/PrivateRoute";
import AdminRoute from "./components/AdminRoute";
import Footer from "./components/Footer";
import AboutUS from "./pages/AboutUS";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound"; // Add this component

// Lazy-loaded components
const SignupSignin = lazy(() => import("./pages/SignupSignin"));
const Course = lazy(() => import("./pages/Course"));
const Home = lazy(() => import("./pages/Home"));
const Profile = lazy(() => import("./pages/user/Profile"));
const CourseDetails = lazy(() => import("./components/CourseDetails"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loader />}>
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />

        <NavBar />

        <main className="min-h-[calc(100vh-64px-56px)]">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signin" element={<SignupSignin />} />
            <Route path="/aboutus" element={<AboutUS />} />
            <Route path="/contact" element={<Contact />} />

            <Route path="/course">
              <Route index element={<Course />} />
              <Route path=":courseId" element={<CourseDetails />} />
            </Route>

            {/* Private routes */}
            <Route element={<PrivateRoute />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* 404 Handler */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <Footer />
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
