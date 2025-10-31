import json
import os
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.ext.declarative import declarative_base
from pydantic import BaseModel
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

app = FastAPI()

# Conexión a SQLite con variable de entorno
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./encuesta.db")
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

class Respuesta(Base):
    __tablename__ = "respuestas"
    id = Column(Integer, primary_key=True, index=True)
    respuestas = Column(Text) # Campo para almacenar el JSON de la encuesta

Base.metadata.create_all(bind=engine)

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# CORS origins desde variables de entorno
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "http://localhost:5173,http://localhost:3000").split(",")

# Middleware CORS para permitir la conexión con el frontend de React
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/encuesta")
def guardar_respuesta(data: dict, db: Session = Depends(get_db)):
    print("Datos recibidos:", data)  # Debug
    respuestas_json = json.dumps(data, ensure_ascii=False)
    print("JSON generado:", respuestas_json)  # Debug
    nueva = Respuesta(respuestas=respuestas_json)
    db.add(nueva)
    db.commit()
    db.refresh(nueva)
    print("Guardado con ID:", nueva.id)  # Debug
    return {"message": "¡Respuesta guardada!", "id": nueva.id}

@app.get("/api/respuestas")
def ver_respuestas(db: Session = Depends(get_db)):
    respuestas = db.query(Respuesta).all()
    return [{"id": r.id, "respuestas": r.respuestas} for r in respuestas]

@app.get("/")
def root():
    return {"message": "API de Encuestas funcionando correctamente"}