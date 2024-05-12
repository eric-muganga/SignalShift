import ChatListHeader from "./ChatListHeader";
import Chats from "./Chats";
import SearchBar from "./SearchBar";

export default function ChatsList() {
  return (
    <div className="bg-white flex flex-col max-h-screen z-20">
      <ChatListHeader />
      <SearchBar />
      <Chats />
    </div>
  );
}
