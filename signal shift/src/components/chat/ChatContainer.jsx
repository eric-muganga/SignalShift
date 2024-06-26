import { useSelector } from "react-redux";
import { selectMessages } from "../../store/messagesSlice";
import { selectCurrentChatUser } from "../../store/chatSlice";
import { selectUserProfile } from "../../store/userSlice";
import { calculateTime } from "../../utils/CalculateTime";
import MesssgeStatus from "../common/MesssgeStatus";
import ImageMessage from "./ImageMessage";
import VoiceMessage from "./VoiceMessage";

function ChatContainer() {
  const messages = useSelector(selectMessages);
  const currentChatUser = useSelector(selectCurrentChatUser);
  const currentUser = useSelector(selectUserProfile);

  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-chat-background bg-fixed h-full w-full opacity-5 fixed left-0 top-0 z-0"></div>
      <div className="mx-10 my-6 relative bottom-0 z-40 left-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto">
            {messages.map((message) => (
              <div
                key={message.id}
                className={` flex ${
                  message.senderId === currentChatUser.id
                    ? "justify-start"
                    : "justify-end"
                }`}
              >
                {message.type === "text" && (
                  <div
                    className={` px-2 py-[5px] text-sm rounded-md flex gap-2 items-end max-w-[45%] ${
                      message.senderId === currentChatUser.id
                        ? "bg-blue-gray-100 text-blue-gray-900"
                        : "bg-[#2563EB] text-white"
                    } `}
                  >
                    <span className="break-all">{message.message}</span>
                    <div className="flex gap-1 items-end">
                      <span
                        className={` text-[10px] pt-1 min-w-fit ${
                          message.senderId === currentChatUser.id
                            ? " text-blue-gray-900"
                            : " text-white"
                        }`}
                      >
                        {calculateTime(message.createdAt)}
                      </span>
                      <span>
                        {message.senderId === currentUser.id && (
                          <MesssgeStatus
                            messsgeStatus={message.messageStatus}
                          />
                        )}
                      </span>
                    </div>
                  </div>
                )}
                {message.type === "media" && <ImageMessage message={message} />}
                {message.type === "audio" && <VoiceMessage message={message} />}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

ChatContainer.propTypes = {};

export default ChatContainer;
