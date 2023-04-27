import { createSlice } from '@reduxjs/toolkit'

const initialState = {}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        addUser(state, action) {
            return action.payload
        }
    }
})

export const { addUser } = userSlice.actions
export default userSlice.reducer


//THUNK

export function fetchUser(id, baseUrl) {
    return async function fetchUserThunk(dispatch) {
        try {
            const response = await fetch(`${baseUrl}/api/user/info/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include',
                mode: 'cors'
            })
            const json = await response.json()
            if (response.ok) {
                dispatch(addUser(json))
            }
        } catch (err) {
        }
    }
}