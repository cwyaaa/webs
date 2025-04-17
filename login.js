
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyCcsz9Lg3KmgvD_SXUdy4V5x7aCQtSdI-s",
  authDomain: "webs-d0804.firebaseapp.com",
  projectId: "webs-d0804",
  storageBucket: "webs-d0804.firebasestorage.app",
  messagingSenderId: "195195304680",
  appId: "1:195195304680:web:01c68159689678c7f4275d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth();
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    document.getElementById("title").innerText = "欢迎回来：" + user.email;
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("signup-section").classList.add("hidden");
    document.getElementById("app").classList.remove("hidden");
  } else {
    document.getElementById("login-section").classList.remove("hidden");
    document.getElementById("signup-section").classList.add("hidden");
    document.getElementById("app").classList.add("hidden");
  }
});

window.login = async function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (error) {
    alert(error.message);
  }
}

window.signup = async function () {
  const email = document.getElementById("signup-email").value;
  const password = document.getElementById("signup-password").value;
  const confirmPassword = document.getElementById("confirm-password").value;
  if (password !== confirmPassword) {
    alert("密码不一致，请重新确认！");
    return;
  }
  try {
    await createUserWithEmailAndPassword(auth, email, password);
    alert("注册成功！");
    showLogin();
  } catch (error) {
    alert(error.message);
  }
}

window.logout = async function () {
  await signOut(auth);
}

window.showSignup = function () {
  document.getElementById("login-section").classList.add("hidden");
  document.getElementById("signup-section").classList.remove("hidden");
}

window.showLogin = function () {
  document.getElementById("signup-section").classList.add("hidden");
  document.getElementById("login-section").classList.remove("hidden");
}
