import React from 'react';
import { FaPlay, FaUsers, FaRegClock, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Card = ({ course }) => {
  // Calculate estimated duration (10 min per video as per your example)
  const estimatedDuration = course.numOfVideos * 10;
  
  // Format duration to show hours if > 60 minutes
  const formatDuration = (minutes) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return `${hours}h ${mins > 0 ? `${mins}m` : ''}`.trim();
    }
    return `${minutes}m`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Course Thumbnail */}
      <div className="relative aspect-video"> {/* Maintain 16:9 aspect ratio */}
        <img
          src={course.poster?.url || '/default-course.jpg'}
          alt={course.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = '/default-course.jpg';
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
          <div className="bg-white p-3 rounded-full text-blue-600 hover:scale-110 transition-transform">
            <FaPlay className="text-xl" />
          </div>
        </div>
        {course.category && (
          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            {course.category}
          </div>
        )}
      </div>

      {/* Course Details */}
      <div className="p-4 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2">
            {course.title}
          </h3>
          {course.rating && (
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              <FaStar className="text-yellow-400 mr-1" />
              <span className="text-xs font-medium">{course.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 flex-grow">
          {course.description || 'No description available'}
        </p>

        <div className="flex items-center text-xs text-gray-500 mb-3 space-x-3">
          <span className="flex items-center">
            <FaUsers className="mr-1" />
            {course.views?.toLocaleString() || 0} students
          </span>
          <span className="flex items-center">
            <FaRegClock className="mr-1" />
            {formatDuration(estimatedDuration)}
          </span>
        </div>

        <div className="flex justify-between items-center mt-auto pt-2 border-t border-gray-100">
          {/* Removed instructor section since it's not available */}
          <div className="text-sm text-gray-500">
            {course.level || 'All Levels'}
          </div>

          <Link
            to={`/course/${course._id}`}
            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium whitespace-nowrap"
          >
            Explore
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Card;