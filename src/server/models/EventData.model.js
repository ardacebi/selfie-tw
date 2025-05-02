import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EventDataSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,
    type: { type: String, required: true, default: "basic" }, // Types can be: basic, basic-recurring, study-session, exam, project
    hasPhases: Boolean,
    currentPhase: Number,
    otherPhases: [{ _id: Schema.Types.ObjectId, phaseNumber: Number }],
    headExamID: Schema.Types.ObjectId,
    childStudySessions: [{ _id: Number }],
    activityDueDate: { type: Date, required: true },
    invited_users: [{ _id: Schema.Types.ObjectId }],
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
