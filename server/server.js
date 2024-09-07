import app from "./app.js";
import DBconnect from "./conifg/db.js";
import dotenv from "dotenv";
import razorpay from "razorpay";
import cloudinary from "cloudinary";

dotenv.config();


cloudinary.v2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_SECRET_KEY,
});

export const instance = new razorpay({
  key_id: process.env.RAZORPAY_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const PORT = process.env.PORT;
const URL = process.env.MONGO_ATLAS_URL;

DBconnect(URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is up at ${PORT}`);
    });
  })
  .catch((err) => console.log(err.message));
