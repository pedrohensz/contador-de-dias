from sqlalchemy import Column, Integer, String, ForeignKey

from backend.database import Base


class Countdown(Base):
    __tablename__ = "countdowns"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String, nullable=False)
    data = Column(String, nullable=False)
    hora = Column(String, nullable=False)
    usuario_id = Column(Integer, ForeignKey("users.id"), nullable=False)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)