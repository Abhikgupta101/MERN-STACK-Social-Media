import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { addUser } from '../store/userSlice';
import { removeUsers, updateUsers } from '../store/usersSlice';
import { addPost, removePost } from '../store/postSlice';

const ShowUsersList = ({ user, follower, profile, profileId }) => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const mainUserData = useSelector(state => state.user)
    const [userData, setUserData] = useState([])
    const mainUser = localStorage.getItem('userId')
    const dispatch = useDispatch()
    const [visible, setVisible] = useState(true)

    const follow_user = async (e) => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/user/follow/${user}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (response.ok) {
            if (!json.following) {
                toast.success('You have unfollowed a user')
                dispatch(removePost(user))
                dispatch(updateUsers(json.user))
                dispatch(addUser(json.data))
            }
            else {
                toast.success('You have started following a user')
                dispatch(removeUsers(user))
                dispatch(addPost(json.posts))
                dispatch(addUser(json.data))
            }
            setVisible(false)
        }
    }

    useEffect(() => {
        const fetchProfileUser = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/user/info/${user}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    mode: 'cors'
                })
                const json = await response.json()
                if (response.ok) {
                    setUserData([json])
                }
            }
            catch (err) {
            }
        }
        if (profileId !== null) {
            fetchProfileUser()
        }
    }, [profileId])

    return (
        userData.length == 1 ?
            <div style={{ display: 'flex', height: '10vh', justifyContent: 'space-around', alignItems: 'center', color: 'white' }}>
                <img className='profile_img' src={userData[0].avatar} />
                <div>{userData[0].name}</div>
                {mainUser !== user ?
                    < div onClick={follow_user} style={{ cursor: 'pointer' }}>
                        {mainUserData.following.includes(user) ? <p style={{ color: '#9bc1e4' }}>Unfollow</p> : <p style={{ color: 'blue' }}>Follow</p>}
                    </div> : null
                }
            </div > : null
    )
}

export default ShowUsersList