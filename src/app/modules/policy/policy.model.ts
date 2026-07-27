import mongoose, { Schema } from "mongoose";
import { IPolicy } from "./policy.interface";

const policySchema = new Schema<IPolicy>(
  {
    sectionNumber: { type: Number, required: true, min: 1, default: 1 },
    sectionTitle: { type: String, trim: true, default: "" },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const PolicyModel = mongoose.model<IPolicy>("Policy", policySchema);
