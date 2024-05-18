import { IconButton, Input } from "@material-tailwind/react";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";

function ContactList(props) {
  const [allContacts, setAllContacts] = useState([]);

  // to implement the fetching of contacts for the firebase database
  useEffect(() => {
    const getContacts = () => {};

    getContacts();
  }, []);
  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4">
        <div className="flex items-center gap-12 text-white">
          {/* to implement going back to the ChatsList */}
          <IconButton onClick={""}>
            <BiArrowBack className="text-xl" />
          </IconButton>
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-gray-100 flex items-center justify-stretch px-3 py-1 rounded-xl flex-grow">
        <Input
          icon={<BiSearchAlt2 className="text-lg  text-[#2563EB]" />}
          type="text"
          variant="standard"
          label="Search for a chat"
          size="md"
          className="text-sm focus:outline-none text-blue-gray-900 w-full"
        />
      </div>
    </div>
  );
}

ContactList.propTypes = {};

export default ContactList;
