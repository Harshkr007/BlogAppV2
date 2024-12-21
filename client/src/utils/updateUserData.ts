import { setCredentials } from "../store/user/userSlice";
import { useDispatch } from 'react-redux';

interface UpdatedUser{
      _id: string;
      userName: string;
      email: string;
      avatar: string;
      accessToken: string;
      createdAt: string;
      updatedAt: string;
}

export function useUpdateUserData() {
    const dispatch = useDispatch();
  
    return (updatedUser: UpdatedUser) => {
      try {
        dispatch(setCredentials({
          user: updatedUser,
          accessToken: updatedUser.accessToken,
        }));
      } catch (error) {
        console.log('Error updating access token:', error);
      }
    };
}