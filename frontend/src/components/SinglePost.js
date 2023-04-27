import React, { useEffect, useState } from 'react'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { removePost, updatePost } from '../store/postSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { updateUsers } from '../store/usersSlice';
const SinglePost = ({ postData }) => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const userId = localStorage.getItem('userId')

    const dispatch = useDispatch();
    const userData = useSelector(state => state.user)

    const [comment, setComment] = useState('')

    const navigate = useNavigate()
    const [likes, setLikes] = useState(false)
    const [likesCount, setLikesCount] = useState(0)
    const [save, setSave] = useState(false)
    const [comments, setComments] = useState([])
    const [follow, setFollow] = useState(false)

    const followUser = async (e) => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/user/follow/${postData.user}`, {
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
                dispatch(removePost(postData.user))
                dispatch(updateUsers(json.user))
            }
            setFollow(!follow)
        }

    }


    const addComment = async (e) => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/posts/comment/${postData._id}`, {
            method: 'POST',
            body: JSON.stringify({ comment }),
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (!response.ok) {
        }
        if (response.ok) {
            setComments(json.comments)
            // dispatch(updatePost(json))
            toast.success('A new comment is added')
            setComment('')
        }
    }

    const updateLikes = async (e) => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/posts/like/${postData._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (response.ok) {
            // dispatch(updatePost(json))
            if (json.message == "unliked") {
                toast.success('You have unliked a post')
                setLikes(false)
                setLikesCount(likesCount - 1)
            }
            else {
                toast.success('You have liked a post')
                setLikes(true)
                setLikesCount(likesCount + 1)
            }
        }
    }

    const updateSave = async (e) => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/posts/save/${postData._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (response.ok) {
            if (json.message == "unsaved") {
                toast.success('You have unsaved a post')
                setSave(false)
            }
            else {
                setSave(true)
                toast.success('You have saved a post')
            }
        }
    }

    const deletePost = async (e) => {
        e.preventDefault()
        const response = await fetch(`${baseUrl}/api/posts/delete/${postData._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            mode: 'cors'
        })
        const json = await response.json()

        if (response.ok) {
            dispatch(updatePost(json))
            toast.success('A post is deleted')
        }
    }

    useEffect(() => {
        if ((Object.keys(userData).length !== 0)) {
            if (userData.following.includes(postData.user)) {
                setFollow(true)
            }
            else {
                setFollow(false)
            }
        }
    }, [userData])

    useEffect(() => {
        if (postData.likes.includes(userId)) {
            setLikes(true)
        }
        setLikesCount(postData.likes.length)
        if (postData.saved_by.includes(userId)) {
            setSave(true)
        }
        setComments(postData.comments)
    }, [])

    return (
        postData !== null ? < div className='singlepost_cont'>
            <div className='singlepost_header'>
                <div style={{ display: 'flex', height: '100%', width: '40%', justifyContent: 'space-evenly', alignItems: 'center' }} >
                    <img className='profile_img' src={postData.userImage} style={{ cursor: 'pointer' }}
                        onClick={() => navigate(`/profile/${postData.user}`, { replace: true })} />
                    <div>{postData.profileName}</div>
                </div>
                <div style={{ display: 'flex', height: '100%', width: '40%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                    <div style={{ cursor: 'pointer' }} onClick={followUser}>
                        {
                            userId != postData.user ?
                                <div>
                                    {
                                        follow ? <p style={{ color: '#9bc1e4' }}>Unfollow</p> :
                                            <p style={{ color: 'rgb(0, 115, 255)' }}>Follow</p>
                                    }
                                </div> : null
                        }
                    </div>
                    {
                        userId == postData.user ?
                            <div onClick={deletePost}>
                                <DeleteIcon />
                            </div> : null
                    }

                </div>
            </div>
            <div className='singlepost_img'>
                <img style={{ width: '100%', height: '100%', objectFit: 'contain' }} src={postData.image} />
            </div>
            <div className='singlepost_footer'>
                <div style={{
                    display: 'flex', height: '25%', justifyContent: 'space-between', alignItems: 'center', overflow: 'hidden', marginLeft: '1%',
                    marginRight: '3%'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={updateLikes} >
                        {
                            likes ? <FavoriteIcon style={{ color: 'red' }} /> :
                                <FavoriteBorderIcon />
                        }
                        <p style={{ margin: '5px' }}>{likesCount} likes</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={updateSave}>
                        {
                            save ? <BookmarkIcon /> :
                                <BookmarkBorderIcon />
                        }
                    </div>
                </div>
                <div className='footer_comment_sec'>
                    <div className='comments_box'>
                        {
                            comments.slice(0).reverse().map((comment) => (
                                <div key={comment._id} style={{ display: 'flex' }}>
                                    <div style={{ fontWeight: 'bold', margin: '5px' }}>{comment.comment.user_name}</div>
                                    <div style={{ margin: '5px' }}>{comment.comment.text}</div>
                                </div>
                            ))
                        }
                    </div>
                    <div className='comments_cont'>
                        <input value={comment} type="text" placeholder="Add a comment..." onChange={(e) => setComment(e.target.value)}></input>
                        <div onClick={addComment}>Post</div>
                    </div>
                </div>
            </div>


        </div > : null
    )
}

export default SinglePost

