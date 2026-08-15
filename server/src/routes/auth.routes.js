import { Router } from "express";
import { body } from "express-validator";
import rateLimit from "express-rate-limit";
import { validate } from "../middleware/validate.js";
import { requireAuth } from "../middleware/auth.js";
import {
  signup,
  login,
  me,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.controller.js";

const router = Router();

// Blunt brute-force guard on the credential endpoints.
const authLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Too many attempts. Please try again in a few minutes." },
});

const passwordRules = body("password")
  .isLength({ min: 8 })
  .withMessage("Use at least 8 characters")
  .matches(/[a-z]/)
  .withMessage("Include a lowercase letter")
  .matches(/[A-Z]/)
  .withMessage("Include an uppercase letter")
  .matches(/[0-9]/)
  .withMessage("Include a number");

router.post(
  "/signup",
  authLimiter,
  [
    body("fullName").trim().notEmpty().withMessage("Full name is required").escape(),
    body("businessName").optional().trim().escape(),
    body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
    passwordRules,
    body("confirmPassword").custom((value, { req }) => {
      if (value !== req.body.password) throw new Error("Passwords do not match");
      return true;
    }),
    body("role").isIn(["buyer", "seller"]).withMessage("Choose buyer or seller"),
    body("acceptedTerms")
      .equals("true")
      .withMessage("Please accept the Terms & Conditions"),
    // seller-only fields
    body("businessType")
      .if(body("role").equals("seller"))
      .trim()
      .notEmpty()
      .withMessage("Select a business type")
      .escape(),
    body("city")
      .if(body("role").equals("seller"))
      .trim()
      .notEmpty()
      .withMessage("City is required")
      .escape(),
    body("gstNumber").optional({ values: "falsy" }).trim().escape(),
  ],
  validate,
  signup
);

router.post(
  "/login",
  authLimiter,
  [
    body("email").isEmail().withMessage("Enter a valid email").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  validate,
  login
);

router.post(
  "/forgot-password",
  authLimiter,
  [body("email").isEmail().withMessage("Enter a valid email").normalizeEmail()],
  validate,
  forgotPassword
);

router.post(
  "/reset-password",
  authLimiter,
  [body("token").notEmpty(), passwordRules],
  validate,
  resetPassword
);

router.get("/me", requireAuth, me);
router.post("/logout", logout);

export default router;
