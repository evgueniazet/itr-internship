import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import {
  getFirestore,
  query,
  getDocs,
  collection,
  where,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBNGD4tJKPgWU8L49TDetJG__lt-9PhNyI",
    authDomain: "itransition-4task.firebaseapp.com",
    projectId: "itransition-4task",
    storageBucket: "itransition-4task.appspot.com",
    messagingSenderId: "854555996653",
    appId: "1:854555996653:web:5f44d7836c3bec430eb7e4",
    measurementId: "G-J2ZPD93499"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();

const checkUserStatus = async (userId) => {
  try {
    const userDoc = await db.collection("users").doc(userId).get();

    if (userDoc.exists && userDoc.data().status) {
      return userDoc.data().status;
    } else {
      return "active";
    }
  } catch (error) {
    console.error("Error checking user status:", error);
    return "active";
  }
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    const userStatus = await checkUserStatus(user.uid);
    if (userStatus === "blocked") {
      throw new Error("Your account is blocked. Please contact support.");
    } else {
      await updateDoc(doc(db, "users", user.uid), {
        lastLoginDate: new Date(),
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const registerWithEmailAndPassword = async (name, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    const registrationDate = new Date();
    await addDoc(collection(db, "users"), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
      registrationDate,
      lastLoginDate: registrationDate,
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  signOut(auth);
};

const clearUsers = async () => {
  try {
    const usersCollectionRef = collection(db, "users");
    const querySnapshot = await getDocs(usersCollectionRef);

    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });

    console.info("User list cleared.");
  } catch (error) {
    console.error("Error clearing user list:", error);
  }
};

const blockUser = async (userId) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      status: "blocked",
    });
    console.info("User successfully blocked.");
  } catch (error) {
    console.error("Error blocking user:", error);
  }
};

const deleteUser = async (userId) => {
  try {
    await deleteDoc(doc(db, "users", userId));
    console.info("User successfully deleted.");
  } catch (error) {
    console.error("Error deleting user:", error);
  }
};

const getUsers = async () => {
  const usersCollectionRef = collection(db, "users");
  const querySnapshot = await getDocs(usersCollectionRef);
  const users = [];
  querySnapshot.forEach((doc) => {
    users.push({ id: doc.id, ...doc.data() });
  });
  return users;
};

const unblockUser = async (userId) => {
  try {
    await updateDoc(doc(db, "users", userId), {
      status: "active",
    });
    console.info("User successfully unblocked.");
  } catch (error) {
    console.error("Error unblocking user:", error);
  }
};

export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getUsers,
  clearUsers,
  blockUser,
  deleteUser,
  unblockUser,
  checkUserStatus,
};
