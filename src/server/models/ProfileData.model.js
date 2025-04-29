import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const ProfileDataSchema = new Schema(
  {
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
    friendsList: [{ _id: Number }],
    ownedEvents: { type: [Number], default: [] },
    sharedEvents: { type: [Number], default: [] },
    noteCategories: { type: [String], default: [] },
    ownedNotes: { type: [Number], default: [] },
  },
  {
    timestamps: true,
  },
);

const ProfileData =
  global.models?.ProfileData ||
  models.ProfileData ||
  model("ProfileData", ProfileDataSchema);

export default ProfileData;
