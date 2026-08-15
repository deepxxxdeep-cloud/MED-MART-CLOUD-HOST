import { Router } from "express";
import { body } from "express-validator";
import Message from "../models/Message.js";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { inspectMessage, POLICY_MESSAGE } from "../utils/messageFilter.js";

const router = Router();

const VIOLATIONS_BEFORE_FLAG = 3;

router.post(
  "/send",
  requireAuth,
  [
    body("receiverId").notEmpty().withMessage("A recipient is required"),
    body("content").trim().notEmpty().withMessage("Write a message first").isLength({ max: 4000 }),
    body("inquiryId").optional(),
  ],
  validate,
  async (req, res, next) => {
    try {
      const { receiverId, content, inquiryId } = req.body;

      // Filtering happens server-side. The client shows the same warning, but
      // that check is a courtesy — this one is the actual enforcement.
      const verdict = inspectMessage(content);

      if (!verdict.allowed) {
        await Message.create({
          inquiryId,
          senderId: req.user._id,
          receiverId,
          content,
          isBlocked: true,
          blockedReason: verdict.reason,
          blockedCodes: verdict.violations.map((v) => v.code),
        });

        const violations = req.user.communicationViolations + 1;
        const nowFlagged = violations >= VIOLATIONS_BEFORE_FLAG;

        await User.updateOne(
          { _id: req.user._id },
          {
            $set: {
              communicationViolations: violations,
              ...(nowFlagged && !req.user.isFlagged
                ? { isFlagged: true, flaggedAt: new Date() }
                : {}),
            },
          }
        );

        return res.status(422).json({
          blocked: true,
          message: POLICY_MESSAGE,
          reason: verdict.reason,
          codes: verdict.violations.map((v) => v.code),
          violations,
          flagged: nowFlagged,
        });
      }

      const message = await Message.create({
        inquiryId,
        senderId: req.user._id,
        receiverId,
        content,
      });

      return res.status(201).json({ message });
    } catch (err) {
      next(err);
    }
  }
);

/** Preview endpoint so the composer can warn before the user hits send. */
router.post(
  "/check",
  requireAuth,
  [body("content").isString()],
  validate,
  (req, res) => {
    const verdict = inspectMessage(req.body.content);
    return res.json({
      allowed: verdict.allowed,
      reason: verdict.reason,
      codes: verdict.violations.map((v) => v.code),
      policy: POLICY_MESSAGE,
    });
  }
);

router.get("/thread/:inquiryId", requireAuth, async (req, res, next) => {
  try {
    const messages = await Message.find({
      inquiryId: req.params.inquiryId,
      isBlocked: false,
    })
      .sort({ createdAt: 1 })
      .limit(200);
    return res.json({ messages });
  } catch (err) {
    next(err);
  }
});

export default router;
