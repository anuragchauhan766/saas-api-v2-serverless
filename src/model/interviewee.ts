import { Schema, model } from "mongoose";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { z, infer as zodInfer } from "zod";

// !! Please match the moongose schema and zodschema if you are making any changes in schema

export const createIntervieweeSchema = z
  .object({
    projectId: zodMongoObjectId("projectId"),
    name: z.string().min(1, "Please provide name"),
    email: z
      .string()
      .min(1, "Please provide email")
      .email("Please provide valid email"),
    phone: z
      .string()
      .regex(
        /^([+]?[\s0-9]+)?(\d{3}|[(]?[0-9]+[)])?([-]?[\s]?[0-9])+$/,
        "Please provide valid phone number"
      ),
    questionAnswer: z.array(
      z
        .object({
          question: z.string(),
          answer: z.string(),
        })
        .strict()
    ),
  })
  .strict();

export type IInterviewee = zodInfer<typeof createIntervieweeSchema>;

const IntervieweeSchema = new Schema<IInterviewee>(
  {
    projectId: { type: Schema.Types.ObjectId, ref: "Project" },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true, unique: true },
    questionAnswer: [
      {
        question: { type: String, required: true },
        answer: { type: String, required: true },
      },
    ],
  },
  { timestamps: true }
);

export const Interviewee = model<IInterviewee>(
  "Interviewee",
  IntervieweeSchema
);
