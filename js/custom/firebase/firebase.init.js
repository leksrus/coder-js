// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBFLmN0nu3_lRIiZdyTXItCF5SpZm_IFbE",
  authDomain: "tech-market-bad6f.firebaseapp.com",
  projectId: "tech-market-bad6f",
  storageBucket: "tech-market-bad6f.appspot.com",
  messagingSenderId: "298042791231",
  appId: "1:298042791231:web:6489e41392983a8f79af8a",
  measurementId: "G-V186TXRKVV",
};

// Initialize Cloud Firestore through Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
