import { IPolicy } from "./policy.interface";
import { PolicyModel } from "./policy.model";

const createPolicy = async (payload: IPolicy) => {
  const sectionNumber = payload.sectionNumber ?? 1;
  const existingSection = await PolicyModel.findOne({
    sectionNumber,
    sectionTitle: { $nin: ["", null] },
  }).select("sectionTitle");

  const result = await PolicyModel.create({
    ...payload,
    sectionNumber,
    sectionTitle: existingSection?.sectionTitle || payload.sectionTitle,
  });

  await PolicyModel.updateMany(
    {
      sectionNumber,
      sectionTitle: { $in: ["", null] },
    },
    { $set: { sectionTitle: result.sectionTitle } },
  );

  return result;
};

const getAllPolicies = () =>
  PolicyModel.find().sort({ sectionNumber: 1, createdAt: 1 });

const getSinglePolicy = (id: string) => PolicyModel.findById(id);

const updatePolicy = async (id: string, payload: Partial<IPolicy>) => {
  const result = await PolicyModel.findByIdAndUpdate(id, payload, {
    new: true,
    runValidators: true,
  });

  if (result && payload.sectionTitle) {
    await PolicyModel.updateMany(
      { sectionNumber: result.sectionNumber, _id: { $ne: result._id } },
      { $set: { sectionTitle: payload.sectionTitle } },
    );
  }

  return result;
};

const deletePolicy = (id: string) => PolicyModel.findByIdAndDelete(id);

export const policyService = {
  createPolicy,
  getAllPolicies,
  getSinglePolicy,
  updatePolicy,
  deletePolicy,
};
