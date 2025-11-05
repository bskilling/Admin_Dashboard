import { logout, setAuthentication, setUser } from '@/utils/AuthUser';
import { PayloadAction, createSlice } from '@reduxjs/toolkit';

const initialState = {
  token: '',
  user: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    userLoggedIn: (state, action: PayloadAction<{ accessToken: string; user: string }>) => {
      state.token = action.payload.accessToken;
      state.user = action.payload.user;
      setAuthentication(action.payload.accessToken);
      setUser(action.payload.user);
    },
    userLoggedOut: state => {
      state.token = '';
      state.user = '';
      logout();
    },
  },
});
export const { userLoggedIn, userLoggedOut } = authSlice.actions;

export default authSlice.reducer;
