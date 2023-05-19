import { Chat, Logout, Notifications, Search } from '@mui/icons-material'
import React, { useContext } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { AuthContext } from '../../state/AuthContext'
import "./Topbar.css"

export default function Topbar() {
    const PUBLIC_FOLDER= process.env.REACT_APP_PUBLIC_FOLDER;

    const { user } = useContext(AuthContext);

    //ログアウト
    const handleLogout = () => {
        localStorage.removeItem("user");
        Navigate("/");
    };

  return (
    <div className="topbarContainer">
        <div className="topbarLeft">
            <Link to ="/" style={{textDecoration:"none", color:"black"}}>
                <span className='logo'>Real SNS</span>
            </Link>
        </div>

        <div className="topbarCenter">
            <div className="searchbar">
                <Search className="searchIcon"/>
                <input type="text" 
                    className="serachInput"
                    placeholder='探し物はなんですか？' />
            </div>
        </div>
        <div className="topbarRight">
            <div className="topbarItemIcons">
                <div className="topbarIconItem">
                    <Chat />
                    <span className="topbarIconBadge">1</span>
                </div>
                <div className="topbarIconItem">
                <Notifications />
                    <span className="topbarIconBadge">2</span>
                </div>
                <Link to={`/profile/${user.username}`}>
                    <img src={user.profilePicture ? PUBLIC_FOLDER + user.profilePicture 
                        : PUBLIC_FOLDER + "/person/noAvatar.png"} 
                    alt="" className='topbarImage' />
                </Link>
                <div className="topbarIconItem"></div>
                <Link to={"/"} className="topbarIconItem" onClick={() => handleLogout() }>
                    <Logout />
                </Link>
                
            </div>
        </div>
        
    </div>
  )
}
