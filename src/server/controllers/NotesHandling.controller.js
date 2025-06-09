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
      { $push: { ownedNotes: savedNote._id } },
      { new: true },
    );

    if (!updatedProfileData) {
      await NoteData.findByIdAndDelete(savedNote._id);
      return res
        .status(404)
        .json({ success: false, message: "User not found, note not created" });
    }

    res.status(200).json({ success: true, data: savedNote });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getAllUserNotes = async (req, res) => {
  const { id } = req.params;

  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }

  try {
    const profile = await ProfileData.findById(id);

    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const profileNotes = profile.ownedNotes;

    const notes = await NoteData.find({ _id: { $in: profileNotes } });
    const result = notes.map((n) => ({
      _id: n._id,
      title: n.title,
      creationDate: n.creationDate,
      lastModifiedDate: n.lastModifiedDate,
      body: n.body,
    }));

    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const getNoteById = async (req, res) => {
  const { noteID } = req.body;

  if (!Types.ObjectId.isValid(noteID)) {
    return res.status(404).json({ success: false, message: "Invalid Note ID" });
  }

  try {
    const note = await NoteData.findById(noteID);
    if (!note) {
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: note._id,
        title: note.title,
        creationDate: note.creationDate,
        lastModifiedDate: note.lastModifiedDate,
        body: note.body,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};

export const updateNote = async (req, res) => {
  const { title, creationDate, lastModifiedDate, body } = req.body;

  if (!title && !body && !creationDate && !lastModifiedDate) {
    return res.status(400).json({
      success: false,
      message: "you need at least one field to update",
    });
  }

  const { id } = req.params;
  if (!Types.ObjectId.isValid(id)) {
    return res.status(404).json({ success: false, message: "Invalid User ID" });
  }
  try {
    const updatedNote = await NoteData.findByIdAndUpdate(
      id,
      {
        title,
        creationDate,
        lastModifiedDate,
        body,
      },
      { new: true },
    );

    if (!updatedNote)
      return res
        .status(404)
        .json({ success: false, message: "Note not found" });

    res.status(200).json({ success: true, data: updatedNote });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Server Error", error: error.message });
  }
};
