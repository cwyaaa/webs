import "./config.js";

auth.onAuthStateChanged(user => {
  if (!user) {
    location.href = "index.html";
  } else {
    document.getElementById("title").innerText = `欢迎，${user.email}`;
    loadBookmarks(user.uid);
  }
});

function logout() {
  auth.signOut().then(() => location.href = "index.html");
}

function addBookmark() {
  const user = auth.currentUser;
  if (!user) return;

  const title = document.getElementById("bookmark-title").value;
  const url = document.getElementById("bookmark-url").value;
  const category = document.getElementById("bookmark-category").value;

  if (!title || !url) return alert("请输入标题和链接");

  db.collection("bookmarks").add({
    uid: user.uid,
    title,
    url,
    category,
    favorite: false,
    created: firebase.firestore.FieldValue.serverTimestamp()
  }).then(() => loadBookmarks(user.uid));
}

function toggleFavorite(id, newStatus) {
  db.collection("bookmarks").doc(id).update({ favorite: newStatus })
    .then(() => loadBookmarks(auth.currentUser.uid));
}

function loadBookmarks(uid) {
  db.collection("bookmarks")
    .where("uid", "==", uid)
    .orderBy("created", "desc")
    .get()
    .then(snapshot => {
      const container = document.getElementById("bookmarks");
      const favoriteContainer = document.getElementById("favorite-bookmarks");
      container.innerHTML = "";
      favoriteContainer.innerHTML = "";

      snapshot.forEach(doc => {
        const data = doc.data();
        const el = document.createElement("div");
        el.className = "bookmark";
        el.innerHTML = `
          <div>
            <div class="bookmark-title">${data.title}</div>
            <a class="bookmark-url" href="${data.url}" target="_blank">${data.url}</a>
          </div>
          <div>
            <button onclick="toggleFavorite('${doc.id}', ${!data.favorite})" class="favorite-button">
              ${data.favorite ? "取消心标" : "加为心标"}
            </button>
          </div>
        `;
        container.appendChild(el);
        if (data.favorite) {
          const clone = el.cloneNode(true);
          favoriteContainer.appendChild(clone);
        }
      });
    });
}

window.logout = logout;
window.addBookmark = addBookmark;
window.toggleFavorite = toggleFavorite;
