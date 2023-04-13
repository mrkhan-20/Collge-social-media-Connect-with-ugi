import React, { useRef } from 'react';
import "./ChatContainer.css";
import axios from 'axios';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import { useState } from 'react';
import { useEffect } from 'react';

export default function Chatcontainer({ currentChatUser }) {
  const userDetails = useSelector((state) => state.user);
  let user = userDetails.user
  let id = user.other._id;
  const scrollRef = useRef();
  const socket = useRef();
  const [message, setMessage] = useState([]);
  const accesstoken = user.accessToken;
  const [inputmessage, setinputmessage] = useState('');
  const [arrivalMessage, setarrivalMessage] = useState(null);

  useEffect(() => {
    const getmessage = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/post/get/chat/msg/${id}/${currentChatUser._id}`, {
          headers: {
            token: accesstoken
          }
        })
        setMessage(res.data);

      } catch (error) {

      }
    }
    getmessage();
  }, [currentChatUser._id])
  useEffect(() => {
    if (currentChatUser !== '') {
      socket.current = io("http://localhost:5000");
      socket.current.emit("addUser", id)
    }
  }, [id])

  // console.log(socket);
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [message])

  const sendmsg = () => {
    document.getElementById("chatinput").value="";
    const messages = {
      myself: true,
      message: inputmessage
    };
    socket.current.emit("send-msg", {
      to: currentChatUser._id,
      from: id,
      message: inputmessage
    })



     
    fetch(`http://localhost:5000/api/post/msg`, {
      method: "POST", headers: { 'Content-Type': 'application/JSON', token: accesstoken }, body: JSON.stringify({
        from: id,
        to: currentChatUser._id,
        message: inputmessage
      })
    });
    setMessage(message.concat(messages))

  }

  const onchangechatinput = (e) => {
    setinputmessage(e.target.value);
    console.log(e);

  }

  useEffect(() => {
    if (socket.current) {
      socket.current.on("msg-recieve", (msg) => {
        console.log(msg)
        setarrivalMessage({ myself: false, message: msg })
      })
    }
  }, [arrivalMessage]);

  useEffect(() => {
    arrivalMessage && setMessage((pre) => [...pre, arrivalMessage])
  }, [arrivalMessage])

  return (
    <div className='mainChatConatiner'>
      <div>
        <div style={{ display: "flex", marginLeft: "30px", marginTop: "10px", backgroundColor: "rgb(241,243,241)", width: "66pc", padding: "5px", borderRadius: "10px" }}>
          <img src={`${currentChatUser?.profile}`} className="userProfile" alt="" />
          <p style={{ marginTop: "10px", marginLeft: "10px" }}>{currentChatUser?.username}</p>
        </div>
        <div className='msgContainer'>
          {message.map((item) => {
            return (
              <div key={item._id} ref={scrollRef}>
                {item.myself === false ? (
                  <div className='msg'>
                    <img src={`${currentChatUser?.profile}`} className="chatuserprofile" alt="" />
                    <p className='msgText'>{item?.message}</p>
                  </div>
                ) : (
                  <div className='yourmsg'>
                    <p className='msgText'>{item?.message}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className='msgSenderContainer'>
          <input type="text" name="" placeholder="Enter Message" onChange={onchangechatinput} id="chatinput" className='input' />
          <button className='msgButton' onClick={sendmsg}>Send</button>
        </div>
      </div>
    </div>
  )
}