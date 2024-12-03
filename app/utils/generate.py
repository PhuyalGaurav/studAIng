import re
from fastapi import APIRouter
from transformers import pipeline

router = APIRouter()

summarizer = pipeline("summarization")
question_generator = pipeline("text2text-generation", model="t5-small")


@router.post("/summarize")
async def summarize_text(text: str):
    summary = summarizer(text, max_length=150, min_length=50, do_sample=False)
    return {"summary": summary[0]['summary_text']}


@router.post("/generate_flashcards")
async def generate_flashcards(text: str):
    flashcards = generate_flashcards_from_text(text)
    return {"flashcards": flashcards}


@router.post("/generate_questions")
async def generate_questions(text: str):
    questions = generate_questions_from_text(text)
    return {"questions": questions}


def generate_flashcards_from_text(text):
    pattern = re.compile(
        r'(\b[A-Z][a-z]+\b(?:\s[A-Z][a-z]+)*)\s*-\s*(.*?)(?:\.|\n|$)')
    matches = pattern.findall(text)

    flashcards = [{"question": term, "answer": definition}
                  for term, definition in matches]
    return flashcards


def generate_questions_from_text(text):
    questions = question_generator(
        f"Generate questions from the following text: {text}")
    return questions[0]['generated_text'].split("\n")
