import ChatListHeader from "./ChatListHeader";
import Chats from "./Chats";
import SearchBar from "./SearchBar";
import ContactList from "../chat/ContactList";
import { useSelector } from "react-redux";
import { selectIsContactListVisible } from "../../store/uiSlice";

export default function ChatsList() {
  const isContactListVisible = useSelector(selectIsContactListVisible);
  return (
    <div className="bg-white flex flex-col max-h-screen z-20">
      {!isContactListVisible && (
        <>
          <ChatListHeader />
          <SearchBar />
          <Chats />
        </>
      )}
      {isContactListVisible && <ContactList />}
    </div>
  );
}
