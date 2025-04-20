import React from "react";
import { useGetCoursesQuery } from "../redux/api/courseApi";
import {
  FaChalkboardTeacher,
  FaVideo,
  FaEye,
  FaTag,
  FaStar,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Course = () => {
  const { data, isLoading, isError, error } = useGetCoursesQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold text-gray-800">
        Loading courses...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-64 text-lg font-medium text-red-500">
        Error: {error?.data?.message || "Something went wrong"}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-4 text-gray-800">
          Explore Our Courses
        </h1>
        <p className="text-lg max-w-2xl mx-auto text-gray-600">
          Discover our comprehensive collection of courses designed to help you
          master new skills
        </p>
      </div>

      <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {data?.course?.map((course) => (
          <div
            key={course._id}
            className="bg-gray-50 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col h-full"
          >
            <div className="relative">
              <img
                src={course.poster?.url || "/placeholder-course.jpg"}
                alt={course.title}
                className="w-full h-48 object-cover"
              />
              {course.featured && (
                <div className="absolute top-2 right-2 bg-amber-400 text-xs font-bold px-2 py-1 rounded-full">
                  Featured
                </div>
              )}
            </div>

            <div className="p-6 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <span className="text-sm font-medium text-indigo-600">
                  {course.category}
                </span>
                <div className="flex items-center">
                  <FaStar className="text-amber-400 mr-1" />
                  <span className="text-sm font-medium">
                    {course.rating || 4.5}
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                {course.title}
              </h2>

              <p className="text-sm mb-4 text-gray-600 line-clamp-3">
                {course.description}
              </p>

              <div className="mt-auto space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaChalkboardTeacher className="mr-2 text-indigo-600" />
                    <span className="text-sm">{course.createdBy}</span>
                  </div>
                  <div className="flex items-center">
                    <FaVideo className="mr-2 text-indigo-600" />
                    <span className="text-sm">{course.numOfVideos}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FaEye className="mr-2 text-indigo-600" />
                    <span className="text-sm">{course.views}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between items-center">
                <div>
                  {course.price === 0 ? (
                    <span className="text-lg font-bold text-indigo-600">
                      Free
                    </span>
                  ) : (
                    <div>
                      <span className="text-lg font-bold text-indigo-600">
                        ₹{course.price}
                      </span>
                      {course.originalPrice && (
                        <span className="ml-2 text-sm line-through text-gray-600">
                          ₹{course.originalPrice}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <Link
                  to={`/course/${course._id}`}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Check Now
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Course;
