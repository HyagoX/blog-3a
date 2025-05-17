import { updateDoc, doc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";
import { db } from "./auth.js";

export async function banirUsuario(uidUsuarioParaBanir) {
  if (!window.usuarioLogado || window.usuarioLogado.cargo !== "dono") {
    alert("Você não tem permissão para banir usuários.");
    return;
  }
  const docRef = doc(db, "usuarios", uidUsuarioParaBanir);
  await updateDoc(docRef, { banido: true });
  alert("Usuário banido com sucesso!");
}
