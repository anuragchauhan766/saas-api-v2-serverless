import { jsonResponse } from "./jsonResponse";

export const handleDuplicateKeyError = (errorMessage: string) => {
  const regex = /collection: (\S+) index: (.+?) dup key: ({.*})/;
  const match = errorMessage.match(regex);

  if (match) {
    const collection = match[1];
    const index = match[2];
    const keyInfo = match[3];

    return jsonResponse(409, {
      success: false,
      name: "DuplicateKeyError: Resource already exists with provided information",
      message: `keys combination already exists in collection ${collection}, index: ${index}`,
      duplicateKeys: keyInfo,
    });
  }

  return jsonResponse(409, {
    success: false,
    name: "DuplicateKeyError",

    message: `keys combination already exists`,
  });
};
