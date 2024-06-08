import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { selectCurrentChatUser } from "../../store/chatSlice";
import { calculateTime } from "../../utils/CalculateTime";
import MesssgeStatus from "../common/MesssgeStatus";
import { selectUserProfile } from "../../store/userSlice";

function ImageMessage({ message }) {
  const currentChatUser = useSelector(selectCurrentChatUser);
  const currentUser = useSelector(selectUserProfile);
  return (
    <div
      className={`p-1 rounded-lg ${
        message.senderId === currentChatUser.id
          ? "bg-blue-gray-100 text-blue-gray-900"
          : "bg-[#2563EB] text-white"
      }`}
    >
      <div className="relative">
        <img
          src={message.message}
          alt="asset"
          className="rounded-lg"
          width={300}
          height={300}
        />
        <div className="absolute bottom-1 right-1 flex items-end gap-1">
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
              <MesssgeStatus messsgeStatus={message.messageStatus} />
            )}
          </span>
        </div>
      </div>
    </div>
  );
}

ImageMessage.propTypes = {
  message: PropTypes.object.isRequired,
};

export default ImageMessage;
