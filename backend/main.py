from fastapi import FastAPI, Depends, HTTPException, Header
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from backend.database import Base, engine, get_db
from backend.models import Countdown, User
from backend.schemas import CountdownCreate, UserCreate, UserLogin
from backend.security import (
    criar_hash_senha,
    verificar_senha,
    criar_token,
    verificar_token
)


app = FastAPI()


Base.metadata.create_all(bind=engine)


app.mount(
    "/static",
    StaticFiles(directory="frontend"),
    name="static"
)


@app.get("/")
def inicio():
    return FileResponse("frontend/index.html")


# =========================
# AUTENTICAÇÃO
# =========================

def get_current_user(authorization: str = Header(None)):

    if not authorization:
        raise HTTPException(
            status_code=401,
            detail="Token não informado"
        )

    if not authorization.startswith("Bearer "):
        raise HTTPException(
            status_code=401,
            detail="Formato de token inválido"
        )

    token = authorization.replace("Bearer ", "")

    usuario_id = verificar_token(token)

    if usuario_id is None:
        raise HTTPException(
            status_code=401,
            detail="Token inválido"
        )

    return usuario_id


# =========================
# COUNTDOWNS
# =========================

@app.get("/countdowns")
def listar_countdowns(
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user)
):
    return db.query(Countdown).filter(
        Countdown.usuario_id == usuario_id
    ).all()


@app.post("/countdowns")
def criar_countdown(
    countdown: CountdownCreate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user)
):
    novo_countdown = Countdown(
        nome=countdown.nome,
        data=countdown.data,
        hora=countdown.hora,
        usuario_id=usuario_id
    )

    db.add(novo_countdown)
    db.commit()
    db.refresh(novo_countdown)

    return novo_countdown


@app.delete("/countdowns/{id}")
def excluir_countdown(
    id: int,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user)
):
    countdown = db.query(Countdown).filter(
        Countdown.id == id,
        Countdown.usuario_id == usuario_id
    ).first()

    if not countdown:
        return {"erro": "Countdown não encontrado"}

    db.delete(countdown)
    db.commit()

    return {
        "mensagem": "Countdown excluído com sucesso"
    }


@app.put("/countdowns/{id}")
def editar_countdown(
    id: int,
    countdown: CountdownCreate,
    db: Session = Depends(get_db),
    usuario_id: int = Depends(get_current_user)
):
    countdown_db = db.query(Countdown).filter(
        Countdown.id == id,
        Countdown.usuario_id == usuario_id
    ).first()

    if not countdown_db:
        return {"erro": "Countdown não encontrado"}

    countdown_db.nome = countdown.nome
    countdown_db.data = countdown.data
    countdown_db.hora = countdown.hora

    db.commit()
    db.refresh(countdown_db)

    return countdown_db


# =========================
# USUÁRIOS
# =========================

@app.post("/users")
def criar_usuario(
    usuario: UserCreate,
    db: Session = Depends(get_db)
):

    if len(usuario.password.encode("utf-8")) > 72:
        raise HTTPException(
            status_code=400,
            detail="A senha não pode ter mais de 72 bytes."
        )

    senha_hash = criar_hash_senha(
        usuario.password
    )

    novo_usuario = User(
        username=usuario.username,
        password_hash=senha_hash
    )

    db.add(novo_usuario)
    db.commit()
    db.refresh(novo_usuario)

    return {
        "id": novo_usuario.id,
        "username": novo_usuario.username
    }


@app.post("/login")
def login(
    usuario: UserLogin,
    db: Session = Depends(get_db)
):
    usuario_db = db.query(User).filter(
        User.username == usuario.username
    ).first()

    if not usuario_db:
        raise HTTPException(
            status_code=401,
            detail="Usuário ou senha inválidos"
        )

    senha_correta = verificar_senha(
        usuario.password,
        usuario_db.password_hash
    )

    if not senha_correta:
        raise HTTPException(
            status_code=401,
            detail="Usuário ou senha inválidos"
        )

    token = criar_token(usuario_db.id)

    return {
        "access_token": token,
        "token_type": "bearer"
    }