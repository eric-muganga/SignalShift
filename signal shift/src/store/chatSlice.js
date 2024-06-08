import { createSlice } from '@reduxjs/toolkit';
import { collection, query, where, getDocs, addDoc, doc, setDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { database } from '../firebaseConfig';

export const getChatId = async (userId1, userId2) => {
    const chatRef = collection(database, 'chats');

    // Creating a query to find chats between the two users
    const q = query(chatRef, where('participants', 'array-contains-any', [userId1, userId2]));
    const querySnapshot = await getDocs(q);

    // Checking if any chat exists between the users
    for (const docSnapshot of querySnapshot.docs) {
        const chatData = docSnapshot.data();
        if (chatData.participants.includes(userId1) && chatData.participants.includes(userId2)) {
            // Returning the existing chat ID
            return docSnapshot.id;
        }
    }

    // If no chat exists, create a new one
    const newChatRef = await addDoc(chatRef, {
        participants: [userId1, userId2],
        createdAt: Date.now(),
    });

    return newChatRef.id;
};


// Function to update the userchats collection
export async function updateUserChats(chatId, senderId, receiverId, lastMessage, messageType) {
    const senderChatRef = doc(database, "userchats", senderId);
    const receiverChatRef = doc(database, "userchats", receiverId);

    const lastMessageData = {
        message: lastMessage,
        messageType: messageType,
        timestamp: Date.now(),
    };

    // Updating the sender's userchats
    await setDoc(
        senderChatRef,
        {
            userId: senderId,
            chats: arrayUnion({
                chatId,
                lastMessage: lastMessageData,
                unreadMessages: 0,
            }),
        },
        { merge: true }
    );

    // Updating the receiver's userchats
    const receiverDoc = await getDoc(receiverChatRef);
    const receiverData = receiverDoc.exists() ? receiverDoc.data() : { chats: [] };

    const chatIndex = receiverData.chats.findIndex((chat) => chat.chatId === chatId);
    if (chatIndex >= 0) {
        receiverData.chats[chatIndex].lastMessage = lastMessageData;
        receiverData.chats[chatIndex].unreadMessages += 1;
    } else {
        receiverData.chats.push({
            chatId,
            lastMessage: lastMessageData,
            unreadMessages: 1,
        });
    }

    await setDoc(receiverChatRef, receiverData, { merge: true });
}

const initialState = {
    chatId: null,
    currentChatUser: null,
};



const chatSlice = createSlice({
    name: 'chat',
    initialState,
    reducers: {
        setCurrentChatUser(state, action) {
            state.currentChatUser = action.payload;

        },
        setIsCurrentUserBlocked(state, action) {
            state.isCurrentUserBlocked = action.payload;
        },
        setIsReceiverBlocked(state, action) {
            state.isReceiverBlocked = action.payload;
        },
        changeChat(state, action) {
            const { chatId, currentChatUser, currentUser, unseenMessages } = action.payload;
            state.chatId = chatId;
            state.currentChatUser = currentChatUser;
            state.unseenMessages = unseenMessages;

            // Ensure currentUser and currentChatUser are defined and have a blocked property
            if (currentUser && currentUser.blocked && currentChatUser && currentChatUser.blocked) {
                state.isCurrentUserBlocked = currentChatUser.blocked.includes(currentUser.id);
                state.isReceiverBlocked = currentUser.blocked.includes(currentChatUser.id);
            } else {
                state.isCurrentUserBlocked = false;
                state.isReceiverBlocked = false;
            }
        },
        changeBlock(state) {
            state.isReceiverBlocked = !state.isReceiverBlocked
        },
        resetChatState(state) {
            state.chatId = null;
            state.currentChatUser = null;
            state.isCurrentUserBlocked = false;
            state.isReceiverBlocked = false;
            state.unseenMessages = [];
        },
    },
});

export const {
    setCurrentChatUser,
    setChatId,
    setIsCurrentUserBlocked,
    setIsReceiverBlocked,
    changeChat,
    resetChatState,
} = chatSlice.actions;

export const selectCurrentChatUser = (state) => state.chat.currentChatUser;
export const selectChatId = (state) => state.chat.chatId;
export const selectIsCurrentUserBlocked = (state) => state.chat.isCurrentUserBlocked;
export const selectIsReceiverBlocked = (state) => state.chat.isReceiverBlocked;
export const selectUnseenMessages = (state) => state.chat.unseenMessages;


export default chatSlice.reducer;