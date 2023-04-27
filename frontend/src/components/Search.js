import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import Users from './Users';
import { useDispatch, useSelector } from 'react-redux';

const Search = () => {
    const baseUrl = process.env.REACT_APP_BASE_URL
    const [data, setData] = useState([])
    const [search, setSearch] = useState('')

    useEffect(() => {
        const filterUsers = async () => {
            try {
                const response = await fetch(`${baseUrl}/api/user/search?search=${search}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    credentials: 'include',
                    mode: 'cors'
                })
                const json = await response.json()
                if (response.ok) {
                    setData(json.users)
                }
            } catch (err) {
            }
        }
        filterUsers();
    }, [search]);

    return (
        <div style={{ flex: '0.5' }}>
            <div style={{ display: 'flex' }}>
                <SearchIcon />
                <input style={{ outline: 'none' }} type="text" placeholder='Search' value={search} onChange={(e) =>
                    setSearch(e.target.value)
                }
                ></input>
            </div>
            {
                search ?
                    <div className='search_suggestion'>
                        {
                            data.map((user) => (
                                <Users key={user._id} user={user} />
                            ))
                        }
                        {
                            data.length === 0 ?
                                <div style={{ margin: 'auto' }}>No results found.</div> : null
                        }
                    </div> : null
            }
        </div >
    )
}

export default Search