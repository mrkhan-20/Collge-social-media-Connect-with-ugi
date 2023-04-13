import React, { useEffect } from 'react'
import "./rightbar.css"
import ads from "../Images/ads.jpg";
import image1 from "../Images/image3.jpg";

import addFriends from "../Images/add-user.png"
import axios from 'axios';
import { useState } from 'react';
import Follow from './Follow';
import { useSelector } from 'react-redux';
export default function Rightbar() {
  const userDetails = useSelector((state)=>state.user);
  let user = userDetails?.user;
  const id = user?.other?._id;
 const [users , setUsers] = useState([]);
  useEffect(() => {
    const getuser = async()=>{
      try {
        const res  = await axios.get(`http://localhost:5000/api/user/all/user/${id}`)
        setUsers(res.data);
      } catch (error) {
        console.log("Some error occured")
      }
    }
    getuser();
  }, [])

  return (
    <div className='rightbar'>
      
      <div className='rightcontainer2'>
        <h3 style={{textAlign:"start" , marginLeft:"10px"}}>Suggested for you</h3>
        {users.map((item)=>(
        item._id!=user?.other?._id ?
          <Follow userdetails={item}/>:
          ""
          ))}
        
      </div>


    </div>
  )
}
