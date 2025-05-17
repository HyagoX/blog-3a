import { auth, db } from './auth.js';
import { onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, getDoc, deleteDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

onAuthStateChanged(auth, (user) => {
  if(user) {
    document.getElementById('meuPerfilBtn').href = "perfil.html?uid=" + user.uid;
    document.getElementById('meuPerfilBtn').style.display = "inline-block";
  } else {
    document.getElementById('meuPerfilBtn').style.display = "none";
  }
});

let userCargo = null;
let userFoto = "img/default-avatar.png";
let userId = null;

// Elementos do DOM
const usernameDisplay = document.getElementById('username-display');
const btnLogout = document.getElementById('btnLogout');
const btnPost = document.getElementById('btnPost');
const postContent = document.getElementById('postContent');
const postsList = document.getElementById('postsList');

onAuthStateChanged(auth, async (user) => {
    if (!user) {
        window.location.href = 'login.html';
    } else {
        userId = user.uid;
        await loadUserInfo(user);
        loadPosts();
    }
});

async function loadUserInfo(user) {
    try {
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            usernameDisplay.textContent = docSnap.data().username;
            userCargo = docSnap.data().cargo;
            userFoto = docSnap.data().foto || "img/default-avatar.png";
        } else {
            usernameDisplay.textContent = user.email.split('@')[0];
            userCargo = null;
            userFoto = "img/default-avatar.png";
        }
    } catch {
        usernameDisplay.textContent = user.email.split('@')[0];
        userCargo = null;
        userFoto = "img/default-avatar.png";
    }
}

function loadPosts() {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    onSnapshot(q, (snapshot) => {
        postsList.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const post = docSnap.data();
            const postId = docSnap.id;
            const postElement = document.createElement('div');
            postElement.className = 'post-card';

            // Link para perfil do autor
            const authorLink = `<a href="perfil.html?uid=${post.authorId}" class="post-author-link">${post.authorName || post.authorEmail?.split('@')[0]}</a>`;
            const avatarImg = `<a href="perfil.html?uid=${post.authorId}"><img src="${post.authorFoto || 'img/default-avatar.png'}" class="post-avatar" alt="Avatar"></a>`;

            postElement.innerHTML = `
                <div class="post-header">
                    ${avatarImg}
                    <div>
                        <div class="post-author">${authorLink}</div>
                        <div class="post-date">${post.timestamp ? new Date(post.timestamp.toDate()).toLocaleString() : ""}</div>
                    </div>
                </div>
            `;

            const contentDiv = document.createElement('div');
            contentDiv.className = "post-content";
            contentDiv.textContent = post.content;
            postElement.appendChild(contentDiv);

            // Só dono pode editar/apagar todos
            if (userCargo === 'dono') {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'post-actions';
                const btnEditar = document.createElement('button');
                btnEditar.textContent = 'Editar';
                btnEditar.className = 'btn-editar';
                btnEditar.onclick = () => editarPost(postId, post.content, contentDiv);

                const btnApagar = document.createElement('button');
                btnApagar.textContent = 'Apagar';
                btnApagar.className = 'btn-apagar';
                btnApagar.onclick = () => apagarPost(postId);

                actionsDiv.appendChild(btnEditar);
                actionsDiv.appendChild(btnApagar);
                postElement.appendChild(actionsDiv);
            }

            postsList.appendChild(postElement);
        });
    });
}

async function apagarPost(postId) {
    if (confirm('Tem certeza que deseja apagar este post?')) {
        try {
            await deleteDoc(doc(db, 'posts', postId));
            alert('Post apagado!');
        } catch (err) {
            alert('Erro ao apagar post.');
        }
    }
}

function editarPost(postId, conteudoAtual, contentDiv) {
    const textarea = document.createElement('textarea');
    textarea.value = conteudoAtual;
    textarea.rows = 3;
    textarea.style.width = '100%';

    const btnSalvar = document.createElement('button');
    btnSalvar.textContent = 'Salvar';
    btnSalvar.className = 'btn-salvar';

    const btnCancelar = document.createElement('button');
    btnCancelar.textContent = 'Cancelar';
    btnCancelar.className = 'btn-cancelar';

    contentDiv.innerHTML = '';
    contentDiv.appendChild(textarea);
    contentDiv.appendChild(btnSalvar);
    contentDiv.appendChild(btnCancelar);

    btnSalvar.onclick = async () => {
        const novoConteudo = textarea.value.trim();
        if (novoConteudo) {
            try {
                await updateDoc(doc(db, 'posts', postId), {
                    content: novoConteudo
                });
                alert('Post atualizado!');
            } catch (err) {
                alert('Erro ao atualizar post.');
            }
        }
    };

    btnCancelar.onclick = () => {
        contentDiv.textContent = conteudoAtual;
    };
}

// Ao postar, salva foto/id do autor:
btnPost.addEventListener('click', async () => {
    const content = postContent.value.trim();
    if (content) {
        try {
            await addDoc(collection(db, 'posts'), {
                content,
                authorEmail: auth.currentUser.email,
                authorName: usernameDisplay.textContent,
                authorId: auth.currentUser.uid,
                authorFoto: userFoto,
                timestamp: serverTimestamp()
            });
            postContent.value = '';
        } catch (error) {
            console.error('Erro ao publicar:', error);
            alert('Erro ao publicar postagem');
        }
    }
});

btnLogout.addEventListener('click', () => {
    signOut(auth).then(() => {
        window.location.href = 'index.html';
    });
});