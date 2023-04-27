import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import Navbar from '../components/Navbar'
import GridOnIcon from '@mui/icons-material/GridOn';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ShowUsersList from '../components/ShowUsersList'
import ClearIcon from '@mui/icons-material/Clear';
import SinglePost from '../components/SinglePost';
import { useDispatch } from 'react-redux';
import { fetchPosts } from '../store/postSlice';
const Profile = () => {
  const baseUrl = process.env.REACT_APP_BASE_URL
  const { id } = useParams()
  const profileId = id

  const userId = localStorage.getItem('userId')
  const [postInfoId, setPostInfoId] = useState('')
  const [showPostInfo, setShowPostInfo] = useState(false)
  const [userData, setUserData] = useState([])

  const [showPosts, setShowPosts] = useState(true)
  const [showSavedPosts, setShowSavedPosts] = useState(false)

  const [follower, setFollower] = useState(false)
  const [following, setFollowing] = useState(false)

  const dispatch = useDispatch();
  const profile = true;

  const navigate = useNavigate()


  const postInfo = (id) => {
    setPostInfoId(id)
    setShowPostInfo(true)
  }

  const showFollowers = () => {
    if (userData[0].followers.length != 0) {
      setFollower(true)
      setFollowing(false)
    }

  }

  const showFollowing = () => {
    if (!userData[0].following.length == 0) {
      setFollowing(true)
      setFollower(false)
    }


  }

  const cancel = () => {
    setFollower(false)
    setFollowing(false)
  }


  useEffect(() => {
    const fetchProfileUser = async () => {
      try {
        const response = await fetch(`${baseUrl}/api/user/info/${profileId}`, {
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
  }, [profileId, follower, following, showPostInfo])

  useEffect(() => {
    setShowPostInfo(false)
    setShowPosts(true)
    setShowSavedPosts(false)
    if (profileId !== null) {
      dispatch(fetchPosts(baseUrl))
    }

  }, [profileId])
  return (
    userId ?
      <div>
        {!follower && !following ?
          <div>
            < Navbar />
            {
              userData.length == 1 ?

                <div style={{ display: 'flex', height: '10vh', width: '100%', justifyContent: 'space-evenly', alignItems: 'center', marginTop: '10vh', backgroundColor: 'black', color: 'white', cursor: 'pointer' }}>
                  {/* <img className='profile_img' src={userData[0].avatar} /> */}
                  <div>{userData[0].name}</div>
                  <div>{userData[0].posts.length} Posts</div>
                  <div onClick={showFollowers}>{userData[0].followers.length} Followers</div>
                  <div onClick={showFollowing}>{userData[0].following.length} Following</div>
                </div> : null
            }
            <div className='profile_dashboard'>
              <div onClick={() => {
                setShowPosts(true)
                setShowSavedPosts(false)
              }} style={showPosts ? { color: 'white' } : { color: 'grey' }}>POSTS <GridOnIcon /></div>
              <div onClick={() => {
                setShowPosts(false)
                setShowSavedPosts(true)
              }} style={showSavedPosts ? { color: 'white' } : { color: 'grey' }}
              >SAVED <BookmarkBorderIcon /></div>
            </div>
            {showPosts && userData.length == 1 ?
              < div>
                {
                  userData[0].posts.length != 0 ?
                    < div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%', marginTop: '5vh', justifyContent: 'center' }} >
                      {
                        userData[0].posts.map((postData) => (
                          <div key={postData._id}>
                            <div style={{
                              width: '240px', height: '240px', marginLeft: '1.5px', marginRight: "1.5px", marginTop: '2.5px', overflow: 'hidden'
                            }} onClick={() => postInfo(postData._id)}>
                              <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={postData.image} />
                            </div>
                            {showPostInfo == true && postInfoId == postData._id ?
                              <div className='postInfo'>
                                <div className='postInfo_cancel_btn' onClick={() => setShowPostInfo(false)}>
                                  <ClearIcon style={{ fontSize: '30px' }} />
                                </div>
                                <SinglePost postData={postData} />
                              </div> : null
                            }
                          </div>
                        ))
                      }
                    </div> :
                    < div style={{ display: 'flex', width: '100%', height: '100%', marginTop: '5vh', justifyContent: 'center' }} >
                      <p style={{ fontSize: '50px', color: 'white' }}>No Posts Yet</p>
                    </div>
                }
              </div>
              : null
            }

            {
              showSavedPosts && userData.length == 1 ?
                < div>
                  {
                    userData[0].saved.length != 0 ?
                      < div style={{ display: 'flex', flexWrap: 'wrap', width: '100%', height: '100%', marginTop: '5vh', justifyContent: 'center' }} >
                        {
                          userData[0].saved.map((postData) => (
                            <div key={postData._id}>
                              <div style={{
                                width: '240px', height: '240px', marginLeft: '1.5px', marginRight: "1.5px", marginTop: '2.5px', overflow: 'hidden'
                              }} onClick={() => postInfo(postData._id)}>
                                <img style={{ width: '100%', height: '100%', objectFit: 'cover' }} src={postData.image} />
                              </div>
                              {showPostInfo == true && postInfoId == postData._id ?
                                <div className='postInfo'>
                                  <div className='postInfo_cancel_btn' onClick={() => setShowPostInfo(false)}>
                                    <ClearIcon style={{ fontSize: '30px' }} />
                                  </div>
                                  <SinglePost postData={postData} />
                                </div>
                                : null
                              }
                            </div>
                          ))
                        }
                      </div> :
                      < div style={{ display: 'flex', width: '100%', height: '100%', marginTop: '5vh', justifyContent: 'center' }} >
                        <p style={{ fontSize: '50px', color: 'white' }}>No Saved Posts</p>
                      </div>
                  }
                </div> : null
            }
          </div > :

          (
            follower ?
              <div className='users_list'>
                <div className='cancel_btn' onClick={cancel}>
                  <ClearIcon style={{ fontSize: '30px' }} />
                </div>
                {
                  userData[0].followers.map((user) => (
                    <ShowUsersList key={user} user={user} follower={follower} profile={profile} profileId={profileId}

                    />
                  ))
                }
              </div> :
              <div className='users_list'>
                <div className='cancel_btn' onClick={cancel}>
                  <ClearIcon style={{ fontSize: '30px' }} />
                </div>
                {
                  userData[0].following.map((user) => (
                    < ShowUsersList key={user} user={user} follower={follower} profile={profile} profileId={profileId}
                    />
                  ))
                }
              </div >)}
      </div > : <Navigate to="/signin" />
  )
}

export default Profile