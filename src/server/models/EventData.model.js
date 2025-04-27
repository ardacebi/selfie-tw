import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EventDataSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,
    type: { type: String, required: true, default: "basic" },
    hasPhases: Boolean,
    currentPhase: Number,
    otherPhases: [{ _id: Number, phaseNumber: Number }],
    headExamID: Number,
    childStudySessions: [{ _id: Number }],
    activityDueDate: { type: Date, required: true },
    invited_users: [{ _id: Number }],
  },
  {
    timestamps: true,
  },
);

const EventData =
  global.models?.EventData ||
  models.EventData ||
  model("EventData", EventDataSchema);

export default EventData;
