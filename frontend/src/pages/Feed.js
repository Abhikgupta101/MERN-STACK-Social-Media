import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar'
import SinglePost from '../components/SinglePost';
import { fetchPosts } from '../store/postSlice';
import { fetchUser } from '../store/userSlice';
import { fetchUsers } from '../store/usersSlice';
import Users from '../components/Users';
const Feed = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const userId = localStorage.getItem('userId')

    const dispatch = useDispatch();
    const usersData = useSelector(state => state.users)
    const posts = useSelector(state => state.post)

    // fetching single user Data
    useEffect(() => {
        dispatch(fetchUser(userId, baseUrl))
    }, [userId])

    //fetching all users

    useEffect(() => {
        if (userId !== null) {
            dispatch(fetchUsers(baseUrl))
        }
    }, [])

    //fetching all posts

    useEffect(() => {
        if (userId !== null) {
            dispatch(fetchPosts(baseUrl))
        }

    }, [userId])

    return (
        userId ? <div>
            <Navbar />
            <div className='feed'>
                <div className='follow_suggestion'>
                    <div style={{ marginLeft: '5vh', color: 'grey', fontWeight: 'bold' }}>Suggestions For You</div>

                    {
                        usersData.map((user) => (
                            user._id !== userId ?
                                <Users key={user._id} user={user} /> : null
                        ))
                    }
                </div>
                <div className='feed_singlepost'>
                    {
                        posts !== null ?
                            <div>
                                {
                                    posts.map((postData) => (
                                        <SinglePost key={postData._id} postData={postData} />
                                    ))
                                }
                            </div>
                            : null
                    }
                </div>
            </div>
        </div> : <Navigate to="/signin" />
    )
}

export default Feed