import PropTypes from "prop-types";
import { Avatar as Av } from "@material-tailwind/react";
import { useState } from "react";
import { FaCamera } from "react-icons/fa";

function Avatar({ size, image, setImage }) {
  const [hover, setHover] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  let content;
  if (size == "xl") {
    content = (
      <div
        className="relative cursor-pointer z-0"
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        onClick={() => document.getElementById("avatar-upload").click()}
      >
        <div
          className={`z-10  bg-blue-gray-200 bg-blend-overlay h-60 w-60 absolute top-0 left-0 flex items-center rounded-full justify-center flex-col text-center gap-2
          ${hover ? "visible" : "hidden"}`}
        >
          <FaCamera className="text-2xl" id="context-opener" />
          <span>
            Change <br /> profile photo
          </span>
        </div>

        <Av size="xl" src={image} alt="avatar" />
        <input
          type="file"
          id="avatar-upload"
          accept="image/*"
          style={{ display: "none" }}
          onChange={handleImageChange}
        />
      </div>
    );
  } else {
    content = <Av size={size} src={image} alt="avatar" />;
  }
  return <div className="flex items-center justify-center">{content}</div>;
}

Avatar.propTypes = {
  size: PropTypes.string.isRequired,
  image: PropTypes.image.isRequired,
  setImage: PropTypes.func,
};

export default Avatar;
