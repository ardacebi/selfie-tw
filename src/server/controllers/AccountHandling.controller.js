import ProfileData from "../models/ProfileData.model.js";
import { Types } from "mongoose";

export const accountSignUp = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide username and password",
    });
  }

  const newProfileData = new ProfileData({
    username,
    password,
  });

  try {
    await newProfileData.save();
    res.status(201).json({
      success: true,
      data: newProfileData,
    }); //201: Created
  } catch (error) {
    console.log("Error Profile could not be created:", error);
    res.status(500).json({
      success: false,
      message: "Profile could not be created",
    });
  }
};

export const accountLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide username and password",
    });
  }

  try {
    const profileData = await ProfileData.findOne({ username, password });
    res.status(200).json({ success: true, data: profileData });
  } catch (error) {
    console.log("Error Profile could not be found:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export const changeUsername = async (req, res) => {
  const { id } = req.params;
  const { username } = req.body;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  try {
    const updatedProfileData = await ProfileData.findByIdAndUpdate(
      id,
      { username },
      { new: true },
    );

    res.status(200).json({ success: true, data: updatedProfileData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const changePassword = async (req, res) => {
  const { id } = req.params;
  const { password } = req.body;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  try {
    const updatedProfileData = await ProfileData.findByIdAndUpdate(
      id,
      { password },
      { new: true },
    );

    res.status(200).json({ success: true, data: updatedProfileData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    await ProfileData.findByIdAndDelete(id);
    res.status(200).json({ success: true, message: "Profile deleted" });
  } catch (error) {
    res.status(404).json({ success: false, message: "Profile not found" });
  }
};
