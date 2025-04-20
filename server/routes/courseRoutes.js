import express from "express";
const router = express.Router();
import {
  getAllCourses,
  createCourse,
  getCourseLecture,
  addLecture,
  deleteCourse,
  deleteLecture,
  getCourseDetails,
} from "../controllers/courseController.js";
import singleUpload from "../middleware/multer.js";
import { authorizedAdmin, isAuthenticated } from "../middleware/auth.js";

router.get("/courses", getAllCourses);

router.get("/:id", isAuthenticated, getCourseDetails);
router.get("/lecture/:id", isAuthenticated, getCourseLecture);
router.post(
  "/createcourse",
  isAuthenticated,
  authorizedAdmin,
  singleUpload,
  createCourse
);

router.post("/:id", isAuthenticated, authorizedAdmin, singleUpload, addLecture);

router.post(
  "/create-course",
  isAuthenticated,
  authorizedAdmin,
  singleUpload,
  createCourse
);

router.delete("/:id", isAuthenticated, authorizedAdmin, deleteCourse);

router.delete("/lecture", isAuthenticated, authorizedAdmin, deleteLecture);

export default router;
