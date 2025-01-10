import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const ProfileDataSchema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    friendsList: [{ _id: Number }],
    ownedEvents: { type: [Number], default: [] }, // Stores the event IDs of the events the user has created
    sharedEvents: { type: [Number], default: [] }, // Stores the event IDs of the events the user has been invited to
    noteCategories: { type: [String], default: [] }, // Stores the categories of notes the user has created
    ownedNotes: { type: [Number], default: [] }, // Stores the note IDs of the notes the user has created
  },
  {
    timestamps: true, //createdAt and updatedAt
  },
);

// Prevent OverwriteModelError by using a global variable
const ProfileData =
  global.models?.ProfileData ||
  models.ProfileData ||
  model("ProfileData", ProfileDataSchema);

export default ProfileData;
