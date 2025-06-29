import mongoose from "mongoose";
const { Types } = mongoose;
import EventData from "../models/EventData.model.js";
import ProfileData from "../models/ProfileData.model.js";

export const createEvent = async (req, res) => {
  const {
    title,
    description,
    date,
    location,
    type,
    frequency_type,
    frequencyWeekDays,
    repetition,
    place,
  } = req.body;

  if (!title || !date || !type) {
    return res.status(400).json({
      success: false,
      message: "Please provide title, date and type for the event",
    });
  }

  const newEventData = new EventData({
    title,
    description,
    date,
    location,
    type: type || "basic",
    frequency_type: frequency_type || "daily",
    frequencyWeekDays: frequencyWeekDays || [],
    repetition: repetition || null,
    place: place || "",
  });

  const { userID } = req.params;
  if (!Types.ObjectId.isValid(userID)) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  try {
    const savedEvent = await newEventData.save();
    const updatedProfileData = await ProfileData.findByIdAndUpdate(
      userID,
      { $push: { ownedEvents: savedEvent._id } },
      { new: true },
    );

    if (!updatedProfileData) {
      await EventData.findByIdAndDelete(savedEvent._id);
      return res
        .status(404)
        .json({ success: false, message: "User not found, event not created" });
    }

    res.status(200).json({ success: true, data: savedEvent });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
