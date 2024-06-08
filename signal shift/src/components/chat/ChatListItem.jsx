import { Avatar } from "@material-tailwind/react";
import PropTypes from "prop-types";
import blankProfilePicture from "../../assets/blank-profile-picture.png";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChatUser } from "../../store/chatSlice";
import { hideContactList } from "../../store/uiSlice";
import { calculateTime } from "../../utils/CalculateTime";
import { selectUserProfile } from "../../store/userSlice";
import MesssgeStatus from "../common/MesssgeStatus";
import { FaCamera, FaMicrophone } from "react-icons/fa";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { database } from "../../firebaseConfig";

// Function to fetch user data from the users collection
const fetchUserData = async (userId) => {
  const userDoc = await getDoc(doc(database, "users", userId));
  if (userDoc.exists()) {
    const data = userDoc.data();
    return data;
  }
};

// Function to reset unread messages
const resetUnreadMessages = async (userId, chatId) => {
  const userChatsRef = doc(database, "userchats", userId);
  const userChatsDoc = await getDoc(userChatsRef);
  if (userChatsDoc.exists()) {
    const userChatsData = userChatsDoc.data().chats || [];
    const updatedChats = userChatsData.map((chat) => {
      if (chat.chatId === chatId) {
        return { ...chat, unreadMessages: 0 };
      }
      return chat;
    });
    await updateDoc(userChatsRef, { chats: updatedChats });
  }
};

function ChatListItem({ data, isContactPage = false }) {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUserProfile);

  const { user, lastMessage, unreadMessages } = data;

  // Handling contact click for the contact page
  const handleContactClick = async () => {
    console.log(data);
    dispatch(setCurrentChatUser(data));
    dispatch(hideContactList());
  };

  // Handling  chat selection for the chat list
  const handleChatClick = async () => {
    console.log(data);
    const userInfo = await fetchUserData(user.id);
    console.log(userInfo);
    dispatch(setCurrentChatUser(userInfo));
    await resetUnreadMessages(currentUser.id, data.chatId); // Resetting unread messages
  };

  return (
    <div
      className={`flex cursor-pointer hover:bg-light-blue-50`}
      onClick={isContactPage ? handleContactClick : handleChatClick}
    >
      <div className="min-w-fit px-5 pt-3 pb-1">
        <Avatar
          src={
            isContactPage ? data?.avatar : user?.avatar || blankProfilePicture
          }
          size="sm"
        />
      </div>
      <div className="min-h-full flex flex-col justify-center mt-3 pr-2 w-full">
        <div className="flex justify-between">
          <div>
            <span className="font-bold">
              {isContactPage ? data?.displayName : user?.displayName}
            </span>
          </div>
          {!isContactPage && (
            <div>
              <span
                className={`${
                  !unreadMessages > 0 ? "text-secondary" : "text-[#2563EB]"
                } text-sm`}
              >
                {calculateTime(lastMessage?.createdAt)}
              </span>
            </div>
          )}
        </div>
        <div className="flex border-b pb-2 pt-1">
          <div className="flex justify-between w-full">
            <span className="text-secondary line-clamp-1 text-sm">
              {isContactPage ? (
                data?.about || "\u00A0"
              ) : (
                <div className="flex items-center gap-1 max-w-[200px] sm:max-w-[250px] md:max-w-[300px] lg:max-w-[200px] xl:max-w-[3000px]">
                  {lastMessage?.senderId === currentUser.id && (
                    <MesssgeStatus messsgeStatus={lastMessage?.messageStatus} />
                  )}
                  {lastMessage.type === "text" && (
                    <span className="truncate">{lastMessage.message}</span>
                  )}
                  {lastMessage.type === "media" && (
                    <span className="flex gap-1 items-center ">
                      <FaCamera className="text-[#2563EB]" /> Image
                    </span>
                  )}
                  {lastMessage.type === "audio" && (
                    <span className="flex gap-1 items-center ">
                      <FaMicrophone className="text-[#2563EB]" /> Audio
                    </span>
                  )}
                </div>
              )}
            </span>
            {unreadMessages > 0 && (
              <span className="bg-[#2563EB] px-[5px] rounded-full text-sm">
                {unreadMessages}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

ChatListItem.propTypes = {
  data: PropTypes.object.isRequired,
  isContactPage: PropTypes.bool,
};

export default ChatListItem;
