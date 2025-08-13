// 🔹 Importante: este script deve ser importado como module no HTML:
// <script type="module" src="script.js"></script>

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// 🔹 Coloque sua configuração do Firebase aqui
const firebaseConfig = {
  apiKey: "AIzaSyC9bE3oqC81j9dgtkbeeyOh8EysCvs1lOE",
  authDomain: "chat-geraldo.firebaseapp.com",
  projectId: "chat-geraldo",
  storageBucket: "chat-geraldo.appspot.com",
  messagingSenderId: "327620141075",
  appId: "1:327620141075:web:57bb6d6b337e96efce9fe6"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Recupera username da URL
function getUsernameFromURL() {
  const params = new URLSearchParams(window.location.search);
  return params.get('username') || '';
}

const username = getUsernameFromURL();
if (!username) {
  alert("Nome de usuário não fornecido. Voltando para página inicial.");
  window.location.href = "index.html";
} else {
  document.querySelector(".container").style.display = "block";
}

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// Função para adicionar mensagens no chat
function addMessage(senderName, messageText, senderClass) {
  const msg = document.createElement("div");
  msg.classList.add("message", senderClass);

  const nameSpan = document.createElement("strong");
  nameSpan.textContent = senderName + ": ";
  msg.appendChild(nameSpan);

  msg.appendChild(document.createTextNode(messageText));

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Função para mensagens do sistema
function addSystemMessage(text) {
  const msg = document.createElement("div");
  msg.classList.add("system-message");
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// 🔹 Receber mensagens em tempo real do Firestore
const q = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(q, (snapshot) => {
  chatBox.innerHTML = ""; // limpa o chat
  snapshot.forEach((doc) => {
    const data = doc.data();
    if (data.username === username) {
      addMessage("Você", data.text, "user");
    } else {
      addMessage(data.username, data.text, "bot");
    }
  });
});

// 🔹 Enviar mensagem
sendBtn.addEventListener("click", async () => {
  const message = userInput.value.trim();
  if (!message) return;

  try {
    await addDoc(collection(db, "messages"), {
      username,
      text: message,
      timestamp: serverTimestamp()
    });
    userInput.value = "";
  } catch (err) {
    addSystemMessage("Erro ao enviar a mensagem.");
    console.error(err);
  }
});

userInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") sendBtn.click();
});
