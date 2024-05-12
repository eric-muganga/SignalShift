import { Avatar, IconButton } from "@material-tailwind/react";
import blankProfilePicture from "../../assets/blank-profile-picture.png";
import { BsFillChatLeftTextFill, BsThreeDotsVertical } from "react-icons/bs";

export default function ChatListHeader() {
  return (
    <div className=" bg-white h-16 px-4 py-3 flex justify-between items-center">
      <div className="cursor-pointer">
        <Avatar src={blankProfilePicture} alt="Profile pic" size="sm" />
      </div>
      <div className="flex gap-6">
        <IconButton variant="text" title="New chat">
          <BsFillChatLeftTextFill className="text-xl text-[#2563EB]" />
        </IconButton>
        <IconButton variant="text" title="Menu">
          <BsThreeDotsVertical className="text-xl text-[#2563EB]" />
        </IconButton>
      </div>
    </div>
  );
}
