import { Schema, model } from "mongoose";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { z, infer as zodInfer } from "zod";

// !! Please match the moongose schema and zodschema if you are making any changes in schema

export const createUserBodySchema = z
  .object({
    _id: zodMongoObjectId("_id").optional(),
    name: z.string().min(1, "Please provide name"),
    email: z
      .string()
      .min(1, "Please provide email")
      .email("Please provide valid email"),
    role: z.enum(["developer", "subscriber", "admin"]).optional(),
    accountType: z.enum(["bussiness", "education"]).optional(),
  })
  .strict();

export type IUser = zodInfer<typeof createUserBodySchema>;

const userSchema = new Schema<IUser>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: {
      type: String,
      enum: ["subscriber", "developer", "admin"],
      default: "subscriber",
    },
    accountType: {
      type: String,
      enum: ["bussiness", "education"],
      default: "education",
    },
  },
  { timestamps: true }
);

export const User = model<IUser>("User", userSchema);
