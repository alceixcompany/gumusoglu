import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  isStaticAdmin?: boolean;
  isDatabaseAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  isAuthenticated: boolean;
  hasDatabaseAdmins: boolean;
}

// LocalStorage key for auth persistence
const AUTH_STORAGE_KEY = 'gumusoglu_auth_state';

// Helper functions for localStorage
const saveAuthToStorage = (user: User | null) => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return;
  }
  
  try {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user,
        timestamp: new Date().toISOString()
      }));
    } else {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  } catch (error) {
    console.error('Error saving auth to localStorage:', error);
  }
};

const loadAuthFromStorage = (): User | null => {
  // Check if we're in browser environment
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const stored = localStorage.getItem(AUTH_STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      // Check if stored data is not older than 7 days
      const storedDate = new Date(data.timestamp);
      const now = new Date();
      const daysDiff = (now.getTime() - storedDate.getTime()) / (1000 * 3600 * 24);
      
      if (daysDiff <= 7) {
        return data.user;
      } else {
        // Clear expired data
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
  } catch (error) {
    console.error('Error loading auth from localStorage:', error);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }
  return null;
};

const initialState: AuthState = {
  user: null,
  isLoading: false,
  error: null,
  successMessage: null,
  isAuthenticated: false,
  hasDatabaseAdmins: false,
};

// Veritabanında admin var mı kontrol et
export const checkDatabaseAdmins = createAsyncThunk(
  'auth/checkDatabaseAdmins',
  async (_, { rejectWithValue }) => {
    try {
      const adminsRef = collection(db, 'admins');
      const q = query(adminsRef, where('isAdmin', '==', true));
      const querySnapshot = await getDocs(q);
      return querySnapshot.size > 0;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Sunucu tarafında korunan yönetici hesabı ile giriş
export const loginWithStaticAdmin = createAsyncThunk(
  'auth/loginWithStaticAdmin',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Giriş yapılamadı.');
      return data.user as User;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Veritabanı admin ile giriş
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async ({ email, password }: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Kullanıcının admin olup olmadığını kontrol et
      const adminRef = doc(db, 'admins', user.uid);
      let adminDoc = await getDoc(adminRef);

      // Yeni projedeki sabit ilk yönetici, kurallarda tanımlı UID ile kendi kaydını oluşturabilir.
      if (!adminDoc.exists() && user.uid === process.env.NEXT_PUBLIC_FIREBASE_BOOTSTRAP_ADMIN_UID) {
        await setDoc(adminRef, {
          email: user.email,
          displayName: 'Gümüşoğlu Elektrik Yönetici',
          isAdmin: true,
          createdAt: new Date().toISOString(),
          createdBy: 'firebase-bootstrap',
        });
        adminDoc = await getDoc(adminRef);
      }

      if (!adminDoc.exists() || !adminDoc.data()?.isAdmin) {
        throw new Error('Bu kullanıcının admin yetkisi bulunmamaktadır.');
      }

      // Firebase kimliği doğrulandıktan sonra Next.js admin rotaları için
      // güvenli, httpOnly sunucu oturumunu aç.
      const sessionResponse = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken: await user.getIdToken() }),
      });
      const sessionData = await sessionResponse.json();
      if (!sessionResponse.ok) throw new Error(sessionData.message || 'Yönetici oturumu açılamadı.');

      const userData: User = {
        uid: user.uid,
        email: user.email,
        displayName: adminDoc.data()?.displayName || user.displayName,
        isStaticAdmin: false,
        isDatabaseAdmin: true,
      };
      
      return userData;
    } catch (error) {
      await fetch('/api/admin/logout', { method: 'POST' }).catch(() => undefined);
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Yeni admin oluştur
export const createAdmin = createAsyncThunk(
  'auth/createAdmin',
  async ({ email, password, displayName }: { email: string; password: string; displayName: string }, { rejectWithValue }) => {
    try {
      // Firebase Auth ile kullanıcı oluştur
      const { createUserWithEmailAndPassword } = await import('firebase/auth');
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Firestore'da admin bilgilerini kaydet
      await setDoc(doc(db, 'admins', user.uid), {
        email: user.email,
        displayName: displayName,
        isAdmin: true,
        createdAt: new Date().toISOString(),
        createdBy: 'static-admin',
      });

      const userData: User = {
        uid: user.uid,
        email: user.email,
        displayName: displayName,
        isStaticAdmin: false,
        isDatabaseAdmin: true,
      };

      return userData;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

// Şifre değiştirme
export const changePassword = createAsyncThunk(
  'auth/changePassword',
  async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }, { getState, rejectWithValue }) => {
    try {
      const state = getState() as { auth: AuthState };
      const user = state.auth.user;

      if (!user) {
        throw new Error('Kullanıcı bulunamadı');
      }

      // Statik admin için şifre değiştirme desteklenmiyor
      if (user.isStaticAdmin) {
        throw new Error('Statik admin için şifre değiştirme desteklenmiyor');
      }

      // Veritabanı admin için şifre değiştirme
      if (user.isDatabaseAdmin) {
        const { updatePassword, reauthenticateWithCredential, EmailAuthProvider } = await import('firebase/auth');
        const { updateDoc, doc } = await import('firebase/firestore');
        
        // Önce kullanıcıyı yeniden doğrula
        const credential = EmailAuthProvider.credential(user.email || '', currentPassword);
        await reauthenticateWithCredential(auth.currentUser!, credential);
        
        // Firebase Auth'da şifreyi güncelle
        await updatePassword(auth.currentUser!, newPassword);
        
        // Firestore'da güncelleme tarihi kaydet
        await updateDoc(doc(db, 'admins', user.uid), {
          passwordUpdatedAt: new Date().toISOString(),
        });

        return { success: true };
      }

      throw new Error('Desteklenmeyen kullanıcı tipi');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      await fetch('/api/admin/logout', { method: 'POST' });
      if (auth.currentUser) await signOut(auth);
      return null;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

export const checkAuthState = createAsyncThunk(
  'auth/checkAuthState',
  async (_, { rejectWithValue }) => {
    try {
      await auth.authStateReady();
      const firebaseUser = auth.currentUser;
      if (!firebaseUser) return null;

      const adminDoc = await getDoc(doc(db, 'admins', firebaseUser.uid));
      if (!adminDoc.exists() || !adminDoc.data()?.isAdmin) {
        await signOut(auth);
        return null;
      }

      // Sunucu oturumu kaybolmuşsa Firebase token ile yeniden oluştur.
      const currentSession = await fetch('/api/admin/session');
      if (!currentSession.ok) {
        const sessionResponse = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: await firebaseUser.getIdToken() }),
        });
        if (!sessionResponse.ok) throw new Error('Yönetici oturumu yenilenemedi.');
      }

      return {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        displayName: adminDoc.data()?.displayName || firebaseUser.displayName,
        isStaticAdmin: false,
        isDatabaseAdmin: true,
      } as User;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Oturum doğrulanamadı.');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
      state.isLoading = false;
      state.error = null;
      saveAuthToStorage(action.payload); // Save to localStorage
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setHasDatabaseAdmins: (state, action: PayloadAction<boolean>) => {
      state.hasDatabaseAdmins = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Check database admins
    builder
      .addCase(checkDatabaseAdmins.fulfilled, (state, action) => {
        state.hasDatabaseAdmins = action.payload;
      });

    // Static admin login
    builder
      .addCase(loginWithStaticAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithStaticAdmin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        saveAuthToStorage(action.payload); // Save to localStorage
      })
      .addCase(loginWithStaticAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Database admin login
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
        saveAuthToStorage(action.payload); // Save to localStorage
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.isAuthenticated = false;
      });

    // Create admin
    builder
      .addCase(createAdmin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createAdmin.fulfilled, (state) => {
        state.isLoading = false;
        state.hasDatabaseAdmins = true;
        state.error = null;
      })
      .addCase(createAdmin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Change password
    builder
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
        state.successMessage = 'Şifreniz başarıyla güncellendi!';
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.successMessage = null;
      });

    // Logout
    builder
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        saveAuthToStorage(null); // Save to localStorage
      })
      .addCase(logoutUser.rejected, (state) => {
        state.isLoading = false;
        state.error = null;
      });

    // Check auth state
    builder
      .addCase(checkAuthState.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthState.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.error = null;
        saveAuthToStorage(action.payload);
      })
      .addCase(checkAuthState.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload as string;
        saveAuthToStorage(null);
      });
  },
});

export const { setUser, clearError, clearSuccessMessage, setLoading, setHasDatabaseAdmins } = authSlice.actions;
export default authSlice.reducer;
