import React, { useEffect, useState } from 'react'
import "./leftbar.css";
import image from "../Images/Profile.png";
import image1 from "../Images/image1.jpg";
import image2 from "../Images/image2.jpg"
import image3 from "../Images/image3.jpg";
import image4 from "../Images/image4.jpg"
import image5 from "../Images/image5.jpg";
import image6 from "../Images/image6.jpg"
import axios from 'axios';
import { useSelector } from 'react-redux';
export default function Leftbar() {
  const userDetails = useSelector((state)=>state.user);
  let user = userDetails.user
  let id = user?.other?._id;
  const accesstoken = user.accessToken;

  const [post , setPost] = useState([]);
  useEffect(() => {
   const getPost = async()=>{
    try {
      const res = await axios.get(`http://localhost:5000/api/user/flw/${id}` , {
        headers:{
          token:accesstoken
        }
      })
      setPost(res.data);
    } catch (error) {
      
    }
   }
   getPost();
  }, [])
          return (
                    <div className='Leftbar'>
                            

                              <div className='NotificationsContainer'>
                                        <div style={{ display: 'flex', justifyContent: 'space-around'}}>
                                                  <p style={{marginLeft:"-20px"}}>Explore</p>
                                                  <p style={{ color: "#aaa" , marginLeft:"40px" }}>See all</p>
                                        </div>
                                        <div>
                                                  {post.map((item)=>(
                                                    [item.image === '' ? '' :
                                                    <img src={`${item.image}`} className="exploreimage" alt="" />
                                                  ]

                                                  ))}
                                                  
                                                  
                                        </div>
                                        
                              </div>

                    </div>
          )
}
