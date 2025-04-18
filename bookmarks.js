import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-auth.js";
import { getFirestore, collection, addDoc, query, where, onSnapshot, updateDoc, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/9.6.11/firebase-firestore.js";
import { firebaseConfig } from "./config.js";

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
let currentUser = null;

onAuthStateChanged(auth, (user) => {
  if (user) {
    currentUser = user;
    document.getElementById("title").innerText = "欢迎回来：" + user.email;
    loadBookmarks();
  } else {
    window.location.href = "index.html";
  }
});

window.logout = async function () {
  await signOut(auth);
};

window.addBookmark = async function () {
  const title = document.getElementById("bookmark-title").value;
  const url = document.getElementById("bookmark-url").value;
  const category = document.getElementById("bookmark-category").value;
  const date = new Date().toLocaleString();

  if (!url.startsWith("http")) {
    alert("请输入合法网址");
    return;
  }

  await addDoc(collection(db, "bookmarks"), {
    uid: currentUser.uid,
    title,
    url,
    category,
    date
  });

  document.getElementById("bookmark-title").value = "";
  document.getElementById("bookmark-url").value = "";
};

window.searchBookmarks = function () {
  const input = document.getElementById("search").value.toLowerCase();
  const bookmarks = document.querySelectorAll(".bookmark");
  bookmarks.forEach(el => {
    const text = el.textContent.toLowerCase();
    el.style.display = text.includes(input) ? "" : "none";
  });
};

function loadBookmarks() {
  const q = query(collection(db, "bookmarks"), where("uid", "==", currentUser.uid));
  onSnapshot(q, (snapshot) => {
    const container = document.getElementById("bookmarks");
    container.innerHTML = "";
    const grouped = {};
    snapshot.forEach(docSnap => {
      const data = docSnap.data();
      const id = docSnap.id;
      if (!grouped[data.category]) grouped[data.category] = [];
      grouped[data.category].push({ ...data, id });
    });

    for (const [cat, items] of Object.entries(grouped)) {
      const catEl = document.createElement("div");
      catEl.innerHTML = `<div class="category">${cat}</div>`;
      items.forEach(b => {
        const div = document.createElement("div");
        div.className = "bookmark";
        div.innerHTML = `
          <a href="${b.url}" target="_blank">${b.title}</a><br>
          <small>${b.date}</small><br>
          <button onclick="deleteBookmark('${b.id}')">删除</button>
        `;
        catEl.appendChild(div);
      });
      container.appendChild(catEl);
    }
  });
}

window.deleteBookmark = async function (id) {
  await deleteDoc(doc(db, "bookmarks", id));
};
