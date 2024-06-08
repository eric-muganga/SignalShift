import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth, database } from '../firebaseConfig';  // Ensure this path is correct
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';

const initialState = {
  currentUser: null,
  status: 'idle',
  loading: true,
  error: null,
};

// Helper function to extract necessary user data
const extractUserData = (user) => ({
  id: user.uid,
  email: user.email,
});



// Async thunk for user signup
export const signup = createAsyncThunk('auth/signup', async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = extractUserData(userCredential.user)

    // Setting user online status in Firestore
    await setDoc(doc(database, 'users', user.id), {
      online: true,
      lastSeen: serverTimestamp(),
    }, { merge: true });
    return { ...user, lastSeen: new Date().toISOString() }
  } catch (error) {

    return rejectWithValue(error.message);
  }
});

// Async thunk for user login
export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const user = extractUserData(userCredential.user);

    // Setting user online status in Firestore
    await setDoc(doc(database, 'users', user.id), {
      online: true,
      lastSeen: serverTimestamp(),
    }, { merge: true });
    return { ...user, lastSeen: new Date().toISOString() }
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Async thunk for user logout
export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue, getState }) => {
  try {
    const state = getState();
    const userId = state.auth.currentUser.id;

    // Set user offline status in Firestore
    await setDoc(doc(database, 'users', userId), {
      online: false,
      lastSeen: serverTimestamp(),
    }, { merge: true });

    await signOut(auth);
    return null;
  } catch (error) {
    return rejectWithValue(error.message);
  }
});


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCurrentUser(state, action) {
      state.currentUser = action.payload;
    },
    setAuthLoading(state, action) {
      state.loading = action.payload; // action to set loading state
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.currentUser = action.payload;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        state.currentUser = null;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setCurrentUser, setAuthLoading } = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;
export const selectAuthLoading = (state) => state.auth.loading;


export default authSlice.reducer;