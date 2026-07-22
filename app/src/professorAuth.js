import {
  isSignInWithEmailLink,
  onAuthStateChanged,
  signInWithEmailLink,
  sendSignInLinkToEmail,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';

const ALLOWED_DOMAIN = import.meta.env.VITE_ALLOWED_EMAIL_DOMAIN || 'tec.mx';
const PENDING_EMAIL_KEY = 'eaad-pending-signin-email';

export function isAllowedEmail(email) {
  return new RegExp(`@${ALLOWED_DOMAIN.replace('.', '\\.')}$`, 'i').test((email || '').trim());
}

export async function sendLoginLink(email) {
  const trimmed = (email || '').trim();
  if (!isAllowedEmail(trimmed)) {
    throw new Error(`Usa tu correo institucional (@${ALLOWED_DOMAIN}).`);
  }
  // Deliberately the plain origin, no hash fragment: Firebase appends its
  // sign-in params (?apiKey=...&oobCode=...) as a real query string, which
  // would land *inside* a HashRouter fragment (#/enviar?apiKey=...) and
  // never be seen as query params if we used the current hash-based URL.
  // App.jsx completes the sign-in at "/" and then routes to /enviar.
  await sendSignInLinkToEmail(auth, trimmed, {
    url: window.location.origin + '/',
    handleCodeInApp: true,
  });
  window.localStorage.setItem(PENDING_EMAIL_KEY, trimmed);
}

// Call once on app load: completes sign-in if the current URL is a magic
// link the user just clicked. Returns the signed-in user, or null if this
// load isn't a sign-in link.
export async function completeSignInFromLinkIfPresent() {
  if (!isSignInWithEmailLink(auth, window.location.href)) return null;

  let email = window.localStorage.getItem(PENDING_EMAIL_KEY);
  if (!email) {
    // Opened the link on a different device/browser than the one that
    // requested it — ask once instead of failing silently.
    email = window.prompt('Confirma tu correo institucional para continuar:');
  }
  if (!email || !isAllowedEmail(email)) {
    throw new Error(`Ese enlace es para un correo @${ALLOWED_DOMAIN}.`);
  }

  const result = await signInWithEmailLink(auth, email, window.location.href);
  window.localStorage.removeItem(PENDING_EMAIL_KEY);
  // Strip Firebase's ?apiKey=...&oobCode=... query string, keep the hash.
  window.history.replaceState({}, '', window.location.origin + window.location.pathname + window.location.hash);
  return result.user;
}

export function watchProfessorAuth(callback) {
  return onAuthStateChanged(auth, callback);
}

export function signOutProfessor() {
  return signOut(auth);
}
