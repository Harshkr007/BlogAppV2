import React from 'react'
import Logo from './Logo';
import { IoSearchOutline } from "react-icons/io5";
import { useState } from 'react';

function Header() {
  const [searchText, setSearchText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchText(newValue);
    console.log(newValue);
  };

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
        />
      </div>
    </div>
  )
}
export default Header;
