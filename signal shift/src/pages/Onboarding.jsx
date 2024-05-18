import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Input, Card, CardBody, Typography } from "@material-tailwind/react";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { ref as databaseRef, set } from "firebase/database";
import { storage, database } from "../firebaseConfig";
import Avatar from "../components/common/Avatar";

import Button from "../components/common/Button";

function Onboarding() {
  // initial state for the from
  const initialValues = {
    displayName: "",
    about: "",
    avatar: "",
  };

  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(initialValues);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  // handling input change
  function handleChange(event) {
    const { name, value } = event.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  }

  // Handling avatar change
  function setAvatar(image) {
    setUserDetails((prevDetails) => ({
      ...prevDetails,
      avatar: image,
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setUploading(true);

    try {
      let avatarUrl = "";

      if (userDetails.avatar) {
        const avatarFile = await fetch(userDetails.avatar).then((res) =>
          res.blob()
        );
        const avatarRef = storageRef(
          storage,
          `avatars/${userId}/${avatarFile.name}`
        );
        await uploadBytes(avatarRef, avatarFile);
        avatarUrl = await getDownloadURL(avatarRef);
      }

      await set(databaseRef(database, `users/${userId}`), {
        displayName: userDetails.displayName,
        about: userDetails.about,
        avatarUrl,
      });

      navigate("/main");
    } catch {
      setError("Failed to complete onboarding");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardBody>
          <Typography
            variant="h5"
            color="blue-gray"
            className="mb-4 text-center"
          >
            Complete Your Profile
          </Typography>
          {error && (
            <Typography variant="small" color="red" className="mb-4">
              {error}
            </Typography>
          )}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <Avatar
                size="xl"
                image={userDetails.avatar}
                setImage={setAvatar}
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                label="Display Name"
                color="indigo"
                value={userDetails.displayName}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-4">
              <Input
                type="text"
                label="About"
                color="indigo"
                value={userDetails.about}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit">
              {uploading ? "Uploading..." : "Complete Profile"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default Onboarding;
