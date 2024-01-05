import conversation from "@functions/conversation";
import project from "@functions/project";
import { Schema, model } from "mongoose";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { z, infer as zodInfer } from "zod";

// !! Please match the moongose schema and zodschema if you are making any changes in schema

export const createGuestUserSchema = z
  .object({
    _id: zodMongoObjectId("_id").optional(),
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
      ),
    projectId: zodMongoObjectId("projectId"),
    conversationId: zodMongoObjectId("conversationId"),
  })
  .strict();

export type IGuestUser = zodInfer<typeof createGuestUserSchema>;

const guestUserSchema = new Schema<IGuestUser>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
  },
  { timestamps: true }
);

export const GuestUser = model<IGuestUser>("GuestUser", guestUserSchema);
