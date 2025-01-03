import mongoose from "mongoose";
const { Types } = mongoose;
import ProfileData from "../models/ProfileData.model.js";

export const accountSignUp = async (req, res) => {
  const { email, username, password } = req.body;

  if (!email || !username || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide email, username and password",
    });
  }

  if (!email.includes('@')){
    return res.status(400).json({
      success: false,
      message: "Please provide a valid email",
    });
  }


  const profileData = await ProfileData.findOne({ email});
  if (profileData) {
    return res.status(400).json({
      success: false,
      message: "There already exists an account associated with this email",
    });
  }

  const newProfileData = new ProfileData({
    email,
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
  const { email, password } = req.body;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  const profileData = await ProfileData.findOne({ email });
  if (!profileData) {
    return res.status(404).json({
      success: false,
      message: "No account is associated with this email",
    });
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

export const getProfileIDByEmail = async (req, res) => {
  const { email } = req.body;

  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: 'Invalid email', userID: null});
  }

  try {
    const profileData = await ProfileData.findOne({ email });
    if (!profileData) {
      // Handle null, don’t return success
      return res.status(404).json({ success: false, message: 'User not found', userID: null });
    }
    return res.status(200).json({ success: true, message:'User found', userID: profileData._id });
  }
  catch(error){
    return res.status(500).json({ success: false, message: error.message, userID: null });
  }
  
  
}
