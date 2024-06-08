import { useEffect, useRef, useState } from "react";
import Input from "../common/Input";
import { IconButton, Progress } from "@material-tailwind/react";
import { BsEmojiSmile } from "react-icons/bs";
import { MdSend } from "react-icons/md";
import { ImAttachment } from "react-icons/im";
import { FaMicrophone } from "react-icons/fa";
import EmojiPicker from "emoji-picker-react";
import { database } from "../../firebaseConfig";
import { useSelector } from "react-redux";
import { selectUserProfile } from "../../store/userSlice";
import {
  getChatId,
  selectCurrentChatUser,
  updateUserChats,
} from "../../store/chatSlice";
import { addDoc, collection } from "firebase/firestore";
import MediaUpload from "../../utils/upload";
import CaptureAudio from "../common/CaptureAudio";

function NewMessageInput() {
  const currentUser = useSelector(selectUserProfile);
  const currentChatUser = useSelector(selectCurrentChatUser);
  const [message, setMessage] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [mediaUploadProgress, setMediaUploadProgress] = useState(0);
  //const [uploadInProgress, setUploadInProgress] = useState(false);
  const [showAudioRecorder, setShowAudioRecorder] = useState(false);
  const emojiPickerRef = useRef(null);
  const fileInputRef = useRef(null);

  // Adding event listener for outside click to close emoji picker
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

  // Handling emoji picker modal toggle
  function handleEmojiModal() {
    setShowEmojiPicker(!showEmojiPicker);
  }

  // Adding selected emoji to message input
  function handleEmojiClick(emoji) {
    setMessage((prevMessage) => (prevMessage += emoji.emoji));
  }

  // Handling message input change
  function handleInputChange(e) {
    setMessage(e.target.value);
  }

  // Handling message send click
  async function handleSendClick() {
    if (message.trim() !== "") {
      try {
        const chatId = await getChatId(currentUser.id, currentChatUser.id); // Function to get or create a chat ID
        // Adding the message to the messages collection
        await addDoc(collection(database, "messages"), {
          senderId: currentUser.id,
          receiverId: currentChatUser.id,
          message,
          messageStatus: "sent",
          createdAt: Date.now(),
          chatId, // Including the chat ID in the message document
          type: "text",
        });

        // Updating the userchats collection for both users
        await updateUserChats(
          chatId,
          currentUser.id,
          currentChatUser.id,
          message,
          "text"
        );

        setMessage("");
      } catch (error) {
        console.error("Error adding message: ", error);
      }
    }
  }

  // Handling enter key press to send message
  function handleKeyPress(e) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  }

  // Triggering file input click
  function handleMediaUploadClick() {
    fileInputRef.current.click();
  }

  // Handling file change for media upload
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const fileRef = `uploads/${file.name}-${Date.now()}`;
        const downloadURL = await MediaUpload(
          file,
          fileRef,
          setMediaUploadProgress
        );

        const chatId = await getChatId(currentUser.id, currentChatUser.id);

        await addDoc(collection(database, "messages"), {
          senderId: currentUser.id,
          receiverId: currentChatUser.id,
          message: downloadURL,
          messageStatus: "sent",
          createdAt: Date.now(),
          chatId,
          type: "media",
        });

        await updateUserChats(
          chatId,
          currentUser.id,
          currentChatUser.id,
          downloadURL,
          "media"
        );
      } catch (error) {
        console.error("Error uploading file: ", error);
      } finally {
        setMediaUploadProgress(0);
      }
    }
  };

  return (
    <div className=" bg-blue-gray-50 flex h-20 px-4 items-center gap-6 relative">
      {!showAudioRecorder && (
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
              <ImAttachment className="text-xl text-[#2563EB]" />
            </IconButton>
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
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
            {message.length ? (
              <IconButton
                onClick={handleSendClick}
                variant="text"
                title="Send message"
              >
                <MdSend className="text-xl text-[#2563EB]" />
              </IconButton>
            ) : (
              <IconButton
                variant="text"
                title="Record voice message"
                onClick={() => setShowAudioRecorder(true)}
              >
                <FaMicrophone className="text-xl text-[#2563EB]" />
              </IconButton>
            )}
          </div>
        </>
      )}
      {mediaUploadProgress > 0 && (
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[80%]">
          <Progress
            value={mediaUploadProgress}
            label="Completed"
            color="blue"
          />
        </div>
      )}
      {showAudioRecorder && (
        <CaptureAudio hideCaptureAudio={setShowAudioRecorder} />
      )}
    </div>
  );
}

export default NewMessageInput;
