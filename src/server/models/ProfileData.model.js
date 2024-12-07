import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const ProfileDataSchema = new Schema(
  {
    username: { type: String, required: true },
    password: { type: String, required: true },
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
