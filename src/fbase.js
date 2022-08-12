/*import { initializeApp } from "firebase/app";*/

import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
  appId: process.env.REACT_APP_APP_ID,
};

// firebase 연결
firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase; // Instance 모듈 auth 기능 호출

export const authService = firebase.auth(); // 설정 중 로그인 설정만 제공
export const dbService = firebase.firestore(); // Database 기능 호출
export const storageService = firebase.storage(); // 사진 첨부용 Storage 기능 호출
