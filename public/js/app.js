import { criarUsuario } from "./criarUsuario.js";

document.getElementById("formCadastro").addEventListener("submit", async (e) => {
    e.preventDefault();
    
    const email = document.getElementById("email").value;
    const username = document.getElementById("username").value.trim();
    const senha = document.getElementById("senha").value;
    
    // Feedback visual durante o cadastro
    const btn = e.target.querySelector("button[type='submit']");
    btn.textContent = "Cadastrando...";
    btn.disabled = true;
    
    try {
        await criarUsuario(email, username, senha);
        // Redirecionar após cadastro bem-sucedido
        window.location.href = "login.html?cadastro=sucesso";
    } catch (error) {
        alert("Erro no cadastro: " + error.message);
        btn.textContent = "Cadastrar";
        btn.disabled = false;
    }
});