import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EventDataSchema = new Schema (
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,
    type: { type: String, required: true, default: "basic" }, // Types can be: basic, basic-recurring, study-session, exam, project
    
    /* These properties are for "project" or "study-session" event types. 
    They track if the project or study session has different phases, their number and other phases */
    hasPhases: Boolean,
    currentPhase: Number,
    otherPhases: [{ _id: Number, phaseNumber: Number }],

    /* These properties are for "exam" and "study-session" event types.
    The "exam" events keep track of their study-session child events, while the sudy-session keep track
    of their head exam event*/
    headExamID: Number,
    childStudySessions: [{ _id: Number }],

    invited_users: [{ _id: Number }]
  },
  {
    timestamps: true, // createdAt and updatedAt
  },
);

const EventData =
  global.models?.EventData ||
  models.EventData ||
  model("EventData", EventDataSchema);