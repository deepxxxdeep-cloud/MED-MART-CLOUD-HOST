import { validationResult } from "express-validator";

// Turns express-validator failures into { message, errors: { field: msg } }
// so the form can highlight the exact field that failed.
export function validate(req, res, next) {
  const result = validationResult(req);
  if (result.isEmpty()) return next();

  const errors = {};
  for (const err of result.array()) {
    if (!errors[err.path]) errors[err.path] = err.msg;
  }
  return res.status(422).json({ message: "Please check the highlighted fields", errors });
}
