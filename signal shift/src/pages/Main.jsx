import ChatWindow from "../components/chat/ChatWindow";
import ChatsList from "../components/layouts/ChatsList";

function Main() {
  return (
    <div className="flex h-screen w-screen max-h-screen max-w-full overflow-hidden">
      <ChatsList />
      <ChatWindow />
    </div>
  );
}

export default Main;
