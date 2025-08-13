import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

// Configuração Firebase
const firebaseConfig = {
  apiKey: "AIzaSyC9bE3oqC81j9dgtkbeeyOh8EysCvs1lOE",
  authDomain: "chat-geraldo.firebaseapp.com",
  projectId: "chat-geraldo",
  storageBucket: "chat-geraldo.appspot.com",
  messagingSenderId: "327620141075",
  appId: "1:327620141075:web:57bb6d6b337e96efce9fe6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
const avatars = {}; // armazena avatares dos usuários

const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Faça login primeiro.");
    window.location.href = "login.html";
  } else {
    currentUser = user;
    document.querySelector(".container").style.display = "block";
    avatars[user.displayName] = user.photoURL || "default-avatar.png";
  }
});

function addMessage(senderName, messageText, senderClass) {
  const msg = document.createElement("div");
  msg.classList.add("message", senderClass);

  const avatarImg = document.createElement("img");
  avatarImg.src = avatars[senderName] || "default-avatar.png";
  avatarImg.alt = senderName;
  avatarImg.classList.add("message-avatar");

  const contentDiv = document.createElement("div");
  contentDiv.classList.add("message-content");

  const nameSpan = document.createElement("strong");
  nameSpan.textContent = senderName + ": ";
  contentDiv.appendChild(nameSpan);
  contentDiv.appendChild(document.createTextNode(messageText));

  msg.appendChild(avatarImg);
  msg.appendChild(contentDiv);

  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

const q = query(collection(db, "messages"), orderBy("timestamp"));
onSnapshot(q, snapshot => {
  chatBox.innerHTML = "";
  snapshot.forEach(doc => {
    const data = doc.data();
    if (!avatars[data.username]) avatars[data.username] = data.photoURL || "default-avatar.png";
    if (data.username === currentUser.displayName) {
      addMessage("Você", data.text, "user");
    } else {
      addMessage(data.username, data.text, "bot");
    }
  });
});

sendBtn.addEventListener("click", async () => {
  const text = userInput.value.trim();
  if (!text) return;
  try {
    await addDoc(collection(db, "messages"), {
      username: currentUser.displayName,
      text,
      photoURL: currentUser.photoURL || "default-avatar.png",
      timestamp: serverTimestamp()
    });
    userInput.value = "";
  } catch (err) {
    console.error(err);
  }
});

userInput.addEventListener("keypress", e => {
  if (e.key === "Enter") sendBtn.click();
});
