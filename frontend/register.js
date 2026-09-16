document.getElementById("register-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        document.getElementById("mensagem").textContent =
            "As senhas não coincidem.";

        return;
    }

    fetch("/users", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(function(response) {

            if (!response.ok) {
                throw new Error("Erro ao criar usuário.");
            }

            return response.json();
        })
        .then(function(dados) {

            document.getElementById("mensagem").textContent =
                "Usuário criado com sucesso!";

            setTimeout(function() {
                window.location.href = "/static/login.html";
            }, 1000);
        })
        .catch(function(error) {

            document.getElementById("mensagem").textContent =
                error.message;
        });
});