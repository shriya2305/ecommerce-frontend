import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDyG9y4j-ofpjH2J648V_FqdlWbZ-bSobA",
  authDomain: "lilacstore-2305.firebaseapp.com",
  projectId: "lilacstore-2305",
  appId: "1:698524267252:web:a23fdcaa1b6a0a2d2aa4a1",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
