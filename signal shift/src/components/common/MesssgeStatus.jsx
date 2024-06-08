import PropTypes from "prop-types";
import { BsCheck, BsCheckAll } from "react-icons/bs";

function MesssgeStatus({ messsgeStatus }) {
  return (
    <>
      {messsgeStatus === "sent" && <BsCheck className="text-lg" />}
      {messsgeStatus === "delivered" && <BsCheckAll className="text-lg" />}
      {messsgeStatus === "read" && (
        <BsCheckAll className="text-lg text-[#ffb400]" />
      )}
    </>
  );
}

MesssgeStatus.propTypes = {
  messsgeStatus: PropTypes.string.isRequired,
};

export default MesssgeStatus;
