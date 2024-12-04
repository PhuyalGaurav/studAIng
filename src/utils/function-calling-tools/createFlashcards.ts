import { ChatCompletionTool } from "openai/resources/index.mjs";

const createFlashcards: ChatCompletionTool = {
  type: "function",
  function: {
    name: "create_flashcards",
    description: "Use this to create a set of flashcards, each containing a term and its definition.",
    parameters: {
      type: "object",
      properties: {
        flashcards: {
          type: "array",
          description: "An array of flashcards, each with a term and its definition.",
          items: {
            type: "object",
            properties: {
              term: {
                type: "string",
                description: "The term or concept on the flashcard.",
              },
              definition: {
                type: "string",
                description: "The definition or explanation of the term. Do not include or give hints what the term is.",
              },
            },
            required: ["term", "definition"],
            additionalProperties: false,
          },
          minItems: 1,
        },
      },
      required: ["flashcards"],
      additionalProperties: false,
    },
  },
}

export default createFlashcards;