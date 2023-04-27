import { configureStore } from '@reduxjs/toolkit'
import postReducer from './postSlice'
import userReducer from './userSlice';
import usersReducer from './usersSlice'
import searchReducer from './searchSlice'

export const store = configureStore({
    reducer: {
        post: postReducer,
        user: userReducer,
        users: usersReducer,
        search: searchReducer,
    },
})

export default store;