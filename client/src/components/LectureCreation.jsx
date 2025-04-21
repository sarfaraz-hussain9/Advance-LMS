import React, { useState } from "react";
import { toast } from "react-toastify";
import { MdClose } from "react-icons/md";
import { useAddLectureMutation } from "../redux/api/courseApi";

const LectureCreation = ({ courseId, courseTitle, onClose, onSuccess }) => {
  const [newLecture, setNewLecture] = useState({
    title: "",
    description: "",
    video: null, // Changed from 'file' to 'video' for clarity
  });

  const [addLecture, { isLoading: isAddingLecture }] = useAddLectureMutation();

  const handleAddLecture = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (!courseId) {
      toast.error("No course selected");
      return;
    }

    if (!newLecture.video) {
      toast.error("Please select a video file");
      return;
    }

    if (!newLecture.title.trim()) {
      toast.error("Lecture title is required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", newLecture.title);
      formData.append("description", newLecture.description);
      formData.append("file", newLecture.video); // Changed to 'video' to match backend

      const response = await addLecture({
        id: courseId,
        data: formData,
      });

      if (response.error) {
        throw response.error;
      }
      if (response.data.success) {
        // Lecture created successfully
        console.log("New lecture:", response.data.lecture);
        console.log("Course info:", response.data.course);
      } else {
        // Handle error
        console.error("Error:", response.error);
      }
      toast.success(`Lecture "${newLecture.title}" added successfully!`);
      setNewLecture({
        title: "",
        description: "",
        video: null,
      });
      onSuccess();
    } catch (err) {
      console.error("Add lecture error:", err);
      const errorMessage =
        err?.data?.message ||
        err?.error?.data?.message ||
        "Failed to add lecture. Please check the video file and try again.";
      toast.error(errorMessage);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button
          onClick={onClose}
          className="mr-4 text-gray-600 hover:text-gray-800"
        >
          <MdClose size={24} />
        </button>
        <h1 className="text-2xl font-bold">
          Add Lecture to {courseTitle || "Course"}
        </h1>
      </div>

      <form onSubmit={handleAddLecture} className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Lecture Title
            </label>
            <input
              type="text"
              value={newLecture.title}
              onChange={(e) =>
                setNewLecture({ ...newLecture, title: e.target.value })
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
              value={newLecture.description}
              onChange={(e) =>
                setNewLecture({
                  ...newLecture,
                  description: e.target.value,
                })
              }
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Video File
            </label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                setNewLecture({ ...newLecture, video: e.target.files[0] })
              }
              className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              required
            />
          </div>
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isAddingLecture}
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingLecture ? "Adding..." : "Add Lecture"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default LectureCreation;
