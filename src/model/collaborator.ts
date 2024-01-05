import project from "@functions/project";
import { Schema, model } from "mongoose";
import { zodMongoObjectId } from "src/helper/zodObjectIdTypes";
import { z, infer as zodInfer } from "zod";

// !! Please match the moongose schema and zodschema if you are making any changes in schema

export const createCollaboratorSchema = z
  .object({
    email: z
      .string()
      .min(1, "Please provide email")
      .email("Please provide valid email"),
    projectId: zodMongoObjectId("projectId"),
  })
  .strict();

export type ICollaborator = zodInfer<typeof createCollaboratorSchema>;

const collaboratorSchema = new Schema<ICollaborator>(
  {
    email: { type: String, required: true },
    projectId: { type: Schema.Types.ObjectId, ref: "Project", required: true },
  },
  { timestamps: true }
);

collaboratorSchema.index({ email: 1, projectId: 1 }, { unique: true });

export const Collaborator = model<ICollaborator>(
  "Collaborator",
  collaboratorSchema
);
