import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const EventDataSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    date: { type: Date, required: true },
    location: String,
    type: { type: String, required: true, default: "basic" }, // Types can be: basic or recurring
    frequency_type: { type: String, default: "daily" }, // Frequency for recurring events. it can be daily, multipleAWeek, weekly, monthly, yearly
    frequencyWeekDays: { type: [Number], default: [] }, // For multipleAWeek and weekly events, it can be 0 (Sunday) to 6 (Saturday)
    repetition: { type: Number, default: 1 }, // How many times the event should repeat
    place: String,
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
