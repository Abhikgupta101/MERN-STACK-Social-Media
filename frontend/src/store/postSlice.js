import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const postSlice = createSlice({
    name: 'post',
    initialState,
    reducers: {
        addPost(state, action) {
            if (Array.isArray(action.payload)) return action.payload
            else state.unshift(action.payload)
            //action.payload is the new post data

        },
        updatePost(state, action) {
            if (typeof action.payload === 'object') {
                return state.map((item) => {
                    if (item._id === action.payload._id) return action.payload;
                    return item;
                })
            }
            else {
                return state.filter((item) => item._id !== action.payload)
            }
        },
        removePost(state, action) {
            return state.filter((item) => item.user !== action.payload)
        }
    }
})

export const { addPost, updatePost, removePost } = postSlice.actions
export default postSlice.reducer


//THUNK

export function fetchPosts(baseUrl) {
    return async function fetchPostThunk(dispatch) {
        try {
            const response = await fetch(`${baseUrl}/api/posts/followingPosts`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            })
            const json = await response.json()
            if (response.ok) {
                dispatch(addPost(json))
            }
        } catch (err) {
        }
    }
}