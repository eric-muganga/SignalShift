import PropTypes from "prop-types";

function ChatContainer(props) {
  return (
    <div className="h-[80vh] w-full relative flex-grow overflow-auto custom-scrollbar">
      <div className="bg-fixed h-full w-full opacity-5 fixed  left-0 top-0 z-0">
        <div className="flex w-full">
          <div className="flex flex-col justify-end w-full gap-1 overflow-auto"></div>
        </div>
      </div>
    </div>
  );
}

ChatContainer.propTypes = {};

export default ChatContainer;
