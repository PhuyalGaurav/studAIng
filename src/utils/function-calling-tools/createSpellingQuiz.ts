import { ChatCompletionTool } from "openai/resources/index.mjs";

const createSpellingQuiz: ChatCompletionTool = {
  type: "function",
  function: {
    name: "create_spelling_quiz",
    description: "Generates a spelling quiz containing a word, definition, and example sentences.",
    parameters: {
      type: "object",
      properties: {
        spellings: {
          type: "array",
          description: "An array of words to include in the quiz.",
          items: {
            type: "object",
            properties: {
              word: {
                type: "string",
                description: "The word to be spelled.",
              },
              definition: {
                type: "string",
                description: "The definition of the word without using the word. Do not include or give hints about what the word is.",
              },
              examples: {
                type: "array",
                description: "An example sentence using the word. Include what the word is. Give a maximum of 3 examples.",
                items: {
                  type: "string",
                },
                minItems: 1,
                maxItems: 3,
              },
            },
            required: ["word", "definition", "examples"],
            additionalProperties: false,
          },
          minItems: 5,
        },
      },
      required: ["spellings"],
      additionalProperties: false,
    },
  },
};

export default createSpellingQuiz;
