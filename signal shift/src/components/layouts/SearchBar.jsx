import { IconButton, Input } from "@material-tailwind/react";

import { BiSearchAlt2, BiFilter } from "react-icons/bi";
import { selectSearchTerm, setSearchTerm } from "../../store/uiSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SearchBar() {
  const searchTerm = useSelector(selectSearchTerm);
  const dispatch = useDispatch();

  const handleSearchChange = (event) => {
    dispatch(setSearchTerm(event.target.value));
  };
  return (
    <div className="bg-white flex my-4 py-3 pl-4 items-center gap-3 h-14">
      <div className="bg-gray-100 flex items-center justify-stretch px-3 py-1 rounded-xl flex-grow">
        <Input
          icon={<BiSearchAlt2 className="text-lg  text-[#2563EB]" />}
          type="text"
          variant="standard"
          label="Search for a chat"
          size="md"
          value={searchTerm}
          onChange={handleSearchChange}
          className="text-sm focus:outline-none text-blue-gray-900 w-full"
        />
      </div>
      <div className="pr-5 pl-2">
        <IconButton variant="text" size="sm">
          <BiFilter className="text-lg text-[#2563EB]" />
        </IconButton>
      </div>
    </div>
  );
}
