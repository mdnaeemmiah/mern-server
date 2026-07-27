import { ITerms } from "./terms.interface";
import { TermsModel } from "./terms.model";

const createTerms = async (payload: ITerms) => {
  const sectionNumber = payload.sectionNumber ?? 1;
  const existingSection = await TermsModel.findOne({
    sectionNumber,
    sectionTitle: { $nin: ["", null] },
  }).select("sectionTitle");

  const result = await TermsModel.create({
    ...payload,
    sectionNumber,
    sectionTitle: existingSection?.sectionTitle || payload.sectionTitle,
  });

  await TermsModel.updateMany(
    {
      sectionNumber,
      sectionTitle: { $in: ["", null] },
    },
    { $set: { sectionTitle: result.sectionTitle } },
  );

  return result;
};

const getAllTerms = () =>
  TermsModel.find().sort({ sectionNumber: 1, createdAt: 1 });

const getSingleTerms = (id: string) => TermsModel.findById(id);

const updateTerms = async (id: string, payload: Partial<ITerms>) => {
  const result = await TermsModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (result && payload.sectionTitle) {
    await TermsModel.updateMany(
      { sectionNumber: result.sectionNumber, _id: { $ne: result._id } },
      { $set: { sectionTitle: payload.sectionTitle } },
    );
  }

  return result;
};

const deleteTerms = (id: string) => TermsModel.findByIdAndDelete(id);

export const termsService = {
  createTerms,
  getAllTerms,
  getSingleTerms,
  updateTerms,
  deleteTerms,
};
