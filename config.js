// config.js

// Firebase 配置
const firebaseConfig = {
  apiKey: "AIzaSyCcsz9Lg3KmgvD_SXUdy4V5x7aCQtSdI-s",
  authDomain: "webs-d0804.firebaseapp.com",
  projectId: "webs-d0804",
  storageBucket: "webs-d0804.appspot.com",
  messagingSenderId: "195195304680",
  appId: "1:195195304680:web:01c68159689678c7f4275d",
  measurementId: "G-RRQ7RFHV76"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 获取 Firebase 服务
const auth = firebase.auth();
const db = firebase.firestore();

// 暴露给全局
window.firebase = firebase;
window.auth = auth;
window.db = db;
