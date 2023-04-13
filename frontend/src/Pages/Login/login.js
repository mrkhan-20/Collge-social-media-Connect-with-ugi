import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import "./login.css"
import { useState } from 'react';
import { login } from '../../Component/ReduxContainer/apiCall';
export default function Login() {
  const dispatch = useDispatch();
  const {isFetching  , error} = useSelector((state)=>state.user);
  const [email , setemail]= useState('');
  const [password , setPassword] = useState('');
const handleClick = (e)=>{
  e.preventDefault();
  login(dispatch ,{email , password});

}
  return (
    <div className='mainContainerForsignup'>
      <div className='submainContainer'>
        <div style={{flex:1 , marginLeft:150 , marginBottom:"170px"}}>
          <p className='logoText' style={{paddingBottom:"10px"}}>Connect with <span className='part main'>UGI</span></p>
          <p className='introtext'>Connect with <span className='part'>seniors and friends </span></p>
        </div>
        <div className="right" style={{flex:3}}>
          <p className='createaccountTxt'>Login Account</p>
          <input type="email" name="" id="email" placeholder='Email' onChange={(e)=>setemail(e.target.value)} className='inputText' />
          <input type="password" placeholder='******' name="" onChange={(e)=>setPassword(e.target.value)} id="password" className='inputText' />
          <button className='btnforsignup' onClick={handleClick}>Login</button>
          <Link style={{textDecoration:"none"}} to={"/forgot/password"}>
          <p style={{textAlign:'start' , marginLeft:"30.6%" ,color:"#5790ed", underline:"none" }}>Forgot password</p>
          </Link>
          <Link style={{textDecoration:"none"}} to={"/signup"}>
          <p style={{textAlign:'start' , marginLeft:"30.6%" ,color:"#5790ed", underline:"none" }}>Dont have account?</p>
          </Link>
  
        </div>
      </div>
    </div>
  )
}
