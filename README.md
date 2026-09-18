# ⏳ Countdown

Aplicação web para criação e gerenciamento de contagens regressivas personalizadas.

O projeto começou como uma aplicação simples utilizando **HTML, CSS e JavaScript**, armazenando os dados no `localStorage`. Posteriormente, foi evoluído para uma arquitetura com **backend em FastAPI, banco de dados SQLite e autenticação de usuários com JWT**.

## 🚀 Funcionalidades

* 🔐 Cadastro de usuários
* 🔑 Login com autenticação JWT
* 👤 Dados separados por usuário
* ➕ Criação de countdowns
* ✏️ Edição de countdowns
* 🗑️ Exclusão de countdowns
* ⏱️ Contagem regressiva em tempo real
* 💾 Persistência dos dados em banco SQLite
* 🔒 Proteção das rotas da API
* 🌐 Interface web integrada ao backend

## 🛠️ Tecnologias

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Pydantic
* Passlib
* bcrypt
* python-jose / JWT
* Uvicorn

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API
* Session Storage

## 📁 Estrutura do projeto

```text
countdown/
│
├── countdown.db
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   ├── script.js
│   ├── login.html
│   ├── login.js
│   ├── register.html
│   └── register.js
│
├── backend/
│   ├── main.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── security.py
│
└── README.md
```

## 🔐 Autenticação

A aplicação utiliza **JWT (JSON Web Token)** para autenticar os usuários.

O fluxo funciona da seguinte maneira:

```text
Usuário
   │
   ▼
Login
   │
   ▼
FastAPI
   │
   ├── verifica usuário
   ├── verifica senha
   │
   ▼
JWT
   │
   ▼
Frontend
   │
   ▼
Session Storage
```

Após o login, o token é enviado nas requisições protegidas através do header:

```http
Authorization: Bearer <token>
```

O backend utiliza o identificador do usuário presente no token para garantir que cada usuário tenha acesso somente aos seus próprios countdowns.

## 🗄️ Banco de dados

Atualmente o projeto utiliza **SQLite** através do SQLAlchemy.

O banco possui duas tabelas principais:

### `users`

Armazena os usuários cadastrados.

| Campo           | Tipo    | Descrição                  |
| --------------- | ------- | -------------------------- |
| `id`            | Integer | Identificador do usuário   |
| `username`      | String  | Nome de usuário            |
| `password_hash` | String  | Senha armazenada como hash |

### `countdowns`

Armazena as contagens regressivas.

| Campo        | Tipo    | Descrição                  |
| ------------ | ------- | -------------------------- |
| `id`         | Integer | Identificador do countdown |
| `nome`       | String  | Nome do countdown          |
| `data`       | String  | Data de término            |
| `hora`       | String  | Hora de término            |
| `usuario_id` | Integer | Usuário proprietário       |

Existe uma relação entre:

```text
users
  │
  └─── 1:N ─── countdowns
```

Ou seja, um usuário pode possuir vários countdowns.

## ⚙️ Instalação

Clone o repositório:

```bash
git clone <URL_DO_REPOSITORIO>
```

Entre na pasta:

```bash
cd countdown
```

Crie um ambiente virtual:

```bash
python -m venv venv
```

Ative o ambiente virtual no Windows:

```bash
venv\Scripts\activate
```

Instale as dependências:

```bash
pip install fastapi uvicorn
pip install jinja2
pip install sqlalchemy
pip install passlib[bcrypt]
pip install python-jose[cryptography]
```

> O projeto utiliza `bcrypt 4.0.1` devido à compatibilidade com a versão utilizada pelo Passlib.

Instale a versão utilizada:

```bash
pip install bcrypt==4.0.1
```

## ▶️ Executando o projeto

Com o ambiente virtual ativado, execute:

```bash
uvicorn backend.main:app --reload
```

O servidor será iniciado localmente.

Acesse:

```text
http://127.0.0.1:8000
```

A documentação automática da API pode ser acessada em:

```text
http://127.0.0.1:8000/docs
```

## 🔌 Principais endpoints

### Usuários

#### Criar usuário

```http
POST /users
```

Exemplo:

```json
{
    "username": "pedro",
    "password": "minhasenha"
}
```

#### Login

```http
POST /login
```

Retorna um JWT:

```json
{
    "access_token": "...",
    "token_type": "bearer"
}
```

### Countdowns

#### Listar

```http
GET /countdowns
```

Requer autenticação.

#### Criar

```http
POST /countdowns
```

Requer autenticação.

Exemplo:

```json
{
    "nome": "Meu Countdown",
    "data": "2026-12-31",
    "hora": "23:59"
}
```

#### Editar

```http
PUT /countdowns/{id}
```

Requer autenticação.

#### Excluir

```http
DELETE /countdowns/{id}
```

Requer autenticação.

## 🔒 Segurança

As senhas dos usuários **não são armazenadas diretamente no banco de dados**.

Durante o cadastro, a senha passa por um processo de hashing utilizando bcrypt:

```text
Senha
  ↓
bcrypt
  ↓
Hash
  ↓
Banco de dados
```

Durante o login, a senha informada é comparada com o hash armazenado.

A API também verifica o JWT antes de permitir operações sobre os countdowns.

Além disso, as operações de consulta, edição e exclusão verificam o `usuario_id`, impedindo que um usuário manipule countdowns pertencentes a outra conta.

## 🧠 O que foi estudado neste projeto

Este projeto também funciona como um projeto de estudo para desenvolvimento web e backend.

Principais conceitos praticados:

* Desenvolvimento de APIs REST
* FastAPI
* SQLAlchemy
* Modelagem de banco de dados
* Relacionamentos entre tabelas
* CRUD
* Autenticação
* JWT
* Hash de senhas
* HTTP
* Headers
* Frontend ↔ Backend
* Fetch API
* Session Storage
* Deploy
* Git e GitHub

## 🔄 Evolução do projeto

### Versão 1

```text
HTML
CSS
JavaScript
   ↓
localStorage
```

A aplicação funcionava totalmente no navegador.

### Versão 2

```text
Frontend
   ↓
FastAPI
   ↓
SQLite
```

Os dados passaram a ser armazenados no backend.

### Versão 3

```text
Frontend
   ↓
FastAPI
   ↓
JWT
   ↓
SQLAlchemy
   ↓
SQLite
```

Foi adicionada autenticação e os countdowns passaram a pertencer a usuários específicos.

### Próximos passos

Algumas melhorias planejadas:

* [ ] Migrar SQLite para PostgreSQL
* [ ] Deploy em produção
* [ ] Configurar variáveis de ambiente
* [ ] Melhorar tratamento de erros
* [ ] Melhorar interface
* [ ] Adicionar recuperação de senha
* [ ] Adicionar expiração/renovação de tokens
* [ ] Adicionar validação mais completa dos dados
* [ ] Implementar HTTPS
* [ ] Criar sistema de backup
* [ ] Melhorar responsividade
* [ ] Adicionar testes automatizados

## 📌 Status

🚧 **Em desenvolvimento**

O projeto está funcional e atualmente possui cadastro, login, autenticação e CRUD completo dos countdowns.

## 👨‍💻 Autor

**Pedro Henrique**

Projeto desenvolvido como parte do processo de aprendizado em **Python, desenvolvimento backend e desenvolvimento web**.
