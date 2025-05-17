import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { doc, setDoc, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { auth, db } from "./auth.js";

// Para registro
document.getElementById("formRegistro").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("regEmail").value.trim();
    const username = document.getElementById("regUsername").value.trim();
    const senha = document.getElementById("regSenha").value;
    const senha2 = document.getElementById("regSenha2").value;
    const btn = e.target.querySelector("button[type='submit']");

    btn.textContent = "Cadastrando...";
    btn.disabled = true;

    if (senha !== senha2) {
        alert("As senhas não coincidem.");
        btn.textContent = "Criar conta";
        btn.disabled = false;
        return;
    }
    try {
        await criarUsuario(email, username, senha);
        window.location.href = "login.html?cadastro=sucesso";
    } catch (error) {
        alert("Erro no cadastro: " + error.message);
        btn.textContent = "Criar conta";
        btn.disabled = false;
    }
});

function validarEmailEscola(email) {
  return email.endsWith("@escola.pr.gov.br");
}

async function emailExiste(email) {
  const usuariosRef = collection(db, "usuarios");
  const q = query(usuariosRef, where("email", "==", email));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

async function usernameExiste(username) {
  const usuariosRef = collection(db, "usuarios");
  const q = query(usuariosRef, where("username", "==", username));
  const querySnapshot = await getDocs(q);
  return !querySnapshot.empty;
}

export async function criarUsuario(email, username, senha) {
  // Validações
  if (!validarEmailEscola(email)) {
    alert("Use seu email escolar @escola.pr.gov.br");
    throw new Error("Email inválido");
  }
  if (await emailExiste(email)) {
    alert("Este email já está cadastrado.");
    throw new Error("Email já cadastrado");
  }
  if (username.length < 3) {
    alert("Nome de usuário deve ter pelo menos 3 caracteres.");
    throw new Error("Nome de usuário curto");
  }
  if (await usernameExiste(username)) {
    alert("Este nome de usuário já está em uso.");
    throw new Error("Nome de usuário já cadastrado");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, senha);
    await setDoc(doc(db, "usuarios", userCredential.user.uid), {
      email,
      username,
      cargo: "membro",
      criadoEm: new Date(),
      banido: false
    });
    alert("Usuário criado com sucesso!");
    return userCredential.user;
  } catch (error) {
    alert("Erro: " + error.message);
    throw error;
  }
}