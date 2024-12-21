import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../../store/user/userSlice";
import { baseURL } from "../../utils/baseURL";
import axios from "axios";
import toast from "react-hot-toast";
//may required to use the updateAccesssToken function

function EditUserInfo() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state: any) => state.user.user);
  console.log(user);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [changePassword, setChangePassword] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleChangePassword = async ({
    oldPassword,
    newPassword,
    confirmPassword,
  }: {
    oldPassword: string;
    newPassword: string;
    confirmPassword: string;
  }) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/v1/user/update-password`,
        {
          oldPassword,
          newPassword,
          confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Password Updated Successfully");
      return response.data;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error?.message);
      } else {
        console.log("An unknown error occurred");
      }
      toast.error("Failed to update the Password");
      console.log(error)
      navigate("/");
    }
  };

  const handleChengeUserInfo = async (data: any) => {
    try {
      const response = await axios.put(
        `${baseURL}/api/v1/user/update`,
        {
          email: data.email,
          userName: data.userName,
          avatar: data.avatar
        },
        {
          withCredentials: true,
        }
      );
      console.log(response.data);
      dispatch(setCredentials({
        user: response.data.data.user,
        accessToken: response.data.newToken || user.accessToken,
      }));
      toast.success("User Info Updated Successfully");
      navigate("/");
    } catch (error) {
      if (error instanceof Error) {
        console.log(error?.message);
      } else {
        console.log("An unknown error occurred");
      }
      toast.error("Failed to update the User Info");
      navigate("/");
    }
    }
  

  const onSubmit = (data: any) => {
    console.log(data);
    try {
      if(changePassword){

        if(data.newPassword !== data.confirmPassword){
          toast.error("Password and Confirm Password do not match");
          navigate("/");
        }

        handleChangePassword({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        });
      }
      handleChengeUserInfo({email: data.email, userName: data.userName, avatar: data.avatar[0]});
    } catch (error) {
      console.log(error);
    }
    
  };

  return (
    <div className="h-full p-6">
      <div className="h-full border border-gray-900 rounded-lg p-8 flex flex-col">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 flex-grow"
        >
          {/* First Section - User Info */}
          <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold">Username</label>
              <input
                {...register("userName")}
                type="text"
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter username"
                defaultValue={user.userName}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-lg font-semibold">Email</label>
              <input
                {...register("email")}
                type="email"
                className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="Enter email"
                defaultValue={user.email}
              />
            </div>
          </div>

          {/* Password Change Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="changePassword"
              checked={changePassword}
              onChange={(e) => setChangePassword(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="changePassword" className="text-lg font-semibold">
              Change Password
            </label>
          </div>

          {/* Second Section - Password Fields */}
          {changePassword && (
            <div className="grid grid-cols-3 gap-6">
              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold">Old Password</label>
                <input
                  {...register("oldPassword")}
                  type="password"
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter old password"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold">New Password</label>
                <input
                  {...register("newPassword")}
                  type="password"
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Enter new password"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-lg font-semibold">
                  Confirm Password
                </label>
                <input
                  {...register("confirmPassword")}
                  type="password"
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                  placeholder="Confirm new password"
                />
              </div>
            </div>
          )}

          {/* Third Section - Avatar */}
          <div className="flex flex-col gap-2">
            <label className="text-lg font-semibold">Profile Picture</label>
            <div className="flex gap-8 items-start justify-between">
              <div className="w-1/3">
                <input
                  {...register("avatar")}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 w-full"
                />
              </div>
              {imagePreview && (
                <div className="w-64 h-64 rounded-lg overflow-hidden border flex-shrink-0">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Fourth Section - Buttons */}
          <div className="flex gap-4 mt-auto justify-end">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors cursor-pointer font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-300 rounded-lg hover:bg-blue-400 transition-colors cursor-pointer font-semibold"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditUserInfo;
