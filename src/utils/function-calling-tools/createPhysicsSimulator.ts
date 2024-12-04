import { ChatCompletionTool } from "openai/resources/index.mjs";

const createPhysicsSimulator: ChatCompletionTool = {
  type: "function",
  function: {
    name: "run_physics_simulation",
    description: "run this function when user wants a physics simulator with physics objects based on their velocity, position, and weight.",
    parameters: {
      type: "object",
      properties: {
        objects: {
          type: "array",
          description: "An array of physics objects to be simulated.",
          items: {
            type: "object",
            properties: {
              id: {
                type: "string",
                description: "Unique identifier for the physics object.",
              },
              weight: {
                type: "number",
                description: "The weight of the object in kilograms or any metric unit.",
              },
              velocity: {
                type: "object",
                description: "The current velocity of the object.",
                properties: {
                  x: {
                    type: "number",
                    description: "Velocity in the x-direction (pixels per second).",
                  },
                  y: {
                    type: "number",
                    description: "Velocity in the y-direction (pixels per second).",
                  },
                },
                required: ["x", "y"],
                additionalProperties: false,
              },
              position: {
                type: "object",
                description: "The starting position of the object. screen size is only 350 x 230 pixels. make sure the objects are not in the direct edges, give a 30 pixel allowance",
                properties: {
                  x: {
                    type: "number",
                    description: "Starting x position in pixels.",
                  },
                  y: {
                    type: "number",
                    description: "Starting y position in pixels.",
                  },
                },
                required: ["x", "y"],
                additionalProperties: false,
              },
            },
            required: ["weight", "velocity", "position"],
            additionalProperties: false,
          },
          minItems: 1,
        },
      },
      required: ["objects"],
      additionalProperties: false,
    },
  },
}

export default createPhysicsSimulator;