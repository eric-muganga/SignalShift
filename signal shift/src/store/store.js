// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'
import userReducer from './userSlice';
import chatReducer from './chatSlice';
import uiReducer from './uiSlice';
import messagesReducer from './messagesSlice'

const store = configureStore({
    reducer: {
        auth: authReducer,
        user: userReducer,
        chat: chatReducer,
        ui: uiReducer,
        messages: messagesReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
});

export default store;
