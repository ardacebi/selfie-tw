import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EventDataSchema = new Schema (
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,

    // Types can be: basic, basic-recurring, study-session, exam, project, activity
    type: { type: String, required: true, default: "basic" },
    
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

    // This property is for "activity" event types. It keeps track of the due date of the activity
    activityDueDate: { type: Date, required: true },

    // Used to keep track of the users that are invited to the event
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

  export default EventData;