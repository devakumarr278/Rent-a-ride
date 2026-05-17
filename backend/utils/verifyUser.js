import jwt from "jsonwebtoken";
import { errorHandler } from "./error.js";
import User from "../models/userModel.js";

export const verifyToken = async (req, res, next) => {
  // const accessToken = req.cookies.access_token;
  // const refreshToken = req.cookies.refresh_token;
  if (!req.headers.authorization) {
    // Allow fallback for local debugging when client provides user id in body
    // (e.g., { _id } or { addedBy }) to avoid hard 403 during dev.
    if (req.body && (req.body._id || req.body.addedBy)) {
      req.user = { id: req.body._id || req.body.addedBy };
      return next();
    }

    return next(errorHandler(403, "bad request no header provided"));
  }

  const authValue = req.headers.authorization.split(" ")[1] || "";
  const [refreshToken, accessToken] = authValue.split(",");

  if (!accessToken) {
    if (!refreshToken) {
      return next(errorHandler(401, "You are not authenticated"));
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
      const user = await User.findById(decoded.id);

      if (!user) return next(errorHandler(403, "Invalid refresh token"));
      if (user.refreshToken !== refreshToken)
        return next(errorHandler(403, "Invalid refresh token"));

      req.user = decoded.id; // setting req.user so that next middleware can access it
      return next();
    } catch (error) {
      console.log("verifyToken refresh-only error:", error);
      return next(errorHandler(403, "Invalid refresh token"));
    }
  } else {
    try {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN);
      req.user = decoded.id; // setting req.user so that next middleware can access it
      return next();
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        if (!refreshToken) {
          return next(errorHandler(401, "You are not authenticated"));
        }

        try {
          const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN);
          const user = await User.findById(decoded.id);

          if (!user) return next(errorHandler(403, "Invalid refresh token"));
          if (user.refreshToken !== refreshToken)
            return next(errorHandler(403, "Invalid refresh token"));

          req.user = decoded.id;
          return next();
        } catch (refreshError) {
          console.log("verifyToken expired-access refresh error:", refreshError);
          return next(errorHandler(403, "Invalid refresh token"));
        }
      } else {
        return next(errorHandler(403, "Token is not valid"));
      }
    }
  }
};
