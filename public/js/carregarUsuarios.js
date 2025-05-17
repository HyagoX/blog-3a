import { getDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { db } from "./auth.js";

export async function carregarDadosUsuario(uid) {
  const docRef = doc(db, "usuarios", uid);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const dados = docSnap.data();
    window.usuarioLogado = {
      uid,
      email: dados.email,
      cargo: dados.cargo,
      banido: dados.banido || false
    };
    return window.usuarioLogado;
  } else {
    alert("Usuário não encontrado no banco.");
    return null;
  }
}
