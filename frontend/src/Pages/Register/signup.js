import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux'
import "./signup.css";
import { signup } from '../../Component/ReduxContainer/apiCall';
import app from '../../firebase';
import { useNavigate } from 'react-router-dom';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
export default function Signup() {
  const dispatch = useDispatch();
  const {isFetching  , error} = useSelector((state)=>state.user);
  const user = useSelector((state)=>state.user);
  const [email , setEmail] = useState('');
  const [phonenumber , setphonenumber] = useState('');
  const [username , setusername] = useState('');
  const [password , setpassword] = useState('');
  const [file , setfile] = useState(null);


  //new
  const [err,setErr]=useState('');

  const userDetails = user.user;
  const navigator = useNavigate();
  var regEmail=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;

  const handleClick = (e)=>{
    e.preventDefault();

    if(phonenumber.length!==10)
    {
        setErr("PhoneNumber Must Be 10 Characters Long");
        return;
    }

    if (email == "" || !regEmail.test(email)) {
      setErr("Please enter a valid e-mail address.");
      return;
    }

    if(password.length<6)
    {
        setErr("Password Must Be atleast 6 Characters Long");
        return;
    }

     



    const fileName = new Date().getTime() + file?.name;
    const storage = getStorage(app);
    const StorageRef = ref(storage , fileName);
    
    const uploadTask = uploadBytesResumable(StorageRef, file);
    uploadTask.on('state_changed', 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        setErr('Image Upload is paused')
        break;
      case 'running':
        console.log('Upload is running');
        setErr('Image Upload is running')
        break;
    }
  }, 
  (error) => {
    // Handle unsuccessful uploads
  }, 
  () => {
    // Handle successful uploads on complete
    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      try{
        signup(dispatch ,{email , password , username , phonenumber , profile:downloadURL});
        console.log(email , password , username , phonenumber , downloadURL)
        setErr("Signup Successfull,Admin Will Verify First");
        setEmail("");
        setpassword("");
        setphonenumber("");
        setusername("");
        setfile("");
        e.target.reset();

      }
      catch(error){
        console.log(error)
        console.log("error happened");
      }
      })
    });

  }

  if(userDetails?.Status==='Pending'){
      // alert("Admin will verify first");
      // setErr("Admin wil Verify First");

  }

  
  return (
    <div className='mainContainerForsignup'>
      <div className='submainContainer'>
        <div style={{flex:1 , marginLeft:150  , marginBottom:"170px"}}>
        <p className='logoText' style={{paddingBottom:"10px"}}>Connect with <span className='part main'>UGI</span></p>
          <p className='introtext'>Connect with <span className='part'>seniors and friends </span></p>
        </div>
        <div style={{flex:3}}>
          <form onSubmit={handleClick}>
          <p className='createaccountTxt'>Create New Account</p>
          <input type="file" name="file" id="file" onChange={(e)=>setfile(e.target.files[0])} required/>
          <input type="text" placeholder='Username' onChange={(e)=>setusername(e.target.value)} className='inputText' required/>
          <input type="number" placeholder='Phonenumber' onChange={(e)=>setphonenumber(e.target.value)} className='inputText' required/>
          <input type="email" name="" id="" placeholder='email' onChange={(e)=>setEmail(e.target.value)} className='inputText' required/>
          <input type="password" placeholder='******' name="" onChange={(e)=>setpassword(e.target.value)} id="" className='inputText' required/>
          <button className='btnforsignup' type="submit">Signup</button>
          </form>
          <p style={{color:"red"}}>{err}</p>
          <Link to={"/"}>
          <p style={{textAlign:'start' , marginLeft:"30.6%" ,color:"#5790ed", underline:"none" }}>Already have a account?</p>
          </Link>
        </div>
      </div>
    </div>
  )
}
