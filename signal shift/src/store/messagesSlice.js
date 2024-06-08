import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { collection, query, where, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { database } from '../firebaseConfig';
import { getChatId } from './chatSlice';

// Async thunk to fetch messages
export const fetchMessages = createAsyncThunk(
    'messages/fetchMessages',
    async ({ currentUser, currentChatUser }, { rejectWithValue }) => {
        if (!currentUser || !currentChatUser) {
            return rejectWithValue('Invalid users');
        }

        return new Promise(async (resolve, reject) => {
            try {
                const messagesRef = collection(database, "messages");
                const q = query(
                    messagesRef,
                    where("chatId", "==", await getChatId(currentUser.id, currentChatUser.id))
                );

                const unsubscribe = onSnapshot(q, (querySnapshot) => {
                    const messagesArray = [];
                    const unreadMessagesArray = [];

                    querySnapshot.forEach((doc) => {
                        const message = { id: doc.id, ...doc.data() };
                        messagesArray.push(message);
                        if (
                            message.messageStatus !== "read" &&
                            message.senderId === currentChatUser.id
                        ) {
                            unreadMessagesArray.push(message.id);
                        }
                    });

                    // Sorting messages by timestamp
                    messagesArray.sort((a, b) => a.createdAt - b.createdAt);

                    // Updating unread messages to read
                    const updatePromises = unreadMessagesArray.map((messageId) => {
                        const messageRef = doc(database, "messages", messageId);
                        return updateDoc(messageRef, {
                            messageStatus: "read",
                        });
                    });

                    Promise.all(updatePromises)
                        .then(() => resolve(messagesArray))
                        .catch(reject);
                });

                //console.log(unsubscribe);
                return unsubscribe;
            } catch (error) {
                reject(error);
            }
        });
    }
);

const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        messages: [],
        status: 'idle',
        error: null,
    },
    reducers: {
        setMessages(state, action) {
            state.messages = action.payload;
        },
        clearMessages(state) {
            state.messages = [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchMessages.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMessages.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.messages = action.payload;
                state.unsubscribe = action.payload.unsubscribe;
            })
            .addCase(fetchMessages.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export const { setMessages, clearMessages } = messagesSlice.actions;

export const selectMessages = (state) => state.messages.messages;

export default messagesSlice.reducer;
