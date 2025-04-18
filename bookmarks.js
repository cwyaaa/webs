// bookmarks.js

// 确保 Firebase 已经加载并初始化
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("已登录用户：", user.uid);
    loadBookmarks(user.uid);
  } else {
    console.log("未登录");
  }
});

// 添加书签
function addBookmark() {
  const title = document.getElementById('bookmark-title').value;
  const url = document.getElementById('bookmark-url').value;
  const category = document.getElementById('bookmark-category').value;
  
  if (title && url) {
    const userId = firebase.auth().currentUser.uid;

    db.collection('bookmarks').doc(userId).collection('items').add({
      title,
      url,
      category,
      favorite: false, // 默认不为收藏
    }).then(() => {
      console.log("书签已添加");
      loadBookmarks(userId); // 更新显示的书签
    }).catch(error => {
      console.error("添加书签失败", error);
    });
  } else {
    alert("请填写完整书签信息！");
  }
}

// 加载书签
function loadBookmarks(userId) {
  db.collection('bookmarks').doc(userId).collection('items')
    .onSnapshot(snapshot => {
      const bookmarksContainer = document.getElementById('bookmarks');
      bookmarksContainer.innerHTML = ''; // 清空当前书签列表

      snapshot.forEach(doc => {
        const data = doc.data();
        const bookmarkElement = document.createElement('div');
        bookmarkElement.classList.add('bookmark');
        bookmarkElement.innerHTML = `
          <div class="bookmark-title">${data.title}</div>
          <div class="bookmark-url"><a href="${data.url}" target="_blank">${data.url}</a></div>
          <div class="category">${data.category}</div>
          <div class="count">${data.favorite ? "已收藏" : "未收藏"}</div>
          <button onclick="toggleFavorite('${doc.id}', ${data.favorite})" class="favorite-button">
            ${data.favorite ? "取消收藏" : "收藏"}
          </button>
          <button onclick="deleteBookmark('${doc.id}')" class="delete-button">删除</button>
        `;
        bookmarksContainer.appendChild(bookmarkElement);
      });
    });
}

// 切换收藏状态
function toggleFavorite(bookmarkId, currentStatus) {
  const userId = firebase.auth().currentUser.uid;
  db.collection('bookmarks').doc(userId).collection('items').doc(bookmarkId)
    .update({
      favorite: !currentStatus
    }).then(() => {
      console.log("收藏状态已更新");
    }).catch(error => {
      console.error("更新收藏状态失败", error);
    });
}

// 删除书签
function deleteBookmark(bookmarkId) {
  const userId = firebase.auth().currentUser.uid;
  db.collection('bookmarks').doc(userId).collection('items').doc(bookmarkId)
    .delete().then(() => {
      console.log("书签已删除");
    }).catch(error => {
      console.error("删除书签失败", error);
    });
}

// 搜索书签
function searchBookmarks() {
  const searchTerm = document.getElementById('search').value.toLowerCase();
  const userId = firebase.auth().currentUser.uid;

  db.collection('bookmarks').doc(userId).collection('items')
    .where('title', '>=', searchTerm)
    .where('title', '<=', searchTerm + '\uf8ff')
    .onSnapshot(snapshot => {
      const bookmarksContainer = document.getElementById('bookmarks');
      bookmarksContainer.innerHTML = '';

      snapshot.forEach(doc => {
        const data = doc.data();
        const bookmarkElement = document.createElement('div');
        bookmarkElement.classList.add('bookmark');
        bookmarkElement.innerHTML = `
          <div class="bookmark-title">${data.title}</div>
          <div class="bookmark-url"><a href="${data.url}" target="_blank">${data.url}</a></div>
          <div class="category">${data.category}</div>
          <div class="count">${data.favorite ? "已收藏" : "未收藏"}</div>
        `;
        bookmarksContainer.appendChild(bookmarkElement);
      });
    });
}

// 退出登录
function logout() {
  firebase.auth().signOut().then(() => {
    console.log("已退出登录");
    window.location.href = 'index.html'; // 重定向到登录页
  }).catch(error => {
    console.error("退出登录失败", error);
  });
}
