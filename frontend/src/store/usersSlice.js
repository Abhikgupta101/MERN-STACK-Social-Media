import { createSlice } from '@reduxjs/toolkit'
const initialState = []

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        addUsers(state, action) {
            return action.payload
        },
        updateUsers(state, action) {
            state.unshift(action.payload)
        },
        removeUsers(state, action) {
            return state.filter((item) => item._id !== action.payload)
        }
    }
})

export const { addUsers, updateUsers, removeUsers } = usersSlice.actions
export default usersSlice.reducer


//THUNK

export function fetchUsers(baseUrl) {
    return async function fetchUsersThunk(dispatch) {
        try {
            const response = await fetch(`${baseUrl}/api/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            })
            const json = await response.json()
            if (response.ok) {
                dispatch(addUsers(json))
            }
        } catch (err) {
        }
    }
}