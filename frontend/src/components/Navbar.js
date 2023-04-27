import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import HomeIcon from '@mui/icons-material/Home';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import Upload from './Upload';
import { addPost } from '../store/postSlice';
import { addUsers } from '../store/usersSlice';
import { addUser } from '../store/userSlice';
import Search from './Search';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Navbar = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const userId = localStorage.getItem('userId')
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [userData, setUserData] = useState([])

    const updateUrl = (id) => {
        navigate(`/${id}`, { replace: true });
    }

    const logout = async () => {
        const response = await fetch(`${baseUrl}/api/user/logout`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (!response.ok) {
            toast.error(json.error);

        }
        if (response.ok) {
            toast.success('You have logged out successfully')
            localStorage.removeItem("userId");
            dispatch(addPost([]))
            dispatch(addUsers([]))
            dispatch(addUser({}))
            navigate(`/signin`, { replace: true });
        }
    }

    return (
        <div className='nav_container'>
            <div className='nav_logo'>
                <div onClick={() => navigate('/', { replace: true })}>beReal</div>
            </div>
            <Search />
            <div className='nav_links'>
                <div onClick={() => updateUrl('')} className='links' >
                    <div className='links_icons'>
                        <HomeIcon />
                        <div>Home</div>
                    </div>
                </div>
                <div onClick={() => navigate(`/profile/${userId}`, { replace: true })} className='links' >
                    <div className='links_icons'>
                        <AccountCircleIcon />
                        <div>Profile</div>
                    </div>
                </div>
                <div className='links' >
                    <div className='links_icons'>
                        <Upload userData={userData} />
                    </div>
                </div>
                <div onClick={logout}>
                    <div className='links_icons'>
                        <LogoutIcon onClick={logout} />
                        <div>Logout</div>
                    </div>
                </div>
            </div>
        </div >
    )
}

export default Navbar