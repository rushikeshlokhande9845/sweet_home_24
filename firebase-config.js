// Firebase configuration for SweetHome Delights
// 
// To use Firebase for real-time functionality:
// 1. Create a Firebase project at https://console.firebase.google.com/
// 2. Enable Realtime Database
// 3. Copy your project configuration and replace the placeholder values below
//
// If you don't want to use Firebase, the system will automatically fall back
// to localStorage for data persistence.

const firebaseConfig = {
  // Replace these values with your actual Firebase project config
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT_ID-default-rtdb.firebaseio.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase (only if config values are provided)
let firebaseInitialized = false;
try {
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "YOUR_API_KEY") {
    firebase.initializeApp(firebaseConfig);
    firebaseInitialized = true;
    console.log("Firebase initialized successfully");
  } else {
    console.log("Firebase config not provided, using localStorage fallback");
  }
} catch (error) {
  console.log("Firebase initialization failed, using localStorage fallback", error);
}

// Get references to Firebase services (if initialized)
let chatRef, ordersRef;
if (firebaseInitialized) {
  try {
    const database = firebase.database();
    chatRef = database.ref('chats');
    ordersRef = database.ref('orders');
    console.log("Firebase database references created");
  } catch (error) {
    console.log("Failed to create Firebase database references", error);
    firebaseInitialized = false;
  }
}

// Export for use in other files
window.firebaseInitialized = firebaseInitialized;
window.chatRef = chatRef;
window.ordersRef = ordersRef;