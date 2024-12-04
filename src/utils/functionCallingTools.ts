/* eslint-disable @typescript-eslint/no-explicit-any */
import { ChatCompletionTool } from "openai/resources/index.mjs";
import createQuiz from "./function-calling-tools/createQuiz";
import createPptSlides from "./function-calling-tools/createPptSlides";
import createFlashcards from "./function-calling-tools/createFlashcards";
import drawCanvas from "./function-calling-tools/drawCanvas";
import imageUpload from "./function-calling-tools/imageUpload";
import createSpellingQuiz from "./function-calling-tools/createSpellingQuiz";
import createPhysicsSimulator from "./function-calling-tools/createPhysicsSimulator";

const functionCallingTools: ChatCompletionTool[] = [
  createQuiz,
  createPptSlides,
  createFlashcards,
  drawCanvas,
  imageUpload,
  createSpellingQuiz,
  createPhysicsSimulator
]

export default functionCallingTools;