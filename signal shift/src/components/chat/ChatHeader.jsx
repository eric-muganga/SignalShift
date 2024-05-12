import PropTypes from "prop-types";

import { Avatar, IconButton } from "@material-tailwind/react";
import { IoCallOutline } from "react-icons/io5";
import { HiOutlineVideoCamera } from "react-icons/hi2";
import { BiSearchAlt2 } from "react-icons/bi";
import { BsThreeDotsVertical } from "react-icons/bs";

function ChatHeader(props) {
  return (
    <div className="h-16 px-4 py-3 bg-blue-gray-50 flex justify-between items-center z-10">
      <div className="flex items-center justify-center gap-6">
        <Avatar size="sm" src="" alt="profile pic" />
        <div className="flex flex-col">
          <span className="text-gray-800">Demo</span>
          <span className=" text-blue-700 text-sm">online/offline</span>
        </div>
      </div>
      <div className="flex gap-1">
        <IconButton variant="text">
          <HiOutlineVideoCamera className="text-xl text-[#2563EB]" />
        </IconButton>
        <IconButton variant="text">
          <IoCallOutline className="text-xl text-[#2563EB]" />
        </IconButton>
        <IconButton variant="text">
          <BiSearchAlt2 className="text-xl text-[#2563EB]" />
        </IconButton>
        <IconButton variant="text" title="Menu">
          <BsThreeDotsVertical className="text-xl text-[#2563EB]" />
        </IconButton>
      </div>
    </div>
  );
}

ChatHeader.propTypes = {};

export default ChatHeader;
