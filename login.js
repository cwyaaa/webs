import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

window.signup = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("注册成功！");
  } catch (error) {
    alert(error.message);
  }
};

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(error.message);
  }
};

onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "bookmarks.html";
  }
});
