import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { removeUsers } from "../store/usersSlice";
import { addPost } from "../store/postSlice";
import { addUser } from "../store/userSlice";
const Users = ({ user }) => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const userId = localStorage.getItem('userId')
    const navigate = useNavigate();

    const [isFollowing, setIsFollowing] = useState(false)
    const dispatch = useDispatch();
    const follow_user = async (e) => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/user/follow/${user._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (response.ok) {
            if (isFollowing) {
                toast.success('You have unfollowed a user')
            }
            else {
                toast.success('You have started following a user')
                dispatch(removeUsers(user._id))
                dispatch(addPost(json.posts))
                dispatch(addUser(json.data))
            }
            setIsFollowing(!isFollowing)

        }
    }

    useEffect(() => {
        if (user.followers.includes(userId)) {
            setIsFollowing(true)
        }
        else {
            setIsFollowing(false)
        }
    }, [])

    return (
        <div style={{
            marginTop: "5px", marginBottom: "5px", display: "flex", width: "100% ", height: "7vh", color: 'white', justifyContent: 'space-around', alignItems: 'center'
        }}>
            <img className='profile_img' src={user.avatar} style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/profile/${user._id}`, { replace: true })}
            />
            <div>{user.name}</div>
            {userId != user._id ? <div style={{ display: "flex", alignItems: "center", justifyContent: "space-around", height: "100%", cursor: 'pointer' }} onClick={follow_user}>
                {
                    isFollowing ? <div style={{ color: '#9bc1e4' }}>Unfollow</div> : <div style={{ color: 'rgb(0, 115, 255)' }}>Follow</div>
                }
            </div> : <div style={{ color: 'black' }}>Follow</div>}
        </div >
    )
}

export default Users