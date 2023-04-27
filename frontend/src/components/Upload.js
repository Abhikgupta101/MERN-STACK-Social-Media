import React, { useEffect, useState } from 'react'
import { storage } from '../Firebase'
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useSelector, useDispatch } from 'react-redux';
import { addPost } from '../store/postSlice';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Upload = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL

    const dispatch = useDispatch();

    const upload = async (file) => {
        if (file == null) return
        const storageRef = ref(storage, `/socialmedia/${file.name}`);

        const uploadTask = uploadBytesResumable(storageRef, file);
        uploadTask.on('state_changed', fn1, fn2, fn3)

        function fn1(snapshot) {
            let progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        }

        function fn2(error) {
        }

        function fn3(error) {
            getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                const createPost = async () => {
                    const response = await fetch(`${baseUrl}/api/posts`, {
                        method: 'POST',
                        body: JSON.stringify({ image: url }),
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        mode: 'cors'
                    })
                    const json = await response.json()

                    if (!response.ok) {
                        toast.error(json.error)
                    }
                    if (response.ok) {
                        dispatch(addPost(json))
                        toast.success('A new post is created')
                    }

                }

                createPost()
            })
        }
    }

    return (
        < div className='links_icons'>
            <input style={{ display: 'none' }} type="file" id="file" accept='image/*' onChange={(e) => upload(e.target.files[0])}>
            </input>
            <label htmlFor="file" className='links_icons'>
                <AddPhotoAlternateIcon />
                <div>Upload</div>
            </label>
        </div >
    )
}

export default Upload