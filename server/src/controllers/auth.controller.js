import crypto from "crypto";
import User from "../models/User.js";
import { signToken, setAuthCookie, clearAuthCookie } from "../utils/token.js";

function authSuccess(res, user, status = 200) {
  const token = signToken(user._id);
  setAuthCookie(res, token);
  return res.status(status).json({ user: user.toPublic() });
}

export async function signup(req, res, next) {
  try {
    const { fullName, businessName, email, password, role, businessType, gstNumber, city } =
      req.body;

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({
        message: "That email is already registered",
        errors: { email: "An account with this email already exists" },
      });
    }

    const user = await User.create({
      fullName,
      businessName,
      email,
      password,
      role,
      authProvider: "email",
      // only persist seller fields when the seller role was chosen
      ...(role === "seller" ? { businessType, gstNumber, city } : {}),
    });

    return authSuccess(res, user, 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email.toLowerCase() }).select("+password");

    // Same generic message whether the email is unknown or the password is
    // wrong, so this endpoint can't be used to enumerate accounts.
    const invalid = { message: "Invalid email or password" };
    if (!user) return res.status(401).json(invalid);

    if (!user.password) {
      return res.status(401).json({
        message: `This account uses ${user.authProvider} sign-in. Continue with ${user.authProvider} instead.`,
      });
    }

    const ok = await user.comparePassword(password);
    if (!ok) return res.status(401).json(invalid);

    return authSuccess(res, user);
  } catch (err) {
    next(err);
  }
}

export async function me(req, res) {
  return res.json({ user: req.user.toPublic() });
}

export async function logout(_req, res) {
  clearAuthCookie(res);
  return res.json({ message: "Logged out" });
}

export async function forgotPassword(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });

    // Always report success — otherwise this leaks which emails are registered.
    const generic = { message: "If that email is registered, a reset link is on its way" };
    if (!user || !user.password) return res.json(generic);

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    user.passwordResetExpires = Date.now() + 30 * 60 * 1000;
    await user.save({ validateBeforeSave: false });

    // TODO: send via a real mail provider. Until then the link is logged
    // server-side so the flow is testable in development.
    const resetUrl = `${process.env.CLIENT_URL}/reset-password?token=${rawToken}`;
    console.log(`[auth] password reset link for ${user.email}: ${resetUrl}`);

    return res.json(generic);
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { token, password } = req.body;
    const hashed = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashed,
      passwordResetExpires: { $gt: Date.now() },
    }).select("+passwordResetToken +passwordResetExpires");

    if (!user) {
      return res.status(400).json({ message: "That reset link is invalid or has expired" });
    }

    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    return authSuccess(res, user);
  } catch (err) {
    next(err);
  }
}
