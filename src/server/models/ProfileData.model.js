import mongoose from "mongoose";
import EventData from "EventData.model.js";

const { Schema, model, models } = mongoose;

const ProfileDataSchema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    friendsList: [{ _id: Number }],
    ownedEvents: { type: [EventData], default: [] },
    sharedEvents: { type: [EventData], default: [] },
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
