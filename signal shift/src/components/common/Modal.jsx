import { useEffect } from "react";
import { IconButton } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { IoClose } from "react-icons/io5";
import ImageCropper from "./ImageCropper";

function Modal({ updateAvatar, closeModal }) {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") closeModal();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [closeModal]);

  return (
    <div
      className="fixed inset-0 z-10 overflow-y-auto"
      aria-labelledby="crop-image-dialog"
      role="dialog"
      aria-modal="true"
    >
      <div className="fixed inset-0 bg-gray-100 bg-opacity-75 transition-opacity backdrop-blur-sm"></div>
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-gray-300 text-slate-100 rounded-2xl shadow-xl relative p-5 w-full max-w-lg mx-auto flex  flex-col">
          <IconButton
            variant="text"
            title="Close menu"
            className="absolute top-2 right-2"
            onClick={closeModal}
          >
            <IoClose className="text-xl" />
          </IconButton>
          <ImageCropper updateAvatar={updateAvatar} closeModal={closeModal} />
        </div>
      </div>
    </div>
  );
}

Modal.propTypes = {
  closeModal: PropTypes.func.isRequired,
  updateAvatar: PropTypes.func.isRequired,
};

export default Modal;
