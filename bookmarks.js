
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { app } from './config.js';

const auth = getAuth(app);

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "index.html";
  }
});

const bookmarks = [
  { name: "示例1", url: "https://example.com" },
  { name: "示例2", url: "https://example.org" },
  { name: "示例3", url: "https://example.net" }
];

const clickCounts = JSON.parse(localStorage.getItem("clickCounts") || "{}");

function recordClick(url) {
  clickCounts[url] = (clickCounts[url] || 0) + 1;
  localStorage.setItem("clickCounts", JSON.stringify(clickCounts));
  renderTopBookmarks();
}

function renderBookmarks() {
  const list = document.getElementById("bookmarkList");
  list.innerHTML = "";
  bookmarks.forEach(b => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = b.url;
    a.target = "_blank";
    a.textContent = b.name;
    a.onclick = () => recordClick(b.url);
    li.appendChild(a);
    list.appendChild(li);
  });
}

function renderTopBookmarks() {
  const sorted = [...bookmarks].sort((a, b) => (clickCounts[b.url] || 0) - (clickCounts[a.url] || 0));
  const topList = document.getElementById("topBookmarks");
  topList.innerHTML = "";
  sorted.slice(0, 5).forEach(b => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = b.url;
    a.target = "_blank";
    a.textContent = `${b.name} (${clickCounts[b.url] || 0})`;
    a.onclick = () => recordClick(b.url);
    li.appendChild(a);
    topList.appendChild(li);
  });
}

renderBookmarks();
renderTopBookmarks();
