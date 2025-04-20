import React from "react";
import { useParams } from "react-router-dom";
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
} from "react-icons/fa";
import {
  MdOutlineVideoLibrary,
  MdOutlineAssignment,
  MdOutlineQuiz,
} from "react-icons/md";
import { BsCheckCircleFill } from "react-icons/bs";

const CourseDetails = () => {
  const { courseId } = useParams();

  const {
    data: responseCourse,
    isLoading,
    isError,
  } = useGetCourseDetailsQuery(courseId);

  const course = responseCourse?.course;

  const { data: lecturesData } = useGetCourseLecturesQuery(courseId);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-800">
        Loading course details...
      </div>
    );
  }

  if (isError || !course) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-medium text-red-500">
        Error loading course details
      </div>
    );
  }

  const renderRatingStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars || (i === fullStars + 1 && hasHalfStar)) {
        stars.push(<FaStar key={i} className="text-yellow-400" />);
      } else {
        stars.push(<FaRegStar key={i} className="text-yellow-400" />);
      }
    }
    return stars;
  };

  const transformLecturesToCurriculum = () => {
    if (!lecturesData?.lectures) return [];

    const sections = {};
    lecturesData.lectures.forEach((lecture) => {
      if (!sections[lecture.section]) {
        sections[lecture.section] = [];
      }
      sections[lecture.section].push({
        title: lecture.title,
        duration: lecture.duration,
        type: lecture.type || "video",
      });
    });

    return Object.entries(sections).map(([section, lectures]) => ({
      section,
      lectures,
    }));
  };

  const curriculum = transformLecturesToCurriculum();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          {/* LEFT */}
          <div className="md:w-2/3 p-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {course.title}
            </h1>

            <div className="flex items-center mb-4">
              <div className="flex mr-4">
                {renderRatingStars(course.rating || 0)}
                <span className="ml-2 text-gray-700">
                  {course.rating?.toFixed(1) || "0.0"}
                </span>
              </div>
              <span className="text-gray-600">
                {/* {course.enrolledStudents?.toLocaleString() || 0} students */}
              </span>
            </div>

            <div className="flex items-center space-x-6 mb-6 text-gray-600">
              <div className="flex items-center">
                <FaChalkboardTeacher className="mr-2 text-indigo-600" />
                <span>{course.createdBy || "Unknown Instructor"}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2 text-indigo-600" />
                <span>{course.duration || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <MdOutlineVideoLibrary className="mr-2 text-indigo-600" />
                <span>{course.numOfVideos || 0} lectures</span>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                About This Course
              </h2>
              <p className="text-gray-600">
                {course.description || "No description available"}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center">
                <FaBook className="mr-2 text-indigo-600" />
                <span className="text-gray-700">
                  Level: {course.level || "N/A"}
                </span>
              </div>
              <div className="flex items-center">
                <FaLanguage className="mr-2 text-indigo-600" />
                <span className="text-gray-700">
                  {course.language || "English"}
                </span>
              </div>
              <div className="flex items-center">
                <FaCertificate className="mr-2 text-indigo-600" />
                <span className="text-gray-700">
                  {course.certificate ? "Certificate" : "No Certificate"}
                </span>
              </div>
              <div className="flex items-center">
                <FaClock className="mr-2 text-indigo-600" />
                <span className="text-gray-700">
                  Updated{" "}
                  {new Date(course.createdAt).toLocaleDateString() || "N/A"}
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="md:w-1/3 bg-gray-50 p-8 border-l border-gray-200">
            <div className="sticky top-8">
              <img
                src={
                  course.poster?.url || "https://via.placeholder.com/800x450"
                }
                alt={course.title}
                className="w-full rounded-lg mb-6"
              />
              <div className="mb-6">
                <div className="flex items-center">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{course.price === 0 ? "Free" : course.price}
                  </span>
                  {course.originalPrice &&
                    course.originalPrice > course.price && (
                      <>
                        <span className="ml-2 text-lg text-gray-500 line-through">
                          ₹{course.originalPrice}
                        </span>
                        <span className="ml-2 bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded">
                          {Math.round(
                            (1 - course.price / course.originalPrice) * 100
                          )}
                          % off
                        </span>
                      </>
                    )}
                </div>
              </div>

              <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg mb-4 transition duration-200">
                Enroll Now
              </button>
              <button className="w-full bg-white border border-indigo-600 text-indigo-600 font-bold py-3 px-4 rounded-lg mb-6 hover:bg-indigo-50 transition duration-200">
                Add to Wishlist
              </button>

              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800">
                  This course includes:
                </h3>
                <ul className="space-y-2">
                  {course.includedItems?.map((item, index) => (
                    <li key={index} className="flex items-center">
                      <BsCheckCircleFill className="text-green-500 mr-2" />
                      <span className="text-gray-600">{item}</span>
                    </li>
                  )) || (
                    <li className="text-gray-500">No information available</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* CURRICULUM */}
        <div className="p-8 border-t border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Curriculum</h2>
          <div className="space-y-6">
            {curriculum.length > 0 ? (
              curriculum.map((section, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden"
                >
                  <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                    <h3 className="font-medium text-gray-800">
                      {section.section}
                    </h3>
                  </div>
                  <div className="divide-y divide-gray-200">
                    {section.lectures.map((lecture, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between px-4 py-3 hover:bg-gray-50"
                      >
                        <div className="flex items-center">
                          {lecture.type === "video" && (
                            <MdOutlineVideoLibrary className="text-indigo-600 mr-3" />
                          )}
                          {lecture.type === "quiz" && (
                            <MdOutlineQuiz className="text-purple-600 mr-3" />
                          )}
                          {lecture.type === "assignment" && (
                            <MdOutlineAssignment className="text-amber-600 mr-3" />
                          )}
                          <span className="text-gray-700">{lecture.title}</span>
                        </div>
                        {lecture.duration && (
                          <span className="text-sm text-gray-500">
                            {lecture.duration}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No curriculum info available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetails;
