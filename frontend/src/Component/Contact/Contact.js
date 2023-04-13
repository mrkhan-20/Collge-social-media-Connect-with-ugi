import React, { useEffect, useState } from 'react'
import Chatcontainer from '../ChatContainer/Chatcontainer'
import "./Contact.css"
import profile from "../Images/image2.jpg"
import { useSelector } from 'react-redux';
import axios from 'axios';
export default function Contact() {
    const userDetails = useSelector((state)=>state.user);
    let user = userDetails.user
    // console.log(user);
    let id =user.other._id;
    const accesstoken=user.accessToken;
    const [users,setusers]= useState();

    const [currentChatUser,setcurrentChatUser]=useState('');
    // console.log(id);
    // console.log(accesstoken);
    useEffect(() => { 
        const getuser = async()=>{
         try {
           const res = await axios.get(`http://localhost:5000/api/post/following/${id}` , {
             headers:{
               token:accesstoken
             }
           })
           setusers(res.data);
         } catch (error) {
           
         } 
        }
        getuser();
       }, [])
      //  console.log(users)
    const handleUser=(e)=>{
        setcurrentChatUser(e);
    }
  return (
    <div className='mainContactConatiner'>
        <div>
        <div style={{width:"20pc",padding:"10px"}}>
            <input type="search" placeholder='Search your friends' className='searchbarforcontact'/>
        </div>
        <div className='usersDetailConatiner'>
            {users?.map((item)=>(
            <div>
                {item?.id!==id ?
            <div className='userConatiner' onClick={(e)=>handleUser(item)}>
                <img src={item?.profile} className="chatuserimage" alt=""/>
                <div style={{marginLeft:"10px"}}>
                    <p style={{color:"black" , textAlign:"start",marginTop:"5px",fontSize:"16px"}}>{item?.username}</p>
                    <p style={{color:"black", textAlign:"start", marginTop:"-16px", fontSize:"14px" }}>Open your message</p>
                </div>
            </div>:""
            }
            </div>
            ))}
            
            
        </div>
        </div>
        {currentChatUser!==''?
            <Chatcontainer currentChatUser={currentChatUser}/>:
            <div style={{marginLeft:"20px",marginTop:"10px"}}>
              <p style={{fontSize:"30px", color:"#876b70"}}>Open Your Message Tab to Chat with Your Friends</p>
            </div>
        }
    </div>
  )
}
