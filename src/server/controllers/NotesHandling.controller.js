import mongoose from "mongoose";
const { Types } = mongoose;
import NoteData from "../models/NoteData.model.js";
import ProfileData from "../models/ProfileData.model.js";

export const createNote = async (req, res) => {
    const { title, creationDate, lastModifiedDate, body } = req.body;
    
  if (!title || !body) {
    return res.status(400).json({
      success: false,
      message: "Please provide title and body",
    });
  }

  const newNoteData = new NoteData({
    title,
    creationDate,
    lastModifiedDate,
    body,
  });

  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  try {
    const savedNote = await newNoteData.save();
    const updatedProfileData = await ProfileData.findByIdAndUpdate(
      id,
      { $push : {ownedNotes: savedNote._id } },
      { new: true },
    );

    if (!updatedProfileData) {
      await NoteData.findByIdAndDelete(savedNote._id);
      return res.status(404).json({ success: false, message: "User not found, note not created" });
    }

    res.status(200).json({ success: true, data: updatedProfileData });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }

}
