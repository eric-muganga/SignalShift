import { useEffect, useState } from "react";

import ChatListItem from "../chat/ChatListItem";
import { selectUserProfile } from "../../store/userSlice";
import { useSelector } from "react-redux";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { selectSearchTerm } from "../../store/uiSlice";

export default function Chats() {
  const currentUser = useSelector(selectUserProfile);
  const searchTerm = useSelector(selectSearchTerm);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const fetchChats = async () => {
      if (!currentUser?.id) return;

      const userChatsRef = doc(database, "userchats", currentUser.id);
      const unsubscribe = onSnapshot(userChatsRef, async (userChatsDoc) => {
        if (userChatsDoc.exists()) {
          const userChatsData = userChatsDoc.data().chats || [];

          const uniqueChats = new Set();
          const enrichedChats = await Promise.all(
            userChatsData.map(async (chat) => {
              if (uniqueChats.has(chat.chatId)) {
                return null;
              }
              uniqueChats.add(chat.chatId);

              const chatRef = doc(database, "chats", chat.chatId);
              const chatDoc = await getDoc(chatRef);

              if (chatDoc.exists()) {
                const chatData = chatDoc.data();
                const otherUserId = chatData.participants.find(
                  (id) => id !== currentUser.id
                );
                const otherUserRef = doc(database, "users", otherUserId);
                const otherUserDoc = await getDoc(otherUserRef);

                const lastMessageRef = collection(database, "messages");
                const lastMessageQuery = query(
                  lastMessageRef,
                  where("chatId", "==", chat.chatId),
                  orderBy("createdAt", "desc"),
                  limit(1)
                );
                const lastMessageSnapshot = await getDocs(lastMessageQuery);
                const lastMessageDoc = lastMessageSnapshot.docs[0];

                return {
                  chatId: chat.chatId,
                  user: {
                    id: otherUserDoc.id,
                    displayName: otherUserDoc.data().displayName,
                    avatar: otherUserDoc.data().avatar || "",
                  },
                  lastMessage: lastMessageDoc
                    ? {
                        message: lastMessageDoc.data().message,
                        createdAt: lastMessageDoc.data().createdAt,
                        messageStatus: lastMessageDoc.data().messageStatus,
                        type: lastMessageDoc.data().type,
                        senderId: lastMessageDoc.data().senderId,
                      }
                    : {},
                  unreadMessages: chat.unreadMessages,
                };
              }
            })
          );

          // Filtering out null values and sort by lastMessage.createdAt
          const filteredChats = enrichedChats.filter(
            (chat) => chat && chat.lastMessage
          );
          filteredChats.sort(
            (a, b) => b.lastMessage.createdAt - a.lastMessage.createdAt
          );

          setChats(filteredChats);
        }
      });

      return () => {
        unsubscribe();
      };
    };

    fetchChats();
  }, [currentUser]);

  // Filter chats based on search term
  const filteredChats = chats.filter((chat) =>
    chat.user.displayName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log(filteredChats);
  return (
    <div className="flex-auto overflow-auto max-h-full custom-scrollbar ml-2">
      {filteredChats.length > 0 ? (
        filteredChats.map((chat) => (
          <ChatListItem key={chat.chatId} data={chat} />
        ))
      ) : (
        <p>No chats available</p>
      )}
    </div>
  );
}
