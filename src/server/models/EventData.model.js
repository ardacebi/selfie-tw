import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EventDataSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    duration: { type: Number, default: 0 }, // Duration in minutes. If zero it is considered as something that lasts all day
    location: String,
    type: { type: String, required: true, default: "basic" }, // Types can be: basic or recurring
    frequencyType: { type: String, default: "daily" }, // Frequency for recurring events. it can be daily, multipleAWeek, weekly, monthly, yearly
    frequencyWeekDays: { type: [Number], default: [] }, // For multipleAWeek and weekly events, it can be 0 (Sunday) to 6 (Saturday)
    repetition: { type: Number, default: 1 }, // How many times the event should repeat
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
