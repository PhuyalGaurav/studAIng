from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.utils import upload, generate
from databases import Database
from app.config import DATABASE_URL

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

database = Database(DATABASE_URL)


@app.on_event("startup")
async def startup():
    await database.connect()


@app.on_event("shutdown")
async def shutdown():
    await database.disconnect()

app.include_router(upload.router)
app.include_router(generate.router)
