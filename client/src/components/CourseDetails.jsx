import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import {
  useGetCourseDetailsQuery,
  useGetCourseLecturesQuery,
} from "../redux/api/courseApi";
import {
  FaStar,
  FaRegStar,
  FaChalkboardTeacher,
  FaClock,
  FaBook,
  FaLanguage,
  FaCertificate,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import {
  MdOutlineVideoLibrary,
  MdOutlineAssignment,
  MdOutlineQuiz,
  MdExpandMore,
  MdExpandLess,
} from "react-icons/md";
import { BsCheckCircleFill, BsPlayFill } from "react-icons/bs";
import { toast } from "react-toastify";

const RatingStars = ({ rating = 0 }) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  return (
    <div className="flex items-center">
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i}>
          {i < fullStars || (i === fullStars && hasHalfStar) ? (
            <FaStar className="text-yellow-400 text-lg" />
          ) : (
            <FaRegStar className="text-yellow-400 text-lg" />
          )}
        </span>
      ))}
      <span className="ml-2 text-gray-700 font-medium">
        {rating?.toFixed(1) || "0.0"}
      </span>
    </div>
  );
};

const formatDuration = (duration = 0) => {
  const hours = Math.floor(duration / 3600);
  const minutes = Math.floor((duration % 3600) / 60);
  return [hours > 0 && `${hours}h`, minutes > 0 && `${minutes}m`]
    .filter(Boolean)
    .join(" ");
};

const CourseDetails = () => {
  const { courseId } = useParams();
  const [expandedLectures, setExpandedLectures] = useState({});
  const {
    data: courseData,
    isLoading: isCourseLoading,
    isError: isCourseError,
    error: courseError,
  } = useGetCourseDetailsQuery(courseId);

  const {
    data: lectureData,
    isLoading: isLecturesLoading,
    isError: isLecturesError,
    error: lecturesError,
  } = useGetCourseLecturesQuery(courseId);

  const course = courseData?.course || courseData?.data;
  const lectures = lectureData?.course?.lectures || [];
  useEffect(() => {
    if (isCourseError) {
      toast.error(
        courseError?.data?.message || "Failed to load course details"
      );
    }
    if (isLecturesError) {
      toast.error(lecturesError?.data?.message || "Failed to load lectures");
    }
  }, [isCourseError, isLecturesError]);

  const toggleLecture = (lectureId) => {
    setExpandedLectures((prev) => ({
      ...prev,
      [lectureId]: !prev[lectureId],
    }));
  };

  if (isCourseLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!course || isCourseError) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md p-6 bg-white rounded-xl shadow-md">
          <h3 className="text-xl font-medium text-red-500 mb-4">
            Error loading course details
          </h3>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen ">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-700 to-purple-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            {course.title}
          </h1>
          <p className="text-lg text-indigo-100 mb-6 max-w-3xl">
            {course.shortDescription ||
              course.description?.substring(0, 150) + "..."}
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <RatingStars rating={course.rating} />
            <span className="flex items-center">
              <FaChalkboardTeacher className="mr-2" />
              {course.createdBy || "Unknown Instructor"}
            </span>
            <span className="flex items-center">
              <FaClock className="mr-2" />
              {formatDuration(course.duration)} total length
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 -mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Content */}
          <div className="lg:w-2/3 space-y-8">
            {/* Course Overview Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Course Overview
                </h2>
                <div className="prose max-w-none text-gray-700">
                  <p>{course.description || "No description available"}</p>
                </div>

                <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaBook className="text-indigo-600 mr-3 text-xl" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500">
                        Level
                      </h4>
                      <p className="text-gray-800">
                        {course.level || "All Levels"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaLanguage className="text-indigo-600 mr-3 text-xl" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500">
                        Language
                      </h4>
                      <p className="text-gray-800">
                        {course.language || "English"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaCertificate className="text-indigo-600 mr-3 text-xl" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500">
                        Certificate
                      </h4>
                      <p className="text-gray-800">
                        {course.certificate ? "Included" : "Not Included"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center p-3 bg-gray-50 rounded-lg">
                    <FaClock className="text-indigo-600 mr-3 text-xl" />
                    <div>
                      <h4 className="text-sm font-semibold text-gray-500">
                        Last Updated
                      </h4>
                      <p className="text-gray-800">
                        {new Date(course.updatedAt).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Curriculum Card */}
            <div className="p-6 sm:p-8 border-t border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                Lectures
              </h2>

              {isLecturesLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
                </div>
              ) : lectures.length > 0 ? (
                <div className="space-y-4">
                  {lectures.map((lecture) => (
                    <div
                      key={lecture._id}
                      className="border border-gray-200 rounded-lg overflow-hidden bg-gray-50 transition"
                    >
                      <div
                        className="flex items-center justify-between p-4 cursor-pointer"
                        onClick={() => toggleLecture(lecture._id)}
                      >
                        <div className="flex items-center ">
                          {lecture.type === "video" ? (
                            <MdOutlineVideoLibrary className="text-indigo-600 mr-3 text-xl" />
                          ) : lecture.type === "quiz" ? (
                            <MdOutlineQuiz className="text-indigo-600 mr-3 text-xl" />
                          ) : (
                            <MdOutlineAssignment className="text-indigo-600 mr-3 text-xl" />
                          )}
                          <h3 className="text-lg font-semibold text-gray-800 ">
                            {lecture.title}
                          </h3>
                        </div>
                        {expandedLectures[lecture._id] ? (
                          <MdExpandLess className="text-gray-500 text-xl" />
                        ) : (
                          <MdExpandMore className="text-gray-500 text-xl" />
                        )}
                      </div>

                      {expandedLectures[lecture._id] && (
                        <div className="p-4 border-t border-gray-200 bg-gray-50">
                          <p className="text-gray-600 mb-4">
                            {lecture.description || "No description available"}
                          </p>
                          {lecture.video?.url && (
                            <div className="relative pt-[56.25%] rounded-md overflow-hidden bg-black">
                              <ReactPlayer
                                url={lecture.video.url}
                                width="100%"
                                height="100%"
                                controls
                                style={{
                                  position: "absolute",
                                  top: 0,
                                  left: 0,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No lectures available.
                </div>
              )}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:w-1/3 space-y-6">
            {/* Course Action Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <img
                src={course.poster?.url || "/default-course-image.jpg"}
                alt={course.title}
                className="w-full h-48 object-cover"
                onError={(e) => (e.target.src = "/default-course-image.jpg")}
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-2xl font-bold text-gray-900">
                    {course.price === 0 ? "Free" : `₹${course.price}`}
                  </span>
                  <button className="text-2xl text-indigo-600 hover:text-indigo-800">
                    <FaRegHeart />
                  </button>
                </div>
                <button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 transition-colors mb-3 shadow-md">
                  Enroll Now
                </button>
                <button className="w-full border border-indigo-600 text-indigo-600 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-colors shadow-sm">
                  Try for Free
                </button>
              </div>
            </div>

            {/* Course Features Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
              <h3 className="font-semibold text-xl text-gray-800 mb-4">
                This course includes:
              </h3>
              <ul className="space-y-3">
                {[
                  `${course.numOfVideos || 0} on-demand videos`,
                  "Full lifetime access",
                  course.certificate && "Certificate of completion",
                  "Access on mobile and TV",
                  "Downloadable resources",
                ]
                  .filter(Boolean)
                  .map((item, i) => (
                    <li key={i} className="flex items-start">
                      <BsCheckCircleFill className="text-green-500 mr-3 mt-1 flex-shrink-0" />
                      <span className="text-gray-700">{item}</span>
                    </li>
                  ))}
              </ul>
            </div>

            {/* Instructor Card */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden p-6">
              <h3 className="font-semibold text-xl text-gray-800 mb-4">
                Instructor
              </h3>
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-2xl font-bold">
                  {course.createdBy?.charAt(0) || "U"}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    {course.createdBy || "Unknown Instructor"}
                  </h4>
                  <p className="text-gray-600 text-sm mt-1">
                    Senior Developer & Educator
                  </p>
                  <div className="flex items-center mt-2 text-sm text-gray-500">
                    <FaStar className="text-yellow-400 mr-1" />
                    <span>4.8 Instructor Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
