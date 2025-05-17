import { collection, getDocs } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { db } from "./auth.js";

async function listarMembros() {
  const membrosDiv = document.getElementById("membros");
  membrosDiv.innerHTML = "<h2>Membros Cadastrados:</h2><ul id='lista-membros'></ul>";

  const lista = document.getElementById("lista-membros");

  try {
    const querySnapshot = await getDocs(collection(db, "usuarios"));
    if (querySnapshot.empty) {
      lista.innerHTML = "<li>Nenhum membro cadastrado.</li>";
      return;
    }
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${data.username || 'Sem nome'}</strong>
        <span style="margin-left:10px;">Email: ${data.email}</span>
        <span style="margin-left:10px;">Cargo: ${data.cargo}</span>
      `;
      lista.appendChild(li);
    });
  } catch (e) {
    membrosDiv.innerHTML = "<p>Erro ao carregar membros.</p>";
  }
}

// Chama ao carregar a página
listarMembros();