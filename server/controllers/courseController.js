import mongoose from "mongoose";
import { CAE } from "../middleware/catchAsyncError.js";
import Course from "../models/courseModel.js";
import getDataUri from "../utils/dataUri.js";
import ErrorHandler from "../utils/errorHandler.js";
import cloudinary from "cloudinary";

export const getAllCourses = CAE(async (req, res) => {
  const course = await Course.find().select("-lectures");

  res.status(200).json({ success: true, course });
});

export const getCourseDetails = CAE(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);

  if (!course) {
    return res
      .status(404)
      .json({ success: false, message: "Course not found" });
  }

  course.views += 1;
  await course.save();

  res.status(200).json({
    success: true,
    course,
  });
});

export const createCourse = CAE(async (req, res) => {
  try {
    const { title, description, category, createdBy, price } = req.body;

    // Validation
    if (!title || !description || !category || !createdBy) {
      return res
        .status(400)
        .json({ message: "All required fields must be filled" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Course poster is required" });
    }

    const file = req.file;
    const fileUri = getDataUri(file);

    // Upload poster to Cloudinary
    const uploadResult = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "course_posters",
    });

    // Create the course in the database
    const course = await Course.create({
      title,
      description,
      category,
      createdBy,
      price: price || 0,
      poster: {
        public_id: uploadResult.public_id,
        url: uploadResult.secure_url,
      },
      lectures: [],
      numOfVideos: 0,
      views: 0,
    });

    res.status(201).json({
      success: true,
      message: "Course created successfully",
      course,
    });
  } catch (error) {
    console.error("Create Course Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create course" });
  }
});

export const getCourseLecture = CAE(async (req, res, next) => {
  const { id } = req.params;

  // Validate ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid course ID format", 400));
  }

  // Get user ID if authenticated (for tracking viewed lectures)
  const userId = req.user?._id;

  const course = await Course.findByIdAndUpdate(
    id,
    { $inc: { views: 1 } },
    {
      new: true,
      select:
        "lectures title description numOfVideos price poster createdAt category",
    }
  ).populate({
    path: "lectures",
    select: "title duration videoUrl isPreview",
    options: { sort: { lectureNumber: 1 } }, // Assuming you have lecture ordering
  });

  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // Optional: Track user's course access (if authenticated)
  if (userId) {
    await User.findByIdAndUpdate(userId, {
      $addToSet: { accessedCourses: id },
    });
  }

  // Structure response data
  const responseData = {
    success: true,
    metaData: {
      title: course.title,
      description: course.description,
      category: course.category,
      price: course.price,
      poster: course.poster.url,
      createdAt: course.createdAt,
      numOfVideos: course.numOfVideos,
    },
    lectures: course.lectures,
  };

  res.status(200).json(responseData);
});

export const addLecture = CAE(async (req, res, next) => {
  const { id } = req.params;

  // Validate course ID format
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Invalid course ID format", 400));
  }

  // Find course and validate existence
  const course = await Course.findById(id);
  if (!course) {
    return next(new ErrorHandler("Course not found", 404));
  }

  // Validate required fields
  const { title, description } = req.body;
  if (!title?.trim() || !description?.trim()) {
    return next(new ErrorHandler("Title and description are required", 400));
  }

  // Validate file exists and is video
  if (!req.file) {
    return next(new ErrorHandler("Lecture video file is required", 400));
  }

  const file = req.file;

  // Validate file type
  if (!file.mimetype.startsWith("video/")) {
    return next(new ErrorHandler("Only video files are allowed", 400));
  }

  // Validate file size (100MB max)
  if (file.size > 100 * 1024 * 1024) {
    return next(new ErrorHandler("File size must be less than 100MB", 400));
  }

  try {
    // Convert file to data URI
    const fileUri = getDataUri(file);
    if (!fileUri?.content) {
      throw new Error("Failed to process video file");
    }

    // Upload to Cloudinary with additional video processing options
    const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
      folder: "lectures",
      resource_type: "video",
      chunk_size: 6000000, // 6MB chunks for better large file handling
      eager: [
        { width: 640, height: 360, crop: "scale" }, // Create optimized version
      ],
      eager_async: true,
    });

    // Create lecture object
    const newLecture = {
      title: title.trim(),
      description: description.trim(),
      video: {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
        duration: myCloud.duration, // Store video duration if available
      },
      createdAt: new Date(),
    };

    // Add to course and save
    course.lectures.push(newLecture);
    course.numOfVideos = course.lectures.length;
    course.updatedAt = new Date();

    await course.save();

    // Successful response
    res.status(201).json({
      success: true,
      message: "Lecture added successfully",
      lecture: newLecture,
      course: {
        id: course._id,
        title: course.title,
        totalLectures: course.numOfVideos,
      },
    });
  } catch (error) {
    console.error("Lecture upload error:", error);

    // Handle specific Cloudinary errors
    if (error.message.includes("File size too large")) {
      return next(
        new ErrorHandler("Video file exceeds maximum size limit", 400)
      );
    }
    if (error.message.includes("upload")) {
      return next(new ErrorHandler("Failed to process video upload", 500));
    }

    // Generic error handler
    return next(new ErrorHandler("Internal server error", 500));
  }
});

export const deleteCourse = CAE(async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find the course first to get Cloudinary public_id
    const course = await Course.findById(id);
    if (!course) {
      return next(new ErrorHandler("Course not found", 404));
    }

    // Delete from Cloudinary first
    if (course.poster?.public_id) {
      await cloudinary.v2.uploader.destroy(course.poster.public_id);
    }

    // Delete lectures' videos from Cloudinary
    for (const lecture of course.lectures) {
      if (lecture.video?.public_id) {
        await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
          resource_type: "video",
        });
      }
    }

    // Delete from database
    await Course.deleteOne({ _id: id });

    res.status(200).json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error) {
    console.error("Delete course error:", error);
    next(new ErrorHandler("Failed to delete course", 500));
  }
});

export const deleteLecture = CAE(async (req, res, next) => {
  const { courseId, lectureId } = req.body;

  if (!courseId || !lectureId)
    return next(new ErrorHandler("please enter all fields", 400));

  const course = await Course.findById(courseId);

  if (!course) return next(new ErrorHandler("course not present", 400));

  const lecture = course.lectures.find((item) => {
    if (item._id.toString() === lectureId.toString()) return item;
  });

  await cloudinary.v2.uploader.destroy(lecture.video.public_id, {
    resource_type: "video",
  });

  course.lectures = course.lectures.filter((item) => {
    if (item._id.toString() !== lectureId.toString()) return item;
  });

  course.numOfVideos = course.lectures.length;
  await course.save();

  res
    .status(200)
    .json({ message: "lecture deleted successfully ", success: true });
});
