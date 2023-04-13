import React from 'react'
import "./navbar.css";
import searchIcon from "../Images/search.png";
import Notifications from "../Images/bell.png";
import Message from "../Images/message.png";
import Profileimage from "../Images/Profile.png"
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../ReduxContainer/userReducer';
export default function Navbar() {
  const userDetails = useSelector((state)=>state.user);
  let user = userDetails?.user

  let id = user?.other?._id;
  const dispatch = useDispatch();
  const handleLogout = ()=>{
    dispatch(logout())
    
  }
  return (
    <div className='mainNavbar' style={{position: "fixed", top: "0", left: "0", zIndex: "999", width: "100%", height: "50px"}}>
          <div className='LogoContainer'>
              <Link to={`/`} style={{ textDecoration: 'none' , color:'black'}}>
              <div style={{fontSize:"20px",paddingTop:"10px",paddingLeft:"10px", cursor:"pointer",fontWeight:"bold", color:'white'}}>Home</div>
              </Link>
          </div>
          <div>
                    <div className='searchInputContainer'>
                              <img src={`${searchIcon}`} className="searchIcon" alt="" />
                              <input type="text" className='searchInput' placeholder='search your friends' name="" id="" />
                    </div>
          </div>
          <div className='IconsContainer'>
                    <img src={`${Notifications}`} className="Icons" alt="" />

                    <Link to={`/chat`}>
                    <img src={`${Message}`} className="Icons" alt="" />
                    </Link>

                    <Link to={`/Profile/${id}`} onClick={() => window.location.href=`/Profile/${id}`}>
                    <div style={{display:'flex' , alignItems:'center'}}>
                              <img src={`${user?.other?.profile}`} className="ProfileImage" alt="" />
                              <p style={{marginLeft:'5px',color:'white'}}>{user?.other?.username}</p>
                    </div>
                    </Link>
                    <Link to={`/forgot/password`} style={{ textDecoration: 'none' , color:'white',marginLeft:'10px' }}>
                          <div style={{fontSize:"15px", cursor:"pointer"}}>Change Password</div>
                    </Link>
                    <Link to={`/login`} style={{ textDecoration: 'none' , color:'white'}} >
                    <div style={{marginRight:"30px" , marginLeft:"20px" , cursor:"pointer" }} onClick={handleLogout}>
                      <p>Logout</p>
                    </div>
                    </Link>
          </div>
    </div>
  )
}
