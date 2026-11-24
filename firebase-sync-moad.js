/* =========================================================
   firebase-sync-moad.js
   مزامنة سحابية اختيارية لتطبيق «مواد شرعية»

   - نفس مشروع Firebase المستخدم في «منهجي في طلب العلم» و«مصحف التدبر»
     (نفس الحساب يشتغل في كل المواقع)
   - البيانات منفصلة في مجموعة خاصة: moad_users/{uid}
   - الدخول اختياري: التطبيق شغال محليًا من غيره، والدخول بيضيف المزامنة
   - الواجهة: window.MoadCloud
   ========================================================= */

import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth, onAuthStateChanged, signInWithEmailAndPassword,
  createUserWithEmailAndPassword, signOut
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyD8jxpVrvicStETloL8tk5s865dmNatIqE",
  authDomain: "mazen-productivity-bab1c.firebaseapp.com",
  projectId: "mazen-productivity-bab1c",
  storageBucket: "mazen-productivity-bab1c.firebasestorage.app",
  messagingSenderId: "388570583199",
  appId: "1:388570583199:web:34af7ba9a1b050f12252aa",
  measurementId: "G-WYD2VE2JJQ"
};

const COLLECTION = "moad_users";

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

let _resolveReady;
const ready = new Promise((r) => { _resolveReady = r; });
let _firstAuth = true;
let _pending = null;
let _timer = null;

function emit(name, detail) {
  window.dispatchEvent(new CustomEvent(name, { detail }));
}

function status(state, message) {
  window.MoadCloud.status = state;
  emit("moad-cloud-status", { state, message: message || "" });
}

async function load() {
  const user = auth.currentUser;
  if (!user) return null;
  try {
    const snap = await getDoc(doc(db, COLLECTION, user.uid));
    status("ok");
    return snap.exists() ? snap.data() : null;
  } catch (e) {
    status("error", friendlyError(e.code));
    throw e;
  }
}

// حفظ مؤجَّل: يجمع التعديلات المتتالية في كتابة واحدة
function save(stateObj, ts) {
  if (!auth.currentUser) return;
  _pending = { state: stateObj, ts: ts || Date.now() };
  status("saving");
  clearTimeout(_timer);
  _timer = setTimeout(flush, 1200);
}

async function flush() {
  const user = auth.currentUser;
  if (!user || !_pending) return;
  const data = _pending;
  _pending = null;
  try {
    await setDoc(doc(db, COLLECTION, user.uid), data);
    status("ok");
  } catch (e) {
    status("error", friendlyError(e.code));
  }
}

window.addEventListener("beforeunload", () => { if (_pending) flush(); });
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden" && _pending) flush();
});

async function doSignIn(email, password) {
  try { await signInWithEmailAndPassword(auth, email, password); }
  catch (e) { throw new Error(friendlyError(e.code)); }
}

async function doSignUp(email, password) {
  try { await createUserWithEmailAndPassword(auth, email, password); }
  catch (e) { throw new Error(friendlyError(e.code)); }
}

async function doSignOut() {
  if (_pending) await flush();
  await signOut(auth);
}

function friendlyError(code) {
  const map = {
    "auth/invalid-email": "البريد الإلكتروني غير صحيح",
    "auth/user-not-found": "مفيش حساب بالبريد ده",
    "auth/wrong-password": "كلمة المرور غلط",
    "auth/invalid-credential": "البريد أو كلمة المرور غلط",
    "auth/email-already-in-use": "البريد ده مسجّل قبل كده، اختار «دخول»",
    "auth/weak-password": "كلمة المرور لازم تكون 6 حروف على الأقل",
    "auth/too-many-requests": "محاولات كتير، استنى شوية وجرب تاني",
    "auth/network-request-failed": "مفيش اتصال بالإنترنت",
    "permission-denied": "قواعد Firestore مش سامحة بمجموعة moad_users (راجع README)",
    "unavailable": "السيرفر مش متاح دلوقتي، هتتحفظ محليًا"
  };
  return map[code] || ("حصل خطأ: " + (code || "غير معروف"));
}

window.MoadCloud = {
  ready, user: null, status: "off",
  load, save, signIn: doSignIn, signUp: doSignUp, signOut: doSignOut
};

onAuthStateChanged(auth, (user) => {
  window.MoadCloud.user = user || null;
  status(user ? "ok" : "off");
  emit("moad-auth", { user: user || null });
  if (_firstAuth) { _firstAuth = false; _resolveReady(user || null); }
});

emit("moad-cloud-loaded", {});
