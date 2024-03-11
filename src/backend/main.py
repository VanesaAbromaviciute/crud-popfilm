from fastapi import FastAPI, HTTPException

# Para poder utilizar campos con fecha
from datetime import date, datetime

# Pydantic es una librería para validar los datos.
# BaseModel sirve para definir clases para crear los modelos de datos que se van a usar en la API.
from pydantic import BaseModel

from typing import List

# Motor es una versión asíncrona de PyMongo,
# la biblioteca estándar de Python para trabajar con MongoDB.
import motor.motor_asyncio

#Para aceptar peticiones de diferentes dominios
from fastapi.middleware.cors import CORSMiddleware

# Define el modelo de datos para un usuario utilizando Pydantic.
# Esto ayuda a FastAPI a validar los tipos de datos entrantes.
class Movies(BaseModel):
    movie: str
    duration: str
    director: str
    oscar: str
    genre: str
    release_date: date

# Crea la instancia de la aplicación FastAPI
app = FastAPI()

#Lista de origenes permitidos
origins = [
    "http://localhost:5173"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], #Metodos permitidos
    allow_headers=["*"], #Cabeceras
)
# Cadena de conexión a MongoDB con autenticación
MONGODB_URL = "mongodb://admin:123@mongodb:27017/?authSource=admin"

client = motor.motor_asyncio.AsyncIOMotorClient(MONGODB_URL)
db = client.poppopfilm

# Endpoint para listar todas las películas.
@app.get("/movies/", response_description="Lista todas las películas", response_model=List[Movies])
async def list_movies():
    movies = await db["movies"].find().to_list(1000)
    return movies

# Endpoint para crear una nueva película
@app.post("/movies/", response_description="Añade una nueva película", response_model=Movies)
async def create_movies(movies:Movies):
    movies_dict = movies.dict()
    movies_dict["release_date"] = datetime.combine(movies.release_date, datetime.min.time())
    await db["movies"].insert_one(movies_dict)
    return movies

# Endpoint para obtener una pelicula específica por nombre
@app.get("/movies/{movie}", response_description="Obtiene una película por nombre", response_model=Movies)
async def find_movies(movie:str):
    movies = await db["movies"].find_one({"movie": movie})
    if movies is not None:
        return movies
    raise HTTPException(status_code=404, detail=f"Película con nombre {movie} no se ha encontrado.")

# Endpoint para borrar una película específica por nombre
@app.delete("/movies/{movie}", response_description="Borra una película por nombre", status_code=204)
async def delete_movie(movie:str):
     delete_result = await db["movies"].delete_one({"movie": movie})
     if delete_result.deleted_count ==0: 
      raise HTTPException(status_code=404, detail=f"Película con nombre {movie} no se ha encontrado.")

# Endpoint para actualizar una película específica por nombre
@app.put("/movies/{movie}", response_description="Actualiza una película por el nombre", response_model=Movies)
async def update_movies(movie: str, movies: Movies):
    movies_dict = movies.dict()
    movies_dict["release_date"] = datetime.combine(movies.release_date, datetime.min.time())
    await db["movies"].update_one({"movie": movie}, {"$set": movies_dict})
    return movies

# Endpoint para listar todas las peliculas recientes
@app.get("/movies/recents/", response_description="Obtiene las peliculas recientes",  response_model=List[Movies])
async def list_recents():
    now = datetime.now()
    pipeline = [
        {
            "$project": {
                "movie": 1,
                "duration": 1,
                "director": 1,
                "oscar": 1,
                "genre": 1,
                "release_date": 1,
                "años" : {
                        "$divide": [
                        {"$subtract": [ now, "$release_date"]},
                        365 * 24 * 60 * 60 * 1000
                        ]
                }
            }
        },
        {
            "$match": {
                "años": {"$lt": 20}
            }
        }
    ]
    recents = await db["movies"].aggregate(pipeline).to_list(1000)
    return recents

# Endpoint para listar todas las películas antiguas
@app.get("/movies/olds/", response_description="Obtiene las películas antiguas",  response_model=List[Movies])
async def list_olds():
    now = datetime.now()
    pipeline = [
        {
            "$project": {
                "movie": 1,
                "duration": 1,
                "director": 1,
                "oscar": 1,
                "genre": 1,
                "release_date": 1,
                "años" : {
                        "$divide": [
                        {"$subtract": [ now, "$release_date"]},
                        365 * 24 * 60 * 60 * 1000
                        ]
                }
            }
        },
        {
            "$match": {
                "años": {"$gte": 20}
            }
        }
    ]
    olds = await db["movies"].aggregate(pipeline).to_list(1000)
    return olds