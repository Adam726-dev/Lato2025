
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  updateProfile,
  User 
} from "firebase/auth";
import { 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  collection, 
  getDocs, 
  query, 
  orderBy, 
  serverTimestamp,
  increment 
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { UserProfile } from "@/types/userProfile";

export interface FirebaseUser {
  uid: string;
  email: string;
  displayName: string;
  profile: UserProfile;
  createdAt: any;
  lastLoginAt: any;
  isAdmin?: boolean;
}

export const signUpUser = async (email: string, password: string, name: string) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await updateProfile(userCredential.user, { displayName: name });
  
  await setDoc(doc(db, "users", userCredential.user.uid), {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: name,
    profile: {},
    createdAt: serverTimestamp(),
    lastLoginAt: serverTimestamp(),
    isAdmin: false
  });

  await updateStats();
  
  return userCredential.user;
};

export const signInUser = async (email: string, password: string) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  
  await updateDoc(doc(db, "users", userCredential.user.uid), {
    lastLoginAt: serverTimestamp()
  });
  
  return userCredential.user;
};

export const signOutUser = async () => {
  await signOut(auth);
};

export const saveUserProfile = async (userId: string, profile: UserProfile) => {
  await updateDoc(doc(db, "users", userId), {
    profile: profile,
    updatedAt: serverTimestamp()
  });
};

export const getUserProfile = async (userId: string): Promise<FirebaseUser | null> => {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return docSnap.data() as FirebaseUser;
  }
  return null;
};

export const updateStats = async () => {
  const statsRef = doc(db, "stats", "general");
  await updateDoc(statsRef, {
    totalUsers: increment(1),
    lastUpdated: serverTimestamp()
  }).catch(async () => {
    await setDoc(statsRef, {
      totalUsers: 1,
      totalLogins: 0,
      totalProfiles: 0,
      lastUpdated: serverTimestamp()
    });
  });
};

export const getStats = async () => {
  const statsRef = doc(db, "stats", "general");
  const statsSnap = await getDoc(statsRef);
  return statsSnap.exists() ? statsSnap.data() : null;
};

export const getAllUsers = async (): Promise<FirebaseUser[]> => {
  const usersRef = collection(db, "users");
  const q = query(usersRef, orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  
  return snapshot.docs.map(doc => doc.data() as FirebaseUser);
};
