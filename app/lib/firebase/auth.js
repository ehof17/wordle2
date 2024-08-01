export function onAuthStateChanged(cb) {
    return _onAuthStateChanged(auth, cb);
}

export async function signInWithGoogle() {
const provider = new GoogleAuthProvider();

try {
await signInWithPopup(auth, provider);
} catch (error) {
console.error("Error signing in with Google", error);
}
}

export async function signOut() {
try {
return auth.signOut();
} catch (error) {
console.error("Error signing out with Google", error);
}
}

async function fetchWithFirebaseHeaders(request) {
    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);
    const installations = getInstallations(app);
    const headers = new Headers(request.headers);
    const [authIdToken, installationToken] = await Promise.all([
      getAuthIdToken(auth),
      getToken(installations),
    ]);
    headers.append("Firebase-Instance-ID-Token", installationToken);
    if (authIdToken) headers.append("Authorization", `Bearer ${authIdToken}`);
    const newRequest = new Request(request, { headers });
    return await fetch(newRequest);
  }
  
  async function getAuthIdToken(auth) {
    await auth.authStateReady();
    if (!auth.currentUser) return;
    return await getIdToken(auth.currentUser);
  }

  export async function getAuthenticatedAppForUser() {
    const idToken = headers().get("Authorization")?.split("Bearer ")[1];
    console.log('firebaseConfig', JSON.stringify(firebaseConfig));
    const firebaseServerApp = initializeServerApp(
      firebaseConfig,
      idToken
        ? {
            authIdToken: idToken,
          }
        : {}
    );
  
    const auth = getAuth(firebaseServerApp);
    await auth.authStateReady();
  
    return { firebaseServerApp, currentUser: auth.currentUser };
  }