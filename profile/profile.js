import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, updateProfile, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

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
const auth = getAuth(app);
const storage = getStorage(app);

// DOM
const avatarImg = document.getElementById("avatar");
const nameInput = document.getElementById("nameInput");
const avatarInput = document.getElementById("avatarInput");
const saveBtn = document.getElementById("saveBtn");
const logoutBtn = document.getElementById("logoutBtn");

onAuthStateChanged(auth, user => {
  if (!user) {
    alert("Faça login primeiro.");
    window.location.href = "login.html";
  } else {
    nameInput.value = user.displayName || "";
    avatarImg.src = user.photoURL || "default-avatar.png";
  }
});

saveBtn.addEventListener("click", async () => {
  const user = auth.currentUser;
  if (!user) return;

  try {
    let photoURL = user.photoURL;

    if (avatarInput.files.length > 0) {
      const file = avatarInput.files[0];
      const storageRef = ref(storage, `avatars/${user.uid}/${file.name}`);
      await uploadBytes(storageRef, file);
      photoURL = await getDownloadURL(storageRef);
    }

    await updateProfile(user, {
      displayName: nameInput.value.trim(),
      photoURL
    });

    alert("Perfil atualizado com sucesso!");
    avatarImg.src = photoURL;
  } catch (err) {
    console.error(err);
    alert("Erro ao atualizar perfil: " + err.message);
  }
});

logoutBtn.addEventListener("click", async () => {
  await signOut(auth);
  localStorage.removeItem("username");
  window.location.href = "login.html";
});
