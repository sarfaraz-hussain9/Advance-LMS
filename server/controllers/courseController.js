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

  const course = await Course.findById(id);
  if (!course) return next(new ErrorHandler("course not found", 400));

  course.views += 1;

  await course.save();

  res.status(200).json({ success: true, lectures: course.lectures });
});

export const addLecture = CAE(async (req, res, next) => {
  const { id } = req.params;

  const course = await Course.findById(id);
  if (!course) return next(new ErrorHandler("course not found", 400));

  const { title, description } = req.body;
  if (!title || !description)
    return next(new ErrorHandler("please add all field", 400));

  const file = req.file;

  const fileUri = getDataUri(file);

  const myCloud = await cloudinary.v2.uploader.upload(fileUri.content, {
    resource_type: "video",
  });

  // updload file here
  course.lectures.push({
    title,
    description,
    video: {
      public_id: myCloud.public_id,
      url: myCloud.url,
    },
  });

  course.numOfVideos = course.lectures.length;
  await course.save();

  res.status(200).json({ success: true, message: "lecture added in course" });
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
