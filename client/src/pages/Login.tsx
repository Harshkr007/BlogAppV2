import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setCredentials } from "../store/user/userSlice.js";
import axios from "axios";
import { baseURL } from "../utils/baseURL.js";
import toast from "react-hot-toast";
import Loading from "../components/Loader/Loading.tsx";

function Login() {
  const {
    register,
    handleSubmit,
    formState: {},
  } = useForm();

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (data: any) => {
    try {
      const { email, password } = data;

     if (!email || !password) {
        setMessage("Please enter email and password");
        return;
      }

      setLoading(true);
      const res = await axios.post(`${baseURL}/api/v1/user/login`, {
        userNameOrEmail: email,
        password: password,
      },{
        withCredentials: true,
      });
      setLoading(false);
      console.log(res.data);
      if (res.data.statusCode === 200) {
        toast.success(res.data.message);
        dispatch(
          setCredentials({
            user: res.data.data.user,
            accessToken: res.data.data.user.accessToken,
          })
        );
        navigate("/");
      } else {
        toast.error(res.data.message);
        setMessage(res.data.message);
        console.log(message);
      }
    } catch (err: any) {
      setLoading(false);
      toast.error(err?.response?.data?.message || "Login failed");
      setMessage(err?.response?.data?.message );
      console.log(message);
    }
  };
  return (
    <div className="h-[calc(100vh-120px)] flex justify-center items-center">
      {loading && <Loading />}
      <div className="w-full max-w-sm mx-auto bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <h2 className="text-xl font-semibold mb-4">Plese Login</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Email:
            </label>
            <input
              {...register("email", { required: true })}
              type="email"
              name="email"
              id="email"
              placeholder="Email Address"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
              Password:
            </label>
            <input
              {...register("password", { required: true })}
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              className="shadow appearance-none border rounded w-full py-2 px-3 leading-tight focus:outline-none focus:shadow"
            />
          </div>
          {message && (
            <p className="text-red-500 text-xs italic mb-3">{message}</p>
          )}
          <div>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700  text-white font-bold px-8 py-2 rounded focus:outline-none"
            >
              Login
            </button>
          </div>
        </form>
        <p className="align-baseline font-medium mt-4 text-sm">
          Haven't an account?Please
          <Link to="/register" className="text-blue-500">
            Register
          </Link>
        </p>
        <p className="mt-5 text-center text-gray-500 text-xs ">
          All rights are reserved
        </p>
      </div>
    </div>
  );
}

export default Login;
