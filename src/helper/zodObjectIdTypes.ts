import { Types } from "mongoose";
import { z } from "zod";

export const zodMongoObjectId = (field: string) =>
  z.union([
    z.string().refine(
      (value) => {
        try {
          new Types.ObjectId(value);
          return true;
        } catch (error) {
          return false;
        }
      },
      {
        message: `Invalid Field: ${field} should be a valid ObjectId`,
      }
    ),
    z.instanceof(Types.ObjectId),
  ]);
