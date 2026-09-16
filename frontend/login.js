document.getElementById("login-form").addEventListener("submit", function(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    fetch("/login", {
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
            throw new Error("Usuário ou senha inválidos");
        }

        return response.json();
    })
    .then(function(dados) {
        console.log("Login realizado: ", dados);
        sessionStorage.setItem("token", dados.access_token);

        window.location.href = "/";
    })
    .catch(function(error) {
        document.getElementById("mensagem").textContent = error.message;
    });
});