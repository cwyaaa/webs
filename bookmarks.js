import { firebase } from './config.js';

// 获取 DOM 元素
const titleInput = document.getElementById('bookmark-title');
const urlInput = document.getElementById('bookmark-url');
const categorySelect = document.getElementById('bookmark-category');
const bookmarksContainer = document.getElementById('bookmarks');
const searchInput = document.getElementById('search');
const favoriteContainer = document.getElementById('favorite-bookmarks');
const logoutButton = document.querySelector('button');

// 登录和退出功能
auth.onAuthStateChanged(user => {
  if (user) {
    document.getElementById('title').textContent = `欢迎, ${user.displayName}`;
    displayBookmarks(user);
  } else {
    document.getElementById('title').textContent = '请登录';
    window.location.href = 'login.html';  // 登录页面
  }
});

// 用户退出
logoutButton.addEventListener('click', () => {
  auth.signOut();
});

// 添加书签
async function addBookmark() {
  const title = titleInput.value;
  const url = urlInput.value;
  const category = categorySelect.value;

  if (title && url) {
    const user = auth.currentUser;
    const bookmark = {
      title,
      url,
      category,
      favorite: false,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };
    
    // 添加到 Firestore
    await db.collection('bookmarks').add({
      ...bookmark,
      userId: user.uid
    });

    // 清空输入框
    titleInput.value = '';
    urlInput.value = '';
    categorySelect.value = '学习';

    // 刷新书签列表
    displayBookmarks(user);
  }
}

// 显示书签
async function displayBookmarks(user) {
  const bookmarksSnapshot = await db.collection('bookmarks')
    .where('userId', '==', user.uid)
    .orderBy('timestamp', 'desc')
    .get();
  
  bookmarksContainer.innerHTML = '';  // 清空书签容器
  const favoriteBookmarks = [];

  bookmarksSnapshot.forEach(doc => {
    const data = doc.data();
    const bookmarkDiv = document.createElement('div');
    bookmarkDiv.className = 'bookmark';
    
    // 判断是否是收藏
    const favoriteButton = document.createElement('button');
    favoriteButton.className = 'favorite-button';
    favoriteButton.textContent = data.favorite ? '已收藏' : '收藏';
    favoriteButton.onclick = () => toggleFavorite(doc.id, data.favorite);

    bookmarkDiv.innerHTML = `
      <div class="bookmark-title">${data.title}</div>
      <div class="bookmark-url"><a href="${data.url}" target="_blank">${data.url}</a></div>
      <div class="category">${data.category}</div>
      <div class="count">添加时间: ${new Date(data.timestamp.seconds * 1000).toLocaleString()}</div>
    `;
    
    bookmarkDiv.appendChild(favoriteButton);
    bookmarksContainer.appendChild(bookmarkDiv);

    // 添加到收藏夹
    if (data.favorite) {
      const favoriteDiv = document.createElement('div');
      favoriteDiv.textContent = `${data.title} - ${data.url}`;
      favoriteBookmarks.push(favoriteDiv);
    }
  });

  favoriteContainer.innerHTML = '';  // 清空收藏夹容器
  favoriteBookmarks.forEach(fav => favoriteContainer.appendChild(fav));
}

// 收藏/取消收藏
async function toggleFavorite(bookmarkId, currentFavoriteStatus) {
  const user = auth.currentUser;
  const bookmarkRef = db.collection('bookmarks').doc(bookmarkId);
  await bookmarkRef.update({
    favorite: !currentFavoriteStatus
  });

  // 刷新书签列表
  displayBookmarks(user);
}

// 搜索书签
function searchBookmarks() {
  const searchText = searchInput.value.toLowerCase();
  const bookmarks = document.querySelectorAll('.bookmark');

  bookmarks.forEach(bookmark => {
    const title = bookmark.querySelector('.bookmark-title').textContent.toLowerCase();
    const url = bookmark.querySelector('.bookmark-url').textContent.toLowerCase();

    if (title.includes(searchText) || url.includes(searchText)) {
      bookmark.style.display = 'block';
    } else {
      bookmark.style.display = 'none';
    }
  });
}
