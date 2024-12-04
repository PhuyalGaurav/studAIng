import { ChatCompletionTool } from "openai/resources/index.mjs";

const drawCanvas: ChatCompletionTool = {
  type: "function",
  function: {
    name: "draw_canvas",
    description: "Use this function if the user wants to draw on a canvas to explain something",
    parameters: {
      type: "object",
      properties: {
      },
      required: [],
      additionalProperties: false,
    },
  },
};

export default drawCanvas;