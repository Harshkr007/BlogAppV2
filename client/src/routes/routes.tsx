import { createBrowserRouter } from "react-router-dom";
import App from "../App.tsx";
import Login from "../pages/Login.tsx";
import Register from "../pages/Register.tsx";
import Home from "../pages/Home.tsx";
import BlogPage from "../components/MainComponent/BlogPage.tsx";
import EditBlog from "../components/MainComponent/EditBlog.tsx";
import AddBlog from "../components/MainComponent/AddBlog.tsx";
import EditUserInfo from "../components/MainComponent/EditUserInfo.tsx";
import SearchBlog from "../components/MainComponent/SearchBlog.tsx";
import UserBlogs from "../components/MainComponent/UserBlogs.tsx";
import CommentPage from "../components/MainComponent/CommentPage.tsx";



const router = createBrowserRouter([
  {
    path: "/",
    element:<App/>,
    children:[
      {
        path: "/",
        element:<Home/>,
        children:[
          {
            path: "/",
            element:<BlogPage/>,
          },
          {
            path: "/editBlog/:id",
            element:<EditBlog/>,
          },
          {
            path: "/createBlog",
            element:<AddBlog/>,
          },
          {
            path: "/editUser",
            element:<EditUserInfo/>,
          },
          {
            path: "/searchBlog",
            element:<SearchBlog/>,
          },
          {
            path: "/userBlog",
            element:<UserBlogs/>,
          },
          {
            path: "/comment/:blogId",
            element:<CommentPage/>,
          }
        ]
      },
      {
        path: "/login",
        element:<Login/>,
      },
      {
        path: "/register",
        element:<Register/>,
      }
    ]
  },
]);

export default router;