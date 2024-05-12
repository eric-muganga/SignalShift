import PropTypes from "prop-types";
import { CiMenuKebab }  from "react-icons/ci";
import {
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";

const formatTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
};

function MessageItem({ message }) {
  return (
    <div className="flex items-start gap-2.5">
      <img className="w-8 h-8 rounded-full" src="" alt="" />
      <div className="flex flex-col w-full max-w-[320px]">
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900">
            {message.senderName}
          </span>
          <span className="text-sm font-normal text-gray-500">
            {formatTime(message.timestamp)}
          </span>
        </div>
        <div className="flex flex-col leading-1.5 p-4 border-gray-200 bg-gray-100 rounded-e-xl rounded-es-xl">
          <p className="text-sm font-normal py-2.5 text-gray-900">
            {message.content}
          </p>
        </div>

        <span className="text-sm font-normal text-gray-500">
          {message.status}
        </span>
      </div>
      <Menu
        animate={{
          mount: { y: 0 },
          unmount: { y: 25 },
        }}
      >
        <MenuHandler>
          <IconButton variant="text">
            <CiMenuKebab />
          </IconButton>
        </MenuHandler>
        <MenuList>
          <MenuItem>Reply</MenuItem>
          <MenuItem>Copy</MenuItem>
          <MenuItem>Delete</MenuItem>
        </MenuList>
      </Menu>
    </div>
  );
}

MessageItem.propTypes = {
  message: PropTypes.object.isRequired,
};

export default MessageItem;
