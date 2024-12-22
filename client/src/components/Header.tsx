import React from 'react'
import Logo from './Logo';
import { IoSearchOutline } from "react-icons/io5";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


function Header() {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchText(newValue);
    handleSearch(newValue);
  };

  const handleSearch = (value: string) => {
    navigate("/searchBlog", { state: { search: value } });
  }

  return (
    <div className='flex justify-between items-center w-full'>
      <div className="flex-shrink-0 w-48"> {/* Added container with fixed width */}
        <Logo/>
      </div>
      <div className='flex items-center gap-2 bg-white rounded-full w-96 px-4 py-2'>
        <span className='h-[25px] w-[25px] text-xl text-center'><IoSearchOutline /></span>
        <input 
          type="text" 
          placeholder='Search...' 
          className='outline-none w-28'
          value={searchText}
          onChange={handleInputChange}
          onClick={() => handleSearch(searchText)}
        />
      </div>
    </div>
  )
}export default Header;
