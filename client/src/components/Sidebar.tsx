import React, { useEffect } from "react";
import { RiHome4Fill } from "react-icons/ri";
import { MdAdd } from "react-icons/md";
import { MdModeEdit } from "react-icons/md";
import { MdLogout } from "react-icons/md";

import axios from "axios";

import {useDispatch , useSelector} from "react-redux";

import { logout } from "../store/user/userSlice";

import { baseURL } from "../utils/baseURL";


import toast from "react-hot-toast";

import { useNavigate,useLocation } from "react-router-dom";

function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  console.log("Hello this is user:: ",user);

  const [currPath, setCurrPath] = React.useState("/");

  const handleNavigate = (path: string) => {
    navigate(path);
  };

  const handleUserLogout = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/v1/user/logout`,
        {},
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      dispatch(logout())
      toast.success("Logout Successfully");
      navigate("/login");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    setCurrPath(location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex flex-col justify-between items-center w-full h-full bg-slate-200">
      <div className="flex flex-col flex-grow justify-start items-center w-full">
        <div 
        className={`flex w-full p-2 text-2xl font-bold hover:bg-slate-300 cursor-pointer ${
          currPath === "/" ? "bg-slate-300" : ""
        }`}
        onClick={() => handleNavigate("/")}
        
        >
          <span className="m-1 p-2">
            <RiHome4Fill />
          </span>
          <span className="p-2">Home</span>
        </div>
        <div  className={`flex w-full p-2 text-2xl font-bold hover:bg-slate-300 cursor-pointer ${
          currPath === "/createBlog" ? "bg-slate-300" : ""
        }`}
        onClick={() => handleNavigate("/createBlog")}>
          <span className="m-1 p-2">
            <MdAdd />
          </span>
          <span className="p-2">Add Blog</span>
        </div>
        <div  className={`flex w-full p-2 text-2xl font-bold hover:bg-slate-300 cursor-pointer ${
          (currPath === "/userBlog") || (currPath === "/editBlog/:id") ? "bg-slate-300" : ""
        }`}
        onClick={() => handleNavigate("/userBlog")}>
          <span className="m-1 p-2">
            <MdModeEdit />
          </span>
          <span className="p-2">Edit Blog</span>
        </div>
      </div>
      <div className={`flex items-center justify-between w-full p-4 border-t-2 border-slate-300 hover:bg-slate-300 cursor-pointer
        ${
          currPath === "/editUser" ? "bg-slate-300" : ""
        }`}
        onClick={() => handleNavigate("/editUser")}
        >
        <div className="flex items-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-white overflow-hidden ring-2 ring-blue-500 ring-offset-2">
              <img
                src={user?.avatar}
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          <div className="ml-3 font-semibold text-lg">{user?.userName}</div>
        </div>
        <div className="p-2 hover:bg-slate-400 rounded-full cursor-pointer transition-colors"
        onClick={() => handleUserLogout()}
        >
          <MdLogout className = "text-2xl" />
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
