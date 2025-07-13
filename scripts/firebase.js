import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-app.js";
import { getAuth, signInAnonymously } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/9.6.0/firebase-database.js";

const app = initializeApp(CONFIG.FIREBASE_CONFIG);
const auth = getAuth(app);
const db = getDatabase(app);

// Simple anonymous auth
signInAnonymously(auth)
  .then(() => console.log("Connected to Firebase"))
  .catch(error => console.error("Firebase auth error:", error));

// Helper function to save data
async function saveFarmData(userId, data) {
  await set(ref(db, 'users/' + userId), data);
}

// Helper function to load data
async function loadFarmData(userId) {
  const snapshot = await get(ref(db, 'users/' + userId));
  return snapshot.val();
}