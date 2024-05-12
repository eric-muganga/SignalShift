import PropTypes from "prop-types";
import { useState } from "react";
import MessageList from "./MessageList";
import NewMessageInput from "./NewMessageInput";
import ChatHeader from "./ChatHeader";
import ChatContainer from "./ChatContainer";

const demoMessages = [
  {
    id: 1,
    senderName: "Alice",
    content: "Hi there! How's it going?",
    timestamp: "2023-04-29T09:00:00.000Z",
  },
  {
    id: 2,
    senderName: "Bob",
    content: "Hey Alice! Things are great. How about you?",
    timestamp: "2023-04-29T09:02:00.000Z",
  },
  {
    id: 3,
    senderName: "Alice",
    content: "I'm doing well, thanks for asking! Working on a new project.",
    timestamp: "2023-04-29T09:05:00.000Z",
  },
  {
    id: 4,
    senderName: "Bob",
    content: "That sounds exciting! What kind of project is it?",
    timestamp: "2023-04-29T09:06:00.000Z",
  },
  {
    id: 5,
    senderName: "Alice",
    content: "It's a web development project using React. 😊",
    timestamp: "2023-04-29T09:07:00.000Z",
  },
  {
    id: 6,
    senderName: "Bob",
    content: "Awesome! React is a lot of fun. Need any help?",
    timestamp: "2023-04-29T09:10:00.000Z",
  },
];

function ChatWindow(props) {
  const [messages, setMessages] = useState(demoMessages);

  const sendMessage = (newMessage) => {
    console.log("Sending message:", newMessage);
    // Here you would typically send the message to your backend or Firebase
    // Simulate adding the message to the list
    const updatedMessages = [
      ...messages,
      {
        senderName: "Eric Muganga",
        content: newMessage,
        timestamp: new Date().toISOString(),
      },
    ];
    setMessages(updatedMessages);
  };
  return (
    <div className=" border-l border-gray-600  w-full bg-white flex flex-col h-[100vh] z-10">
      <ChatHeader />
      <ChatContainer />
      {/* <MessageList messages={messages} /> */}
      <NewMessageInput onSendMessage={sendMessage} />
    </div>
  );
}

ChatWindow.propTypes = {};

export default ChatWindow;
