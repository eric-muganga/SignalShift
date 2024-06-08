// src/features/user/userSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { database } from '../firebaseConfig';

const initialState = {
  userProfile: null,
  status: 'idle',
  error: null,
  messages: [],
};



// Async thunk for fetching user info
export const fetchUserInfo = createAsyncThunk('userfetchUserInfo', async (userId) => {
  const userDocRef = doc(database, 'users', userId);
  const userDocSnap = await getDoc(userDocRef);
  if (userDocSnap.exists()) {
    const data = userDocSnap.data();
    return data;
  } else {
    throw new Error('User profile does not exist');
  }
});

export const saveUserProfile = createAsyncThunk('user/saveUserProfile', async ({ userId, profile }) => {
  const userDocRef = doc(database, 'users', userId);
  await setDoc(userDocRef, profile, { merge: true });
  return profile;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserInfo.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserInfo.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userProfile = action.payload;
      })
      .addCase(fetchUserInfo.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(saveUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(saveUserProfile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.userProfile = action.payload;
      })
      .addCase(saveUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectUserProfile = (state) => state.user.userProfile;

export default userSlice.reducer;
