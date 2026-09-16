from pydantic import BaseModel


class CountdownCreate(BaseModel):
    nome: str
    data: str
    hora: str


class UserCreate(BaseModel):
    username: str
    password: str


class UserLogin(BaseModel):
    username: str
    password: str