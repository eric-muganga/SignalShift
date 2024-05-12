import PropTypes from "prop-types";
import { useState } from "react";
import Input from "../common/Input";
import { IconButton } from "@material-tailwind/react";
import { BsEmojiSmile } from "react-icons/bs";
import { MdSend } from "react-icons/md";
import { ImAttachment } from "react-icons/im";
import { FaMicrophone } from "react-icons/fa";

function NewMessageInput({ onSendMessage }) {
  const [message, setMessage] = useState("");

  function handleInputChange(e) {
    setMessage(e.target.value);
  }

  function handleSendClick() {
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  }

  return (
    <div className=" bg-blue-gray-50 flex h-20 px-4 items-center gap-6 relative">
      <>
        <div className="flex gap-0">
          <IconButton variant="text" title="Emoji">
            <BsEmojiSmile className="text-xl text-[#2563EB]" />
          </IconButton>
          <IconButton variant="text" title="Attach">
            <ImAttachment className="text-xl text-[#2563EB]" />
          </IconButton>
        </div>
        <div className="w-full h-10 rounded-lg flex items-center">
          <Input
            type="text"
            variant="standard"
            value={message}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className=" text-sm focus:outline-none text-blue-gray-900 w-full h-10 px-5 py-4"
          />
        </div>
        <div className="flex w-10 items-center justify-center">
          {/* <IconButton
            onClick={handleSendClick}
            variant="text"
            title="Send message"
          >
            <MdSend className="text-xl text-[#2563EB]" />
          </IconButton> */}
          <IconButton variant="text" title="Record voice message">
            <FaMicrophone className="text-xl text-[#2563EB]" />
          </IconButton>
        </div>
      </>
    </div>
  );
}

NewMessageInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
};

export default NewMessageInput;
