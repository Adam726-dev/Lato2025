
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { signInUser, signUpUser, signOutUser, getUserProfile, saveUserProfile, FirebaseUser } from '@/services/firebaseService';
import { UserProfile } from '@/types/userProfile';

interface AuthContextType {
  user: FirebaseUser | null;
  firebaseUser: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (profile: UserProfile) => Promise<void>;
  isLoggedIn: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userProfile = await getUserProfile(firebaseUser.uid);
        if (userProfile) {
          setUser(userProfile);
        } else {
          const basicUser: FirebaseUser = {
            uid: firebaseUser.uid,
            email: firebaseUser.email || '',
            displayName: firebaseUser.displayName || '',
            profile: {},
            createdAt: null,
            lastLoginAt: null,
            isAdmin: false
          };
          setUser(basicUser);
        }
        setFirebaseUser(firebaseUser);
      } else {
        setUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const firebaseUser = await signInUser(email, password);
      const userProfile = await getUserProfile(firebaseUser.uid);
      if (userProfile) {
        setUser(userProfile);
      }
      console.log('User logged in:', email);
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    setLoading(true);
    try {
      const firebaseUser = await signUpUser(email, password, name);
      const userProfile = await getUserProfile(firebaseUser.uid);
      if (userProfile) {
        setUser(userProfile);
      }
      console.log('User signed up:', email, name);
    } catch (error) {
      console.error('Signup error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await signOutUser();
      setUser(null);
      setFirebaseUser(null);
      localStorage.removeItem('summer-plan-choices');
      localStorage.removeItem('user-profile');
      localStorage.removeItem('workout-plans');
      console.log('User logged out');
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateUserProfile = async (profile: UserProfile) => {
    if (user) {
      try {
        await saveUserProfile(user.uid, profile);
        const updatedUser = { ...user, profile };
        setUser(updatedUser);
        console.log('Profile updated:', profile);
      } catch (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      firebaseUser,
      loading,
      login,
      signup,
      logout,
      updateUserProfile,
      isLoggedIn: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
