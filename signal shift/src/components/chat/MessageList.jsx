import PropTypes from "prop-types";
import MessageItem from "./MessageItem";

function MessageList({ messages }) {
  return (
    <div className="overflow-auto" style={{ height: "400px" }}>
      {messages.map((message, index) => (
        <MessageItem key={index} message={message} />
      ))}
    </div>
  );
}

MessageList.propTypes = {
  messages: PropTypes.array.isRequired,
};

export default MessageList;
