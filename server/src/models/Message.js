import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    inquiryId: { type: mongoose.Schema.Types.ObjectId, ref: "Inquiry", index: true },
    senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

    content: { type: String, required: true, maxlength: 4000 },

    // Blocked messages are still persisted — they're the audit trail behind a
    // violation count, and an admin reviewing a flagged account needs to see
    // what was actually attempted.
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String },
    blockedCodes: [{ type: String }],

    readAt: { type: Date },
  },
  { timestamps: true }
);

messageSchema.index({ inquiryId: 1, createdAt: 1 });

export default mongoose.model("Message", messageSchema);
