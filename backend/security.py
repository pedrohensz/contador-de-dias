from passlib.context import CryptContext
from jose import jwt
from jose import JWTError, jwt
import os
from dotenv import load_dotenv

load_dotenv()
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto"
)


SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"


def criar_hash_senha(senha):
    return pwd_context.hash(senha)


def verificar_senha(senha, senha_hash):
    return pwd_context.verify(senha, senha_hash)


def criar_token(usuario_id):
    payload = {
        "sub": str(usuario_id)
    }

    return jwt.encode(
        payload,
        SECRET_KEY,
        algorithm=ALGORITHM
    )


def verificar_token(token):
    try:
        payload = jwt.decode(
            token,
            SECRET_KEY,
            algorithms=[ALGORITHM]
        )

        usuario_id = payload.get("sub")

        if usuario_id is None:
            return None

        return int(usuario_id)

    except (JWTError, ValueError):
        return None