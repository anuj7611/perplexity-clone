import userModel from "../models/user.model.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "../services/mail.service.js";

export async function registerController(req, res) {
  const { email, username, password } = req.body;

  const isUserExist = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (isUserExist) {
    return res.status(400).json({
      message: "user already exist",
      success: false,
      err: "user already exist",
    });
  }

  const user = await userModel.create({
    email,
    username,
    password,
  });

  const emailVerificationToken = jwt.sign(
    {
      email: user.email,
    },
    process.env.JWT_SECRET,
  );

  await sendEmail({
    to: email,
    subject: "welcome to perplexity Ai",
    html: `
    <p>hi ${username},</p>
    <p>Thank you for registering at perplexity ai. we are excited to have you on board!</p>
    <p>To get started, please verify your email address by clicking the link below:</p>
    <a href="http://localhost:3000/api/auth/verify-email?token=${emailVerificationToken}">Verify Email</a>
    <p>If you did not create an account, please ignore this email.</p>
    <p>Best regards,<br/>The perplexity team</p>`,
  });

  res.status(201).json({
    message: "user created successfully",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function verifyEmailController(req, res) {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await userModel.findOne({ email: decoded.email });

    if (!user) {
      return res.status(400).json({
        message: "invalid token",
        success: false,
        err: "invalid token",
      });
    }

    user.verified = true;
    await user.save();

    const html = `
    <p>hi ${user.username},</p>
    <h1>Email Verified Successfully</h1>
    <p>Your email has been successfully verified. you can now login to your account and start using perplexity ai.</p>
    <a href="http://localhost:3000/login">Login to your account</a>
    <p>Best regards,<br/>The perplexity team</p>`;

    return res.send(html);
  } catch (err) {
    return res.status(400).json({
      message: "invalid token",
      success: false,
      err: "invalid token",
    });
  }
}

export async function loginController(req, res) {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).json({
      message: "invalid email and password",
      success: false,
      err: "invalid email and password",
    });
  }

  if (!user.verified) {
    return res.status(400).json({
      message: "email not verified",
      success: false,
      err: "email not verified",
    });
  }

  //   const isPasswordMatch = await user.comparePassword(password, user.password);

  //   if (!isPasswordMatch) {
  //     return res.status(400).json({
  //       message: "incorrect password",
  //       success: false,
  //       err: "incorrect password",
  //     });
  //   }

  const token = jwt.sign(
    {
      id: user._id,
      username: user.username,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

  res.cookie("token", token);

  res.status(200).json({
    message: "login successful",
    success: true,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
    },
  });
}

export async function getMeController(req, res) {
  const userId = req.user.id;

  const user = await userModel.findById(userId).select("-password");

  if (!user) {
    return res.status(404).json({
      message: "user not found",
      success: false,
      err: "user not found",
    });
  }

  res
    .status(201)
    .json({ message: "user details has been fetched", success: true, user });
}