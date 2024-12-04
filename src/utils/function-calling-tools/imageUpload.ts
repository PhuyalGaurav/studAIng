import { ChatCompletionTool } from "openai/resources/index.mjs";

const imageUpload: ChatCompletionTool = {
  type: "function",
  function: {
    name: "image_upload",
    description: "Use this function if the user wants to upload an image",
    parameters: {
      type: "object",
      properties: {
      },
      required: [],
      additionalProperties: false,
    },
  },
};

export default imageUpload;