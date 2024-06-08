import NewMessageInput from "./NewMessageInput";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectCurrentChatUser } from "../../store/chatSlice";
import { selectUserProfile } from "../../store/userSlice";
import {
  fetchMessages,
  selectMessages,
  setMessages,
} from "../../store/messagesSlice";

function ChatWindow() {
  const dispatch = useDispatch();
  const currentChatUser = useSelector(selectCurrentChatUser);
  const currentUser = useSelector(selectUserProfile);
  const messages = useSelector(selectMessages);

  useEffect(() => {
    if (!currentUser || !currentChatUser) return;

    const unsubscribe = dispatch(
      fetchMessages({ currentUser, currentChatUser })
    )
      .unwrap()
      .then((messages) => {
        dispatch(setMessages(messages));
      })
      .catch((error) => {
        console.error("Failed to fetch messages: ", error);
      });

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [currentUser, currentChatUser, dispatch, messages]);

  return (
    <div className="border-l border-gray-600 w-full bg-white flex flex-col h-[100vh] z-10">
      <ChatHeader />
      <ChatContainer />

      <NewMessageInput />
    </div>
  );
}

export default ChatWindow;
