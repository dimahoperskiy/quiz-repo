import mongoose, { InferSchemaType, Model } from "mongoose";

const AnswerSchema = new mongoose.Schema({
  question: String,
  userAnswer: String,
  correct: Boolean,
});

const ResultSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    total: Number,
    correct: Number,
    answers: [AnswerSchema],
  },
  { timestamps: true },
);

export type ResultType = InferSchemaType<typeof ResultSchema>;

export const Result: Model<ResultType> = mongoose.model("Result", ResultSchema);
