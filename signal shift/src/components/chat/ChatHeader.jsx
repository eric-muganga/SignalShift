import {
  Avatar,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import { IoCallOutline } from "react-icons/io5";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import {
  selectCurrentChatUser,
  setCurrentChatUser,
} from "../../store/chatSlice";
import { showMessageSearch } from "../../store/uiSlice";
import { calculateTime } from "../../utils/CalculateTime";

function ChatHeader() {
  const currentChatUser = useSelector(selectCurrentChatUser);
  const dispatch = useDispatch();

  const handleSearchBtnClick = () => {
    dispatch(showMessageSearch());
  };

  const handleCloseChat = () => {
    dispatch(setCurrentChatUser(null));
  };

  return (
    <div className="h-16 px-4 py-3 bg-blue-gray-50 flex justify-between items-center z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar
          size="sm"
          src={currentChatUser?.avatar}
          alt={currentChatUser?.displayName}
        />
        <div className="flex flex-col">
          <span className="text-gray-800">{currentChatUser?.displayName}</span>
          <span className=" text-blue-700 text-sm">
            {currentChatUser?.online
              ? "Online"
              : `Last seen: ${calculateTime(
                  currentChatUser?.lastSeen?.seconds * 1000
                )}`}
          </span>
        </div>
      </div>
      <div className="flex gap-1">
        <IconButton variant="text">
          <HiOutlineVideoCamera className="text-xl text-[#2563EB]" />
        </IconButton>
        <IconButton variant="text">
          <IoCallOutline className="text-xl text-[#2563EB]" />
        </IconButton>
        <IconButton variant="text" onClick={handleSearchBtnClick}>
          <BiSearchAlt2 className="text-xl text-[#2563EB]" />
        </IconButton>
        <Menu
          animate={{
            mount: { y: 0 },
            unmount: { y: 25 },
          }}
        >
          <MenuHandler>
            <IconButton variant="text" title="Menu">
              <BsThreeDotsVertical className="text-xl text-[#2563EB]" />
            </IconButton>
          </MenuHandler>
          <MenuList>
            <MenuItem onClick={handleCloseChat}>close chat</MenuItem>
          </MenuList>
        </Menu>
      </div>
    </div>
  );
}

export default ChatHeader;
