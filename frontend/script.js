const botaoNovo = document.getElementById("novoCountdown");
const modal = document.getElementById("modal");
const botaoCancelar = document.getElementById("cancelar");

const nome = document.getElementById("nome");
const data = document.getElementById("data");
const hora = document.getElementById("hora");

const botaoCriar = document.getElementById("criar");
const tituloModal = document.querySelector("#modal h2");
const botaoSair = document.getElementById("sair");

let countdownEditando = null;
let cardEditando = null;


// *ABRIR MODAL*

botaoNovo.addEventListener("click", function() {

    botaoCriar.textContent = "Criar";
    tituloModal.textContent = "Novo Countdown";

    modal.style.display = "flex";

});


// *FECHAR MODAL*

botaoCancelar.addEventListener("click", function() {

    fecharModal();

});


// *CRIAR / EDITAR COUNTDOWN*

botaoCriar.addEventListener("click", function() {

    if (
        nome.value === "" ||
        data.value === "" ||
        hora.value === ""
    ) {

        alert("Preencha todos os campos.");
        return;

    }


    const token = sessionStorage.getItem("token");


    // *EDITAR COUNTDOWN*

    if (countdownEditando) {

        fetch(`/countdowns/${countdownEditando.id}`, {

            method: "PUT",

            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },

            body: JSON.stringify({

                nome: nome.value,
                data: data.value,
                hora: hora.value

            })

        })

        .then(function(response) {

            console.log("Resposta da API:", response);

            if (!response.ok) {

                throw new Error("Erro ao editar countdown");

            }

            return response.json();

        })

        .then(function(countdown) {

            console.log("Countdown editado:", countdown);

            cardEditando.querySelector(".titulo").textContent =
                countdown.nome;

            cardEditando.querySelector(".data").textContent =
                formatarData(countdown.data);

            cardEditando.querySelector(".hora").textContent =
                countdown.hora;


            // Atualiza o objeto usado pelo contador
            countdownEditando.nome = countdown.nome;
            countdownEditando.data = countdown.data;
            countdownEditando.hora = countdown.hora;


            fecharModal();

        })

        .catch(function(error) {

            console.error("Erro:", error);

            alert("Erro ao editar countdown.");

        });

        return;

    }


    // *CRIAR COUNTDOWN*

    fetch("/countdowns", {

        method: "POST",

        headers: {

            "Content-Type": "application/json",
            "Authorization": "Bearer " + token

        },

        body: JSON.stringify({

            // IMPORTANTE:
            // .value pega o conteúdo dos inputs
            nome: nome.value,
            data: data.value,
            hora: hora.value

        })

    })

    .then(function(response) {

        console.log("Resposta da API:", response);

        if (!response.ok) {

            throw new Error("Erro ao criar countdown");

        }

        return response.json();

    })

    .then(function(countdown) {

        console.log("Countdown criado:", countdown);

        mostrarCountdown(countdown);

        fecharModal();

    })

    .catch(function(error) {

        console.error("Erro:", error);

        alert("Erro ao criar countdown.");

    });

});


// *FECHAR MODAL E LIMPAR CAMPOS*

function fecharModal() {

    modal.style.display = "none";

    nome.value = "";
    data.value = "";
    hora.value = "";

    countdownEditando = null;
    cardEditando = null;

    botaoCriar.textContent = "Criar";

    tituloModal.textContent = "Novo Countdown";

}


// *MOSTRAR COUNTDOWN*

function mostrarCountdown(countdown) {

    const container = document.getElementById("countdowns");

    const card = document.createElement("div");

    card.classList.add("countdown-card");


    card.innerHTML = `

        <h2 class="titulo">${countdown.nome}</h2>

        <p class="data">
            ${formatarData(countdown.data)}
        </p>

        <p class="hora">
            ${countdown.hora}
        </p>


        <div class="tempo">

            <div>

                <span class="dias">0</span>

                <small>DIAS</small>

            </div>


            <div>

                <span class="horas">0</span>

                <small>HORAS</small>

            </div>


            <div>

                <span class="minutos">0</span>

                <small>MINUTOS</small>

            </div>


            <div>

                <span class="segundos">0</span>

                <small>SEGUNDOS</small>

            </div>

        </div>


        <div class="acoes">

            <button class="editar">
                Editar
            </button>

            <button class="excluir">
                Excluir
            </button>

        </div>

    `;


    container.appendChild(card);


    // *BOTÃO EDITAR*

    const botaoEditar = card.querySelector(".editar");


    botaoEditar.addEventListener("click", function() {

        countdownEditando = countdown;

        cardEditando = card;


        nome.value = countdown.nome;

        data.value = countdown.data;

        hora.value = countdown.hora;


        botaoCriar.textContent = "Salvar";

        tituloModal.textContent = "Editar Countdown";

        modal.style.display = "flex";

    });


    // *BOTÃO EXCLUIR*

    const botaoExcluir = card.querySelector(".excluir");


    botaoExcluir.addEventListener("click", function() {

        const confirmar = confirm(
            `Deseja excluir "${countdown.nome}"?`
        );


        if (!confirmar) {

            return;

        }


        excluirCountdown(countdown.id);

        card.remove();

    });


    // *ATUALIZA COUNTDOWN IMEDIATAMENTE*

    atualizarCountdown(countdown, card);


    // *ATUALIZA A CADA SEGUNDO*

    setInterval(function() {

        atualizarCountdown(countdown, card);

    }, 1000);

}


// *CALCULAR TEMPO RESTANTE*

function calcularTempoRestante(countdown) {

    const dataEvento = new Date(
        `${countdown.data}T${countdown.hora}`
    );


    const agora = new Date();


    const diferenca = dataEvento - agora;


    const segundosTotais = Math.floor(
        diferenca / 1000
    );


    const dias = Math.floor(
        segundosTotais / 86400
    );


    const horas = Math.floor(
        (segundosTotais % 86400) / 3600
    );


    const minutos = Math.floor(
        (segundosTotais % 3600) / 60
    );


    const segundos = segundosTotais % 60;


    return {

        dias,
        horas,
        minutos,
        segundos

    };

}


// *ATUALIZAR COUNTDOWN*


function atualizarCountdown(countdown, card) {

    const dataEvento = new Date(
        `${countdown.data}T${countdown.hora}`
    );

    const agora = new Date();

    const diferenca = dataEvento - agora;

    // Quando chegar no momento do evento
    if (diferenca <= 0) {
        card.classList.add("card-concluido")
        card.querySelector(".tempo").innerHTML = `
            <div class="mensagem-final">
                🎉 Chegou o dia!
            </div>
        `;

        return;
    }

    const tempo = calcularTempoRestante(countdown);

    card.querySelector(".dias").textContent =
        tempo.dias;

    card.querySelector(".horas").textContent =
        tempo.horas;

    card.querySelector(".minutos").textContent =
        tempo.minutos;

    card.querySelector(".segundos").textContent =
        tempo.segundos;
}



// *FORMATAR DATA*

function formatarData(data) {

    const dataFormatada = new Date(
        `${data}T00:00:00`
    );


    return dataFormatada.toLocaleDateString(
        "pt-BR",
        {

            day: "2-digit",
            month: "long",
            year: "numeric"

        }
    );

}


// *CARREGAR COUNTDOWNS*

function carregarCountdowns() {

    const token = sessionStorage.getItem("token");


    fetch("/countdowns", {

        headers: {

            "Authorization": "Bearer " + token

        }

    })

    .then(function(response) {

        if (response.status === 401) {

            window.location.href = "/static/login.html";

            return;

        }


        if (!response.ok) {

            throw new Error("Erro ao carregar countdowns");

        }


        return response.json();

    })

    .then(function(dados) {

        if (!dados) {

            return;

        }


        dados.forEach(function(countdown) {

            mostrarCountdown(countdown);

        });

    })

    .catch(function(error) {

        console.error("Erro ao carregar countdowns:", error);

    });

}


// *EXCLUIR COUNTDOWN*

function excluirCountdown(id) {

    const token = sessionStorage.getItem("token");


    fetch(`/countdowns/${id}`, {

        method: "DELETE",

        headers: {

            "Authorization": "Bearer " + token

        }

    })

    .then(function(response) {

        if (!response.ok) {

            throw new Error("Erro ao excluir countdown");

        }


        return response.json();

    })

    .then(function(resultado) {

        console.log("Countdown excluído:", resultado);

    })

    .catch(function(error) {

        console.error("Erro:", error);

        alert("Erro ao excluir countdown.");

    });

}

botaoSair.addEventListener("click", function() {

    sessionStorage.removeItem("token");

    window.location.href = "/static/login.html";

});


// FRASE DO DIA

function carregarFraseDoDia() {

    const elementoFrase = document.getElementById("frase-do-dia");

    fetch("https://www.drivebird.com/api/quotes/today")
        .then(function(response) {

            if (!response.ok) {
                throw new Error("Erro ao buscar frase");
            }

            return response.json();

        })
        .then(function(dados) {

            const frase = dados.data[0];

            elementoFrase.innerHTML = `
                <p class="frase">
                    "${frase.quote}"
                </p>

                <span class="autor">
                    — ${frase.author}
                </span>
            `;

        })
        .catch(function(error) {

            console.error("Erro ao carregar frase:", error);

            elementoFrase.innerHTML = `
                <p class="frase">
                    Keep going. You are closer than you think.
                </p>
            `;

        });
}


async function buscarDados() {

    const elementoFrase = document.getElementById("frase-do-dia");

    try {

        // Faz a requisição
        const resposta = await fetch(
            "https://www.drivebird.com/api/quotes/today"
        );

        // Verifica se a requisição deu certo
        if (!resposta.ok) {
            throw new Error(
                "Erro na requisição: " + resposta.status
            );
        }

        // Converte a resposta para JSON
        const dados = await resposta.json();
        console.log("DADOS RECEBIDOS:", dados);
        console.log("TIPO DE DATA:", typeof dados.data);
        console.log("DATA:", dados.data);    



        // Pega a primeira frase
        const frase = dados.data;

        // Mostra a frase na tela
        elementoFrase.innerHTML = `
            <p class="frase">
                "${frase.quote}"
            </p>

            <span class="autor">
                — ${frase.author}
            </span>
        `;

    } catch (error) {

        console.error("Erro ao carregar frase:", error);

        elementoFrase.innerHTML = `
            <p class="frase">
                Keep going. You are closer than you think.
            </p>
        `;
    }
}
// *INICIAR*

carregarFraseDoDia();
carregarCountdowns();

