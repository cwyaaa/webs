// config.js
const firebaseConfig = {
  apiKey: "AIzaSyCcsz9Lg3KmgvD_SXUdy4V5x7aCQtSdI-s",
  authDomain: "webs-d0804.firebaseapp.com",
  projectId: "webs-d0804",
  storageBucket: "webs-d0804.firebasestorage.app",
  messagingSenderId: "195195304680",
  appId: "1:195195304680:web:01c68159689678c7f4275d",
  measurementId: "G-RRQ7RFHV76"
};

// 初始化 Firebase
firebase.initializeApp(firebaseConfig);

// 初始化 Firestore 和 Auth
const db = firebase.firestore();
const auth = firebase.auth();
