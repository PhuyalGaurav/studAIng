import { ChatCompletionTool } from "openai/resources/index.mjs";

const createPptSlides : ChatCompletionTool = {
  type: "function",
  function: {
    name: "create_ppt_slides",
    description: "Use this function to create PowerPoint slides based on predefined templates. Each slide should specify its type and the corresponding content.", 
    parameters: {
      type: "object",
      properties: {
        slides: {
          type: "array",
          description: "An array of slide objects, each specifying the slide type and its content.",
          items: {
            type: "object",
            properties: {
              type: {
                type: "string",
                description: "The type of slide to create. Must be one of the predefined templates.",
                enum: [
                  "Header & Subheader Slide",
                  "Enumeration Slide",
                  "Definition Slide",
                  "Paragraph Slide",
                  "Comparison Slide"
                ]
              },
              content: {
                type: "object",
                description: "The content for the slide, structured according to the slide type.",
                oneOf: [
                  {
                    // Header & Subheader Slide
                    properties: {
                      type: { const: "Header & Subheader Slide" },
                      title: {
                        type: "string",
                        description: "The main title of the slide."
                      },
                      subtitle: {
                        type: "string",
                        description: "The subtitle or supporting text for the slide."
                      }
                    },
                    required: ["title", "subtitle"],
                    additionalProperties: false
                  },
                  {
                    // Enumeration Slide
                    properties: {
                      type: { const: "Enumeration Slide" },
                      title: {
                        type: "string",
                        description: "The title of the enumeration slide."
                      },
                      bullets: {
                        type: "array",
                        description: "A list of key points or topics.",
                        items: {
                          type: "string"
                        },
                        minItems: 3,
                        maxItems: 5
                      }
                    },
                    required: ["title", "bullets"],
                    additionalProperties: false
                  },
                  {
                    // Definition Slide
                    properties: {
                      type: { const: "Definition Slide" },
                      term: {
                        type: "string",
                        description: "The term or concept being defined."
                      },
                      definition: {
                        type: "string",
                        description: "The definition or explanation of the term."
                      }
                    },
                    required: ["term", "definition"],
                    additionalProperties: false
                  },
                  {
                    // Paragraph Slide
                    properties: {
                      type: { const: "Paragraph Slide" },
                      paragraph: {
                        type: "string",
                        description: "The paragraph text (maximum 700 characters).",
                        maxLength: 700
                      },
                    },
                    required: ["title", "paragraph"],
                    additionalProperties: false
                  },
                  {
                    // Comparison Slide
                    properties: {
                      type: { const: "Comparison Slide" },
                      title: {
                        type: "string",
                        description: "The title of the comparison slide."
                      },
                      comparisonItems: {
                        type: "array",
                        description: "An array of items to compare.",
                        items: {
                          type: "object",
                          properties: {
                            header: {
                              type: "string",
                              description: "The header for the comparison column."
                            },
                            points: {
                              type: "array",
                              description: "Bullet points or key features for the item.",
                              items: {
                                type: "string"
                              },
                              minItems: 1,
                              maxItems: 3
                            },
                          },
                          minItems: 2,
                          maxItems: 3,
                          required: ["header", "points"],
                          additionalProperties: false
                        },
                        minItems: 2
                      }
                    },
                    required: ["title", "comparisonItems"],
                    additionalProperties: false
                  }
                ]
              }
            },
            required: ["type", "content"],
            additionalProperties: false
          },
          minItems: 1
        }
      },
      required: ["slides"],
      additionalProperties: false
    }
  }
}

export default createPptSlides;