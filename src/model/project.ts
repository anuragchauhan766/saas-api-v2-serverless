import { Schema, Types, model } from "mongoose";
import * as path from "path";
import { zodObjectId } from "src/helper/zodObjectIdTypes";
import { string, z, infer as zodInfer } from "zod";

export const createProjectBodySchema = z
  .object({
    _id: zodObjectId("_id").optional(),
    name: z.string().min(1, "Please provide name"),
    ownerId: zodObjectId("ownerId"),
    // answers: z.string().optional(),
    backgroundColor: z.string().default("#ffffff").optional(),
    basePrompt: z.string().optional(),
    bot_logo: z.string().optional(),
    botBackgroundColor: z.string().optional(),
    botMessageColor: z.string().optional(),
    userMessageColor: z.string().optional(),
    bot_category: z.string().optional(),
    fileNames: z.string().array().optional(),
    fontColor: z.string().optional(),
    initialMessage: z.string().optional(),
    jobDescription: z.string().optional(),
    language_bot: z.string().optional(),
    links: z.string().array().optional(),
    // nameSpace: z.string().optional(), same as project name
    // projectName: z.string().optional(), already mention above with name field
    // questions: z.string().optional(), if these are interview question ? these are already handled in separate model
    temperature: z.number().optional(),
    visibility: z.enum(["private", "public"]).default("private"),
  })
  .strict();

export type IProject = zodInfer<typeof createProjectBodySchema>;

const projectSchema = new Schema<IProject>({
  _id: {
    type: Schema.Types.ObjectId,
    auto: true,
  },
  name: {
    type: String,
    required: true,
  },
  ownerId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  backgroundColor: {
    type: String,
    default: "#fff",
  },
  basePrompt: {
    type: String,
    default:
      "You are virtual expert on the provided files or a website. Answer all the questions related to it. If the question is not related to the context, politely respond that you dont know.",
  },
  bot_logo: {
    type: String,
  },
  botBackgroundColor: {
    type: String,
    default: "#fff",
  },
  botMessageColor: { type: String, default: "#f5f5f5" },
  userMessageColor: { type: String, default: "#fff" },
  bot_category: { type: String },
  fileNames: {
    type: [String],
  },
  fontColor: { type: String, default: "#000" },
  initialMessage: { type: String, default: "Ask me anything" },
  jobDescription: { type: String },
  language_bot: { type: String, default: "english" },
  links: { type: [String] },

  temperature: { type: Number, default: 0 },
  visibility: {
    type: String,
    default: "private",
  },
});

export const Project = model<IProject>("Project", projectSchema);
