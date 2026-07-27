import mongoose, { Schema } from "mongoose";
import { ITerms } from "./terms.interface";

const termsSchema = new Schema<ITerms>(
  {
    sectionNumber: { type: Number, required: true, min: 1, default: 1 },
    sectionTitle: { type: String, trim: true, default: "" },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

export const TermsModel = mongoose.model<ITerms>("Terms", termsSchema);
