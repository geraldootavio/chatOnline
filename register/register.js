import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, updateProfile } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC9bE3oqC81j9dgtkbeeyOh8EysCvs1lOE",
  authDomain: "chat-geraldo.firebaseapp.com",
  projectId: "chat-geraldo",
  storageBucket: "chat-geraldo.appspot.com",
  messagingSenderId: "327620141075",
  appId: "1:327620141075:web:57bb6d6b337e96efce9fe6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const registerBtn = document.getElementById("registerBtn");
const emailInput = document.getElementById("emailInput");
const passwordInput = document.getElementById("passwordInput");
const usernameInput = document.getElementById("usernameInput");

registerBtn.addEventListener("click", async () => {
    const email = emailInput.value.trim();
    const password = passwordInput.value.trim();
    const username = usernameInput.value.trim();

    if (!email || !password || !username) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        // Cria a conta
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Salva o displayName no Firebase
        await updateProfile(user, { displayName: username });

        // Salva o username no localStorage para o chat
        localStorage.setItem("username", username);

        // Redireciona direto para o chat
        window.location.href = "chatonline.html";

    } catch (error) {
        alert("Erro ao registrar: " + error.message);
        console.error(error);
    }
});
