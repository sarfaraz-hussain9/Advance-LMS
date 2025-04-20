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
import { MdAdd, MdDelete, MdExpandMore, MdExpandLess } from "react-icons/md";
import Modal from "../../components/Modal";

const AllCourses = () => {
  // Modal and selection state
  const [isCreateCourseModalOpen, setIsCreateCourseModalOpen] = useState(false);
  const [isAddLectureModalOpen, setIsAddLectureModalOpen] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const [expandedCourses, setExpandedCourses] = useState({});

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
  const { data: coursesResponse, isLoading, refetch } = useGetCoursesQuery();

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

  const courses = coursesResponse?.course || [];
  const lectures = lecturesResponse?.lectures || [];

  const toggleCourseExpansion = (courseId) => {
    setExpandedCourses((prev) => ({
      ...prev,
      [courseId]: !prev[courseId],
    }));
    if (!expandedCourses[courseId]) {
      setSelectedCourseId(courseId);
    }
  };

  const handleCourseFormChange = (e) => {
    const { name, value, files } = e.target;
    setCourseForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", courseForm.title);
    formData.append("description", courseForm.description);
    formData.append("category", courseForm.category);
    formData.append("createdBy", courseForm.createdBy);
    formData.append("file", courseForm.file);

    try {
      const res = await createCourse(formData).unwrap();
      toast.success(res.message || "Course created successfully");
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

  const handleDeleteCourse = async (courseId) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    try {
      const res = await deleteCourse(courseId).unwrap();
      toast.success(res.message || "Course deleted successfully");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete course");
    }
  };

  const handleAddLecture = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newLecture.title);
    formData.append("description", newLecture.description);
    formData.append("video", newLecture.video);

    try {
      const res = await addLecture({
        courseId: selectedCourseId,
        formData,
      }).unwrap();
      toast.success(res.message || "Lecture added successfully");
      setIsAddLectureModalOpen(false);
      setNewLecture({ title: "", description: "", video: null });
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to add lecture");
    }
  };

  const handleDeleteLecture = async (courseId, lectureId) => {
    if (!window.confirm("Are you sure you want to delete this lecture?"))
      return;
    try {
      const res = await deleteLecture({ courseId, lectureId }).unwrap();
      toast.success(res.message || "Lecture deleted");
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to delete lecture");
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">All Courses</h2>
        <button
          onClick={() => setIsCreateCourseModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Course
        </button>
      </div>

      <div className="space-y-6">
        {courses.length > 0 ? (
          courses.map((course) => (
            <div
              key={course._id}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <div
                className="p-4 bg-gray-50 flex justify-between items-center cursor-pointer"
                onClick={() => toggleCourseExpansion(course._id)}
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={
                      course?.poster?.url || "https://via.placeholder.com/100"
                    }
                    alt={course.title}
                    className="w-16 h-16 object-cover rounded"
                  />
                  <div>
                    <h3 className="font-bold text-lg">{course.title}</h3>
                    <p className="text-sm text-gray-500">
                      {course.lectures?.length || 0} lectures •{" "}
                      {course.category}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedCourseId(course._id);
                      setIsAddLectureModalOpen(true);
                    }}
                    className="text-blue-500 hover:text-blue-700 p-1"
                    title="Add Lecture"
                  >
                    <MdAdd size={20} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCourse(course._id);
                    }}
                    className="text-red-500 hover:text-red-700 p-1"
                    title="Delete Course"
                  >
                    <MdDelete size={20} />
                  </button>
                  {expandedCourses[course._id] ? (
                    <MdExpandLess size={20} className="text-gray-500" />
                  ) : (
                    <MdExpandMore size={20} className="text-gray-500" />
                  )}
                </div>
              </div>

              {expandedCourses[course._id] && (
                <div className="border-t">
                  {selectedCourseId === course._id && lectures.length > 0 ? (
                    <div className="divide-y">
                      {lectures.map((lecture) => (
                        <div
                          key={lecture._id}
                          className="p-4 hover:bg-gray-50 flex justify-between items-center"
                        >
                          <div>
                            <h4 className="font-medium">{lecture.title}</h4>
                            <p className="text-sm text-gray-500">
                              {lecture.description}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              handleDeleteLecture(course._id, lecture._id)
                            }
                            className="text-red-500 hover:text-red-700"
                          >
                            <MdDelete size={20} />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="p-4 text-sm text-gray-500">
                      No lectures found for this course.
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No courses found.</div>
        )}
      </div>

      {/* Create Course Modal */}
      <Modal
        isOpen={isCreateCourseModalOpen}
        onClose={() => setIsCreateCourseModalOpen(false)}
        title="Create New Course"
      >
        <form onSubmit={handleCreateCourse} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Course Title"
            required
            value={courseForm.title}
            onChange={handleCourseFormChange}
            className="input-field"
          />
          <textarea
            name="description"
            placeholder="Course Description"
            required
            value={courseForm.description}
            onChange={handleCourseFormChange}
            className="input-field"
          />
          <input
            type="text"
            name="category"
            placeholder="Category"
            required
            value={courseForm.category}
            onChange={handleCourseFormChange}
            className="input-field"
          />
          <input
            type="text"
            name="createdBy"
            placeholder="Instructor"
            required
            value={courseForm.createdBy}
            onChange={handleCourseFormChange}
            className="input-field"
          />
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            onChange={handleCourseFormChange}
            className="input-field"
          />
          <button
            type="submit"
            disabled={isCreating}
            className="btn-primary w-full"
          >
            {isCreating ? "Creating..." : "Create Course"}
          </button>
        </form>
      </Modal>

      {/* Add Lecture Modal */}
      <Modal
        isOpen={isAddLectureModalOpen}
        onClose={() => setIsAddLectureModalOpen(false)}
        title="Add Lecture"
      >
        <form onSubmit={handleAddLecture} className="space-y-4">
          <input
            type="text"
            name="title"
            placeholder="Lecture Title"
            required
            value={newLecture.title}
            onChange={(e) =>
              setNewLecture((prev) => ({ ...prev, title: e.target.value }))
            }
            className="input-field"
          />
          <textarea
            name="description"
            placeholder="Lecture Description"
            required
            value={newLecture.description}
            onChange={(e) =>
              setNewLecture((prev) => ({
                ...prev,
                description: e.target.value,
              }))
            }
            className="input-field"
          />
          <input
            type="file"
            accept="video/*"
            required
            onChange={(e) =>
              setNewLecture((prev) => ({ ...prev, video: e.target.files[0] }))
            }
            className="input-field"
          />
          <button
            type="submit"
            disabled={isAddingLecture}
            className="btn-primary w-full"
          >
            {isAddingLecture ? "Uploading..." : "Add Lecture"}
          </button>
        </form>
      </Modal>
    </div>
  );
};

export default AllCourses;
