import PropTypes from "prop-types";

import { useState } from "react";
import { storage, database } from "../../firebaseConfig";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref as databaseRef, push } from "firebase/database";

const MediaUpload = ({ chatId, senderId }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const uploadFile = async () => {
    if (!file) {
      setError("No file selected");
      return;
    }

    setUploading(true);
    setError("");

    try {
      // Creating a reference to the file in Firebase Storage
      const fileRef = storageRef(storage, `chats/${chatId}/${file.name}`);

      // Uploading the file to Firebase Storage
      await uploadBytes(fileRef, file);

      // Getting the download URL of the uploaded file
      const fileURL = await getDownloadURL(fileRef);

      // Saving the file URL to the message in the Firebase Realtime Database
      const messagesRef = databaseRef(database, `chats/${chatId}/messages`);
      await push(messagesRef, {
        senderId,
        mediaUrl: fileURL,
        timestamp: Date.now(),
      });

      // Clear the file input after successful upload
      setFile(null);
      setUploading(false);
    } catch (err) {
      setError("Failed to upload file");
      setUploading(false);
    }
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={uploadFile} disabled={uploading}>
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
};

MediaUpload.propTypes = {
  chatId: PropTypes.string.isRequired,
  senderId: PropTypes.string.isRequired,
};

export default MediaUpload;
