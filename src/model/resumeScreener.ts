import conversation from "@functions/conversation";
import project from "@functions/project";
import { Schema, model } from "mongoose";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { z, infer as zodInfer } from "zod";

// !! Please match the moongose schema and zodschema if you are making any changes in schema

export const createResumeScreenerSchema = z
  .object({
    name: z.string().min(1, "Please provide name"),
    email: z
      .string()
      .min(1, "Please provide email")
      .email("Please provide valid email"),
    phone: z
      .string()
      .regex(
        /^([+]?[s0-9]+)?(d{3}|[(]?[0-9]+[)])?([-]?[s]?[0-9])+$/,
        "Please provide valid phone number"
      )
      .optional(),
    projectId: zodMongoObjectId("projectId"),
    score: z.number(),
  })
  .strict();

export type IResumeScreener = zodInfer<typeof createResumeScreenerSchema>;

const resumeScreenerSchema = new Schema<IResumeScreener>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    score: { type: Number, required: true },
  },
  { timestamps: true }
);

export const ResumeScreener = model<IResumeScreener>(
  "ResumeScreener",
  resumeScreenerSchema
);
