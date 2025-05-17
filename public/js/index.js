import { db } from './js/auth.js';
import { collection, query, orderBy, onSnapshot } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

const postsList = document.getElementById('postsList');

function loadPosts() {
    const q = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));
    onSnapshot(q, (snapshot) => {
        postsList.innerHTML = '';
        snapshot.forEach((docSnap) => {
            const post = docSnap.data();
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
                <div class="post-content">${post.content}</div>
            `;

            postsList.appendChild(postElement);
        });
    });
}

loadPosts();