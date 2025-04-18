const user = firebase.auth().currentUser;

// 确保用户已登录
if (!user) {
  window.location.href = 'index.html';  // 如果没有登录，跳转到登录页面
}

// 退出登录
function logout() {
  auth.signOut().then(() => {
    window.location.href = 'index.html';
  });
}

// 添加书签
function addBookmark() {
  const title = document.getElementById("bookmark-title").value;
  const url = document.getElementById("bookmark-url").value;
  const category = document.getElementById("bookmark-category").value;

  if (title && url) {
    db.collection("bookmarks").add({
      userId: user.uid,
      title: title,
      url: url,
      category: category,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }).then(() => {
      loadBookmarks();  // 更新书签列表
    }).catch(error => {
      console.error(error.message);
    });
  }
}

// 加载用户的书签
function loadBookmarks() {
  const bookmarksRef = db.collection("bookmarks").where("userId", "==", user.uid);
  
  bookmarksRef.get().then(querySnapshot => {
    const bookmarksContainer = document.getElementById("bookmarks");
    bookmarksContainer.innerHTML = '';  // 清空现有书签

    querySnapshot.forEach(doc => {
      const bookmark = doc.data();
      const bookmarkElement = document.createElement("div");
      bookmarkElement.classList.add("bookmark");
      
      bookmarkElement.innerHTML = `
        <div>
          <h4 class="bookmark-title">${bookmark.title}</h4>
          <a href="${bookmark.url}" class="bookmark-url" target="_blank">${bookmark.url}</a>
        </div>
        <div>
          <button onclick="deleteBookmark('${doc.id}')">删除</button>
        </div>
      `;
      
      bookmarksContainer.appendChild(bookmarkElement);
    });
  });
}

// 删除书签
function deleteBookmark(bookmarkId) {
  db.collection("bookmarks").doc(bookmarkId).delete()
    .then(() => {
      loadBookmarks();  // 更新书签列表
    }).catch(error => {
      console.error(error.message);
    });
}

// 搜索书签
function searchBookmarks() {
  const query = document.getElementById("search").value.toLowerCase();
  
  const bookmarksRef = db.collection("bookmarks").where("userId", "==", user.uid);
  
  bookmarksRef.get().then(querySnapshot => {
    const bookmarksContainer = document.getElementById("bookmarks");
    bookmarksContainer.innerHTML = '';  // 清空现有书签

    querySnapshot.forEach(doc => {
      const bookmark = doc.data();
      if (bookmark.title.toLowerCase().includes(query) || bookmark.url.toLowerCase().includes(query)) {
        const bookmarkElement = document.createElement("div");
        bookmarkElement.classList.add("bookmark");

        bookmarkElement.innerHTML = `
          <div>
            <h4 class="bookmark-title">${bookmark.title}</h4>
            <a href="${bookmark.url}" class="bookmark-url" target="_blank">${bookmark.url}</a>
          </div>
          <div>
            <button onclick="deleteBookmark('${doc.id}')">删除</button>
          </div>
        `;
        
        bookmarksContainer.appendChild(bookmarkElement);
      }
    });
  });
}

// 加载用户书签
loadBookmarks();
