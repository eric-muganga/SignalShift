import PropTypes from "prop-types";
import { Avatar as Av } from "@material-tailwind/react";
import "react-image-crop/dist/ReactCrop.css";

function Avatar({ size, image, setImage }) {
  // Handle the image input change event
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result); // Set the source of the image to be cropped
      };
      reader.readAsDataURL(file); // Read the image file as a data URL
    }
  };

  let content;
  if (size === "xl") {
    // Content for the extra large avatar with hover effect and file input
    content = (
      <div>
        <Av size="xl" src={image} alt="avatar" />

        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          style={{ display: "none" }}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-1 file:px-2 file:rounded-full file:border-0 file:bg-gray-700 file:text-light-blue-300 hover:file:bg-gray-700"
          onChange={handleImageChange}
        />
      </div>
    );
  } else {
    // Content for smaller avatars without hover effect
    content = <Av size={size} src={image} alt="avatar" />;
  }

  return (
    <div className="flex items-center justify-center flex-col">{content}</div>
  );
}

Avatar.propTypes = {
  size: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  setImage: PropTypes.func.isRequired,
};

export default Avatar;
