import mongoose from "mongoose";

const { Schema, model, models } = mongoose;

const NoteDataSchema = new Schema(
  {
    title: { type: String, required: true },
    body: { type: String, required: true },
    category: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const NoteData =
  global.models?.NoteData ||
  models.NoteData ||
  model("NoteData", NoteDataSchema);

export default NoteData;
