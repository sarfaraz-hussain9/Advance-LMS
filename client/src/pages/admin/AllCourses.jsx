import React, { useState } from "react";
import { toast } from "react-toastify";
import {
  useCreateCourseMutation,
  useGetCoursesQuery,
  useDeleteCourseMutation,
  useGetCourseLecturesQuery,
  useAddLectureMutation,
  useDeleteLectureMutation,
} from "../../redux/api/courseApi";
import { MdAdd, MdDelete, MdEdit, MdClose } from "react-icons/md";
import Modal from "../../components/Modal"; // Assuming you have a Modal component

const AllCourses = () => {
  // State for modals and forms
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isAddLectureModalOpen, setIsAddLectureModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  // Form states
  const [courseForm, setCourseForm] = useState({
    title: "",
    description: "",
    category: "",
    createdBy: "",
    file: null,
  });

  const [newLecture, setNewLecture] = useState({
    title: "",
    description: "",
    video: null,
  });

  // API hooks
  const {
    data: coursesResponse,
    isLoading,
    isError,
    error,
    refetch,
  } = useGetCoursesQuery();

  const [createCourse, { isLoading: isCreating }] = useCreateCourseMutation();
  const [addLecture, { isLoading: isAddingLecture }] = useAddLectureMutation();
  const [deleteLecture] = useDeleteLectureMutation();
  const [deleteCourse, { isLoading: isDeleting }] = useDeleteCourseMutation();

  // Get lectures for selected course
  const { data: lecturesResponse } = useGetCourseLecturesQuery(
    selectedCourseId,
    {
      skip: !selectedCourseId,
    }
  );

  // Safely extract data
  const courses = coursesResponse?.course || [];
  const lectures = lecturesResponse?.lectures || [];

  // Handlers
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("title", courseForm.title);
      formData.append("description", courseForm.description);
      formData.append("category", courseForm.category);
      formData.append("createdBy", courseForm.createdBy);
      if (courseForm.file) {
        formData.append("file", courseForm.file);
      }

      const data = await createCourse(formData).unwrap();
      toast.success(`Course "${data.course.title}" created successfully!`);
      setIsCreateCourseModalOpen(false);
      setCourseForm({
        title: "",
        description: "",
        category: "",
        createdBy: "",
        file: null,
      });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to create course");
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    if (!selectedCourseId) return;

    try {
      const formData = new FormData();
      formData.append("title", newLecture.title);
      formData.append("description", newLecture.description);
      if (newLecture.video) {
        formData.append("video", newLecture.video);
      }

      const { data } = await addLecture({
        id: selectedCourseId,
        data: formData,
      }).unwrap();
      toast.success(`Lecture "${data.lecture.title}" added successfully!`);
      setIsAddLectureModalOpen(false);
      setNewLecture({
        title: "",
        description: "",
        video: null,
      });
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add lecture");
    }
  };

  const handleDeleteCourse = async (courseId) => {
    if (!courseId) return;

    try {
      // Show confirmation dialog
      const confirmed = window.confirm(
        "Are you sure you want to delete this course? This action cannot be undone."
      );

      if (!confirmed) return;

      // Show loading state
      toast.info("Deleting course...", { autoClose: false });

      // Execute deletion
      await deleteCourse(courseId).unwrap();

      // Success feedback
      toast.dismiss();
      toast.success("Course deleted successfully!");

      // Refresh course list
      refetch();
    } catch (err) {
      // Error handling
      toast.dismiss();
      console.error("Delete course error:", err);

      const errorMessage =
        err?.data?.message || err?.error || "Failed to delete course";

      toast.error(errorMessage);
    }
  };

  const handleDeleteLecture = async (courseId, lectureId) => {
    if (window.confirm("Are you sure you want to delete this lecture?")) {
      try {
        await deleteLecture({ courseId, lectureId }).unwrap();
        toast.success("Lecture deleted successfully!");
      } catch (err) {
        toast.error(err?.data?.message || "Failed to delete lecture");
      }
    }
  };

  // Loading and error states
  if (isLoading)
    return <div className="text-center py-8">Loading courses...</div>;

  if (isError) {
    console.error("Error loading courses:", error);
    return (
      <div className="text-center py-8 text-red-500">
        Error: {error?.data?.message || "Failed to load courses"}
        <button
          onClick={() => refetch()}
          className="ml-2 text-blue-500 hover:text-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Management</h1>
        <button
          onClick={() => setIsCreateCourseModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded flex items-center gap-2 hover:bg-blue-700 transition"
          disabled={isCreating}
        >
          <MdAdd /> Create Course
        </button>
      </div>

      {/* Courses List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition"
            >
              {/* Thumbnail with fallback */}
              <div className="h-48 bg-gray-200 overflow-hidden flex items-center justify-center">
                {course?.poster?.url ? (
                  <img
                    src={course.poster.url}
                    alt={course.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "fallback-image-url.jpg";
                    }}
                  />
                ) : (
                  <div className="text-gray-400 p-4 text-center">
                    No thumbnail available
                  </div>
                )}
              </div>

              <div className="p-4">
                <h3 className="font-bold text-lg mb-2">
                  {course.title || "Untitled Course"}
                </h3>
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {course.description || "No description provided"}
                </p>

                <div className="flex justify-between items-center">
                  <div>
                    <span className="text-sm text-gray-500 block">
                      Category: {course.category || "N/A"}
                    </span>
                    <span className="text-sm text-gray-500">
                      Lectures: {course.lectures?.length || 0}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourseId(course._id);
                        setIsAddLectureModalOpen(true);
                      }}
                      className="text-blue-500 hover:text-blue-700"
                      title="Add Lecture"
                    >
                      <MdAdd size={20} />
                    </button>
                    <button
                      onClick={() => setSelectedCourseId(course._id)}
                      className="text-green-500 hover:text-green-700"
                      title="View Lectures"
                    ></button>
                    <button
                      onClick={() => handleDeleteCourse(course._id)}
                      className="text-red-500 hover:text-red-700"
                      title="Delete Course"
                    >
                      <MdDelete size={20} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-8 text-gray-500">
            No courses found. Create your first course!
          </div>
        )}
      </div>

      {/* Create Course Modal */}
      <Modal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        title="Create New Course"
      >
        <form onSubmit={handleCreateCourse}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Title
              </label>
              <input
                type="text"
                value={courseForm.title}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, title: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                value={courseForm.description}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, description: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <input
                type="text"
                value={courseForm.category}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, category: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Instructor
              </label>
              <input
                type="text"
                value={courseForm.createdBy}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, createdBy: e.target.value })
                }
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                file
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) =>
                  setCourseForm({ ...courseForm, file: e.target.files[0] })
                }
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={() => setIsCreateCourseModalOpen(false)}
                className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isCreating}
                className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCreating ? "Creating..." : "Create Course"}
              </button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AllCourses;
