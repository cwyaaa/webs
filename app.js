// app.js
import { firebaseConfig } from './config.js';
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 登录函数
window.login = function () {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then(() => alert("登录成功"))
    .catch((error) => alert("登录失败：" + error.message));
};

// 登出函数
window.logout = function () {
  signOut(auth).then(() => alert("已退出登录"));
};

// 监听登录状态
onAuthStateChanged(auth, (user) => {
  if (user) {
    document.getElementById("user-info").textContent = `已登录：${user.email}`;
  } else {
    document.getElementById("user-info").textContent = `未登录`;
  }
});
