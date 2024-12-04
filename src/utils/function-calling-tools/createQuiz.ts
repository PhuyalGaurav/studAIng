import { ChatCompletionTool } from "openai/resources/index.mjs";

const createQuiz : ChatCompletionTool = {
  type: "function",
  function: {
    name: "create_quiz",
    description: "use this to create a quiz when user provides a lesson asking for a quiz",
    parameters: {
      type: "object",
      properties: {
        questions: {
          type: "array",
          description: "An array of quiz questions, each with its text and four answer choices.",
          items: {
            type: "object",
            properties: {
              questionText: {
                type: "string",
                description: "The text of the quiz question.",
              },
              choices: {
                type: "array",
                description: "An array of four answer choices for the question.",
                items: {
                  type: "object",
                  properties: {
                    text: {
                      type: "string",
                      description: "The text of the answer choice.",
                    },
                    isCorrect: {
                      type: "boolean",
                      description: "Indicates if this choice is the correct answer.",
                    },
                  },
                  required: ["text", "isCorrect"],
                  additionalProperties: false,
                },
                minItems: 4,
                maxItems: 4,
              },
            },
            required: ["questionText", "choices"],
            additionalProperties: false,
          },
          minItems: 1,
        },
      },
      required: ["questions"],
      additionalProperties: false,
    },
  },
}

export default createQuiz;