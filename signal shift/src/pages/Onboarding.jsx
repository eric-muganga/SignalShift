import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Input,
  Card,
  CardBody,
  Typography,
  IconButton,
} from "@material-tailwind/react";

import { doc, updateDoc } from "firebase/firestore";
import { database } from "../firebaseConfig";
import Avatar from "../components/common/Avatar";
import AvatarIMG from "../assets/avatar.png";
import { IoPencil } from "react-icons/io5";
import Button from "../components/common/Button";
import Modal from "../components/common/Modal";
import mediaUpload from "../utils/upload";

function Onboarding() {
  const initialValues = {
    displayName: "",
    about: "",
    avatar: AvatarIMG,
  };

  const { userId } = useParams();
  const [userDetails, setUserDetails] = useState(initialValues);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (!userId) {
      setError("User ID is required");
      navigate("/login");
    }
  }, [userId, navigate]);

  function handleChange(event) {
    const { name, value } = event.target;
    setUserDetails({
      ...userDetails,
      [name]: value,
    });
  }

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

      if (userDetails.avatar && userDetails.avatar !== AvatarIMG) {
        const avatarFile = await fetch(userDetails.avatar).then((res) =>
          res.blob()
        );
        const fileName = `${userDetails.displayName}`;
        const fileRef = `avatars/${userId}/${fileName}`;

        avatarUrl = await mediaUpload(avatarFile, fileRef);
      }

      await updateDoc(doc(database, "users", userId), {
        displayName: userDetails.displayName,
        about: userDetails.about,
        avatar: avatarUrl || userDetails.avatar,
      });

      navigate("/main");
    } catch (err) {
      console.error("Onboarding error:", err);
      setError(err.message || "Failed to complete onboarding");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card className="w-full mt-24 max-w-md">
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
            <div className="mb-4 relative">
              <Avatar
                size="xl"
                image={userDetails.avatar}
                setImage={setAvatar}
              />
              <IconButton
                variant="text"
                title="Change photo"
                className="absolute -bottom-3 left-0 right-0 m-auto p-[.35rem] rounded-full"
                onClick={() => setModalOpen(true)}
              >
                <IoPencil className="text-xl" />
              </IconButton>
            </div>
            {modalOpen && (
              <Modal
                updateAvatar={setAvatar}
                closeModal={() => setModalOpen(false)}
              />
            )}
            <div className="mb-4">
              <Input
                type="text"
                label="Display Name"
                color="indigo"
                name="displayName"
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
                name="about"
                value={userDetails.about}
                onChange={handleChange}
                required
              />
            </div>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Complete Profile"}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}

export default Onboarding;
