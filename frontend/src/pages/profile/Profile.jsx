import axios from 'axios'
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import Rightbar from '../../components/rightbar/Rightbar'
import Sidebar from '../../components/sidebar/Sidebar'
import TimeLine from '../../components/timeline/TimeLine'
import Topbar from '../../components/topbar/Topbar'
import "./Profile.css"
import { useParams } from 'react-router-dom'

export default function Profile() {
    const PUBLIC_FOLDER= process.env.REACT_APP_PUBLIC_FOLDER;

    const [user, setUser] = useState({});
    const username = useParams().username;
    console.log(username);
    
    useEffect(() => {
        const fetchUser = async () => {
          const response = await axios.get(`/users/?username=${username}`);
          console.log(response);
          setUser(response.data);
        }
        fetchUser();
      }, []);
  return (
    <>  
    <Topbar/>
    <div className="profileContainer">
        <Sidebar/>
        <div className="profileRight">
            <div className="profileRightTop">
                <div className="profileCover">
                    <img src={user.coverPicture 
                        ? PUBLIC_FOLDER + user.coverPicture 
                        : PUBLIC_FOLDER + "/post/3.jpeg"} alt=""  className='profileCoverImage'/>
                    <img src={user.profilePicture 
                        ? PUBLIC_FOLDER + user.profilePicture 
                        : PUBLIC_FOLDER + "/person/noAvatar.png"} alt="" className='profileUserImage'/>
                </div>
                <div className="profileInfo">
                    <h4 className="profileInfoName">{user.username}</h4>
                    <span className="profileInfoDesc">{user.desc}</span>
                </div> 
            </div>
            <div className="profileRightBottom">
            <TimeLine username={user.username}/>
            <Rightbar user={user}/>
            </div>
        </div>
    </div>
    </>
  )
}
