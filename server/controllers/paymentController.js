import { CAE } from "../middleware/catchAsyncError.js";
import User from "../models/userModel.js";
import ErrorHandler from "../utils/errorHandler.js";
import { instance } from "../server.js";

export const buySubscription = CAE(async (req, res, next) => {
  // 1. Find the user with proper error handling
  const user = await User.findById(req.user._id);
  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  // 2. Validate user role
  if (user.role === "admin") {
    return next(new ErrorHandler("Admins cannot purchase subscriptions", 403));
  }

  // 3. Check if user already has an active subscription
  if (user.subscription?.status === "active") {
    return next(new ErrorHandler("You already have an active subscription", 400));
  }

  try {
    // 4. Create subscription with Razorpay
    const subscription = await instance.subscriptions.create({
      plan_id: "plan_7wAosPWtrkhqZw",
      customer_notify: 1,
      total_count: 12,
    });

    // 5. Update user subscription details
    user.subscription = {
      id: subscription.id,
      status: subscription.status,
      plan_id: "plan_7wAosPWtrkhqZw",
      createdAt: new Date(),
    };

    await user.save();

    // 6. Send success response
    res.status(201).json({
      success: true,
      message: "Subscription created successfully",
      subscription,
    });

  } catch (error) {
    // 7. Handle Razorpay API errors
    console.error("Razorpay subscription error:", error);
    return next(
      new ErrorHandler(
        error.error.description || "Failed to create subscription",
        error.statusCode || 500
      )
    );
  }
});