import re
from fastapi import APIRouter
from transformers import pipeline

router = APIRouter()

summarizer = pipeline(
    "summarization", model="meta-llama/Llama-3.2-1B-Instruct")
question_generator = pipeline(
    "text2text-generation", model="meta-llama/Llama-3.2-1B-Instruct")
flashcard_generator = pipeline(
    "text2text-generation", model="meta-llama/Llama-3.2-1B-Instruct")


@router.post("/summarize")
async def summarize_text(text: str):
    max_chunk_size = 512
    chunks = [text[i:i + max_chunk_size]
              for i in range(0, len(text), max_chunk_size)]

    summaries = []
    for chunk in chunks:
        input_length = len(chunk.split())
        max_length = min(150, input_length // 2)
        summary = summarizer(chunk, max_length=max_length,
                             min_length=50, do_sample=False)
        summaries.append(summary[0]['summary_text'])

    return {"summary": " ".join(summaries)}


@router.post("/generate_flashcards")
async def generate_flashcards(text: str):
    flashcards = generate_flashcards_from_text(text)
    return {"flashcards": flashcards}


@router.post("/generate_questions")
async def generate_questions(text: str):
    questions = generate_questions_from_text(text)
    return {"questions": questions}


def generate_flashcards_from_text(text):
    sentences = re.split(r'(?<=[.!?]) +', text)
    chunk_size = 3
    chunks = [' '.join(sentences[i:i + chunk_size])
              for i in range(0, len(sentences), chunk_size)]

    flashcard_list = []
    for chunk in chunks:
        prompt = f"Generate flashcards from the following text: {chunk}"
        print(f"Prompt: {prompt}")
        flashcards = flashcard_generator(
            prompt, max_new_tokens=50)
        print(f"Generated flashcards: {flashcards}")
        if flashcards and 'generated_text' in flashcards[0]:
            flashcard_pairs = flashcards[0]['generated_text'].split("\n")
            for pair in flashcard_pairs:
                if "-" in pair:
                    question, answer = pair.split("-", 1)
                    flashcard_list.append(
                        {"question": question.strip(), "answer": answer.strip()})
        else:
            print("No flashcards generated or 'generated_text' not found in response")

    return flashcard_list


def generate_questions_from_text(text):
    questions = question_generator(
        f"Generate questions from the following text: {text}", max_new_tokens=50)
    return questions[0]['generated_text'].split("\n")
