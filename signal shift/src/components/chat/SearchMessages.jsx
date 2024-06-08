import { IconButton, Input } from "@material-tailwind/react";
import { IoClose } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { hideMessageSearch } from "../../store/uiSlice";
import { BiSearchAlt2 } from "react-icons/bi";
import { useEffect, useState } from "react";
import { selectCurrentChatUser } from "../../store/chatSlice";
import { calculateTime } from "../../utils/CalculateTime";
import { selectMessages } from "../../store/messagesSlice";

function SearchMessages() {
  const currentChatUser = useSelector(selectCurrentChatUser);
  const messages = useSelector(selectMessages);
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchedMessages, setSearchedMessages] = useState([]);

  // Updating searched messages based on the search term
  useEffect(() => {
    if (searchTerm) {
      setSearchedMessages(
        messages.filter(
          (message) =>
            message.type === "text" &&
            message.message.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setSearchedMessages([]);
    }
  }, [searchTerm, messages]);

  // Handling the close button click to hide the search component
  const handleClosehBtnClick = () => {
    dispatch(hideMessageSearch());
  };

  return (
    <div className="border border-blue-gray-900 border-l w-full bg-white flex flex-col z-10 max-h-screen">
      <div className="h-16 px-4 py-5 flex gap-10 items-center bg-blue-gray-50 text-primary">
        <IconButton variant="text" onClick={handleClosehBtnClick}>
          <IoClose className=" text-xl text-[#2563EB]" />
        </IconButton>
        <span>Search Messages</span>
      </div>
      <div className="overflow-auto custom-scrollbar h-full">
        <div className="flex items-center flex-col w-full">
          <div className="flex px-5 items-center gap-3 h-14 w-full">
            <div className="bg-gray-100 flex items-center justify-stretch px-3 py-1 rounded-xl flex-grow">
              <Input
                icon={<BiSearchAlt2 className="text-lg  text-[#2563EB]" />}
                type="text"
                variant="standard"
                label="Search messages"
                size="md"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="text-sm focus:outline-none text-blue-gray-900 w-full"
              />
            </div>
          </div>
          <span className="mt-10 text-secondary">
            {!searchTerm.length &&
              `Search for messages with ${currentChatUser?.displayName}`}
          </span>
        </div>
        <div className="flex justify-center h-full flex-col">
          {searchTerm.length > 0 && !searchedMessages.length && (
            <span className="text-secondary w-full flex justify-center">
              No messages found
            </span>
          )}
          <div className="flex flex-col w-full h-full">
            {searchedMessages.map((message) => (
              <div
                key={message.id}
                className="flex cursor-pointer flex-col justify-center hover:bg-blue-gray-200 w-full px-5 border-b-[0.1px] border-secondary py-5"
              >
                <div className="text-sm text-secondary ">
                  {calculateTime(message.createdAt)}
                </div>
                <div className="text-[#2563EB]">{message.message}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default SearchMessages;
