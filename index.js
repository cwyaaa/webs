// 登录函数
function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      window.location.href = 'bookmarks.html';  // 登录成功跳转到收藏夹页面
    })
    .catch(error => {
      console.error(error.message);
    });
}

// 注册函数
function register() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      window.location.href = 'bookmarks.html';  // 注册成功跳转到收藏夹页面
    })
    .catch(error => {
      console.error(error.message);
    });
}
