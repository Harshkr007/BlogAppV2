import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../utils/baseURL.js";
import toast from "react-hot-toast";

function Register() {
  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm();

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("userName", data.username);
    formData.append("email", data.email);
    formData.append("password", data.password);
    if (data.profileImage[0]) {
      formData.append("avatar", data.profileImage[0]);
    }

    console.log(formData);

    setLoading(true);
    try {
      const res = await axios.post(`${baseURL}/api/v1/user/register`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setLoading(false);
      console.log(res.data);
      if (res.data.statusCode === 201) {
        toast.success(res.data.message);
        navigate("/login");
      } else {
        setMessage(res.data.message);
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err.response?.data?.message || "Registration failed");
      setMessage(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Create Account</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username:
            </label>
            <input
              {...register("username", { required: true })}
              type="text"
              placeholder="Username"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Email:
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              placeholder="Email Address"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password:
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Profile Image:
            </label>
            <input
              {...register("profileImage")}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="mt-2 w-20 h-20 object-cover rounded"
              />
            )}
          </div>

          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold px-8 py-2 rounded focus:outline-none"
            >
              {loading ? "Registering..." : "Register"}
            </button>
          </div>
        </form>

        <p className="align-baseline font-medium mt-4 text-sm">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500">
            Login
          </Link>
        </p>
        <p className="mt-5 text-center text-gray-500 text-xs">
          All rights are reserved
        </p>
      </div>
    </div>
  );
}

export default Register;
