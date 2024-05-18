import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Input from "../common/Input";
import { IconButton } from "@material-tailwind/react";
import { BsEmojiSmile } from "react-icons/bs";
import { ImAttachment } from "react-icons/im";
import { FaMicrophone } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import EmojiPicker from "emoji-picker-react";
import MediaUpload from "../common/MediaUpload";

function NewMessageInput({ onSendMessage, chatId, senderId }) {
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null);
  const [mediaUpload, setMediaUpload] = useState(false);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (event.target.id !== "emoji-open") {
        if (
          emojiPickerRef.current &&
          !emojiPickerRef.current.contains(event.target)
        ) {
          setShowEmojiPicker(false);
        }
      }
    };

    document.addEventListener("click", handleOutsideClick);

    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  function handleEmojiModal() {
    setShowEmojiPicker(!showEmojiPicker);
  }

  function handleEmojiClick(emoji) {
    setMessage((prevMessage) => (prevMessage += emoji.emoji));
  }

  function handleInputChange(e) {
    setMessage(e.target.value);
  }

  function handleSendClick() {
    if (message.trim() !== "") {
      onSendMessage(message);
      alert(message);
      setMessage("");
    }
  }

  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  }

  function handleMediaUploadClick() {
    setMediaUpload(!MediaUpload);
  }

  return (
    <div className=" bg-blue-gray-50 flex h-20 px-4 items-center gap-6 relative">
      <>
        <div className="flex gap-0">
          <IconButton
            variant="text"
            title="Emoji"
            id="emoji-open"
            onClick={handleEmojiModal}
          >
            <BsEmojiSmile
              className="text-xl text-[#2563EB]"
              id="emoji-open"
              onClick={handleEmojiModal}
            />
          </IconButton>
          {showEmojiPicker && (
            <div
              className="absolute bottom-16 left-10 z-30"
              ref={emojiPickerRef}
            >
              <EmojiPicker
                onEmojiClick={handleEmojiClick}
                theme="light"
                height={"400px"}
                width={"300px"}
              />
            </div>
          )}
          <IconButton
            variant="text"
            title="Attach"
            onClick={handleMediaUploadClick}
          >
            <ImAttachment
              className="text-xl text-[#2563EB]"
              onClick={handleMediaUploadClick}
            />
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
          <IconButton
            onClick={handleSendClick}
            variant="text"
            title="Send message"
          >
            <MdSend className="text-xl text-[#2563EB]" />
          </IconButton>
          {/* <IconButton variant="text" title="Record voice message">
            <FaMicrophone className="text-xl text-[#2563EB]" />
          </IconButton> */}
        </div>
      </>
      {mediaUpload && <MediaUpload chatId={chatId} senderId={senderId} />}
    </div>
  );
}

NewMessageInput.propTypes = {
  onSendMessage: PropTypes.func.isRequired,
  chatId: PropTypes.string.isRequired,
  senderId: PropTypes.string.isRequired,
};

export default NewMessageInput;
