import { IconButton, Input } from "@material-tailwind/react";
import { useEffect, useState } from "react";
import { BiArrowBack, BiSearchAlt2 } from "react-icons/bi";
import { collection, getDocs, query, where } from "firebase/firestore";
import { database } from "../../firebaseConfig";
import { useDispatch, useSelector } from "react-redux";
import ChatListItem from "./ChatListItem";
import { hideContactList } from "../../store/uiSlice";

import { selectUserProfile } from "../../store/userSlice";

function groupContactsAlphabetically(contacts) {
  return contacts.reduce((groups, contact) => {
    const firstLetter = contact.displayName[0].toUpperCase();
    if (!groups[firstLetter]) {
      groups[firstLetter] = [];
    }
    groups[firstLetter].push(contact);
    return groups;
  }, {});
}

function ContactList() {
  const dispatch = useDispatch();
  const currentUser = useSelector(selectUserProfile);
  const [allContacts, setAllContacts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // to implement the fetching of contacts for the firebase database
  useEffect(() => {
    const getContacts = async () => {
      try {
        const usersCollection = collection(database, "users");
        const q = query(usersCollection, where("id", "!=", currentUser.id));
        const contactsSnapshot = await getDocs(q);
        const contactsList = contactsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllContacts(contactsList);
      } catch (error) {
        setError("Error fetching contacts: " + error.message);
      } finally {
        setLoading(false);
      }
    };

    getContacts();
  }, [currentUser.id]);

  const filteredContacts = allContacts?.filter((contact) =>
    contact.displayName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedContacts = groupContactsAlphabetically(filteredContacts);

  return (
    <div className="h-full flex flex-col">
      <div className="h-24 flex items-end px-3 py-4 mx-2">
        <div className="flex items-center gap-12 text-gray-900">
          <IconButton
            onClick={() => dispatch(hideContactList())}
            variant="text"
          >
            <BiArrowBack
              className="text-xl"
              onClick={() => dispatch(hideContactList())}
            />
          </IconButton>
          <span>New Chat</span>
        </div>
      </div>
      <div className="bg-gray-100 flex items-center justify-stretch px-3 py-1 mx-4">
        <Input
          icon={<BiSearchAlt2 className="text-lg  text-[#2563EB]" />}
          type="text"
          variant="standard"
          label="Search for a contact"
          size="md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-sm focus:outline-none text-blue-gray-900 w-full"
        />
      </div>
      <div className="flex-grow overflow-auto custom-scrollbar px-3 py-2 ml-2">
        {loading ? (
          <p>Loading contacts...</p>
        ) : error ? (
          <p>{error}</p>
        ) : filteredContacts.length > 0 ? (
          Object.keys(groupedContacts).map((letter) => (
            <div key={letter}>
              <h2 className="font-bold mt-4 mb-2">{letter}</h2>
              {groupedContacts[letter].map((contact) => (
                <ChatListItem
                  data={contact}
                  isContactPage={true}
                  key={contact.id}
                />
              ))}
            </div>
          ))
        ) : (
          <p>No contacts available</p>
        )}
      </div>
    </div>
  );
}

ContactList.propTypes = {};

export default ContactList;
