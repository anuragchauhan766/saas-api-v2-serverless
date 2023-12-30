import { Schema, model } from "mongoose";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { z, infer as zodInfer } from "zod";
import { User } from "./user";

// !! Please match the moongose schema and zodschema if you are making any changes in schema

export const createConversationSchema = z
  .object({
    _id: zodMongoObjectId("_id").optional(),
    projectId: zodMongoObjectId("projectId"),
    senderId: zodMongoObjectId("senderId"),
    senderType: z.enum(["user", "guestUser"]).optional(),
    firstchat: z
      .object({
        message: z.string(),
        response: z.string(),
      })
      .strict(),
  })
  .strict();

export type IConversation = zodInfer<typeof createConversationSchema>;

const conversationSchema = new Schema<IConversation>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    projectId: {
      type: Schema.Types.ObjectId,
      ref: "Project",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      refPath: "senderType",
      required: true,
    },
    senderType: {
      type: String,
      enum: ["User", "GuestUser"],
      default: "User",
      required: true,
    },
    firstchat: {
      message: {
        type: String,
        required: true,
      },
      response: {
        type: String,
        required: true,
      },
    },
  },
  { timestamps: true }
);

export const Conversation = model<IConversation>(
  "Conversation",
  conversationSchema
);
