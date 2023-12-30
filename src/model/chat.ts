import { Schema, model } from "mongoose";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { z, infer as zodInfer } from "zod";

// !! Please match the moongose schema and zodschema if you are making any changes in schema

export const createChatSchema = z
  .object({
    _id: zodMongoObjectId("_id").optional(),
    conversationId: zodMongoObjectId("conversationId").optional(),
    message: z.string(),
    response: z.string(),
  })
  .strict();

export type IChat = zodInfer<typeof createChatSchema>;

const chatSchema = new Schema<IChat>(
  {
    _id: {
      type: Schema.Types.ObjectId,
      auto: true,
    },
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

export const Chat = model<IChat>("Chat", chatSchema);
