import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 2, maxlength: 50 },

  description: { type: String, required: true, minlength: 20 },

  lectures: [
    {
      title: { type: String, required: true, minlength: 2, maxlength: 50 },
      description: { type: String, required: true, minlength: 20 },
      video: {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    },
  ],

  poster: {
    public_id: { type: String, required: true },
    url: { type: String, required: true },
  },

  views: { type: Number, default: 0 },

  numOfVideos: { type: Number, default: 0 },

  price: { type: Number, default: 0 },

  category: { type: String, required: true },

  createdBy: { type: String, required: true },

  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Course = mongoose.model("Course", courseSchema);

export default Course;
