import { auth, signInWithEmailAndPassword, db } from './auth.js';
import { doc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

document.getElementById('formLogin').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value.trim();
    const senha = document.getElementById('loginSenha').value;
    const btn = e.target.querySelector('button[type="submit"]');
    
    btn.disabled = true;
    btn.textContent = 'Entrando...';

    try {
        const cred = await signInWithEmailAndPassword(auth, email, senha);

        // Checa se está banido
        const docRef = doc(db, "usuarios", cred.user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists() && docSnap.data().banido) {
            alert('Usuário banido. Contate o administrador.');
            btn.disabled = false;
            btn.textContent = 'Entrar';
            await auth.signOut();
            return;
        }
        window.location.href = 'dashboard.html';
    } catch (error) {
        alert('Erro no login: ' + error.message);
        btn.disabled = false;
        btn.textContent = 'Entrar';
    }
});