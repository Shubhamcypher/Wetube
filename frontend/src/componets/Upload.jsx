import React, { useEffect, useState } from 'react'
import styled from 'styled-components';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from '../firebase.js'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';



const Container = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #000000a7;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Wrapper = styled.div`
  width: 600px;
  height: 600px;
  background-color: ${({ theme }) => theme.bgLighter};
  color: ${({ theme }) => theme.text};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  position: relative;
`;
const Close = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color:white
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  &:hover {
    background-color: red;
  }
`;
const Title = styled.h1`
  text-align: center;
`;

const Input = styled.input`
border: 1px solid ${({ theme }) => theme.soft};
color: ${({ theme }) => theme.text};
border-radius: 3px;
padding: 10px;
background-color: transparent;
`
const Description = styled.textarea`
border: 1px solid ${({ theme }) => theme.soft};
color: ${({ theme }) => theme.text};
border-radius: 3px;
padding: 10px;
background-color: transparent;
`

const Button = styled.button`
  border-radius: 3px;
  border: none;
  padding: 10px 20px;
  font-weight: 500;
  cursor: pointer;
  background-color: ${({ theme }) => theme.soft};
  color: ${({ theme }) => theme.text};
  background-color: #4169e1 ;
  &:hover {
    background-color: #32cd32 ;
    color: black
  }
`;

const Label = styled.label`
  font-size: 14px;
  color: ${({ theme }) => theme.text};
`;

const Upload = ({setOpen}) => {
    const [img, setImg] = useState(undefined)
    const [video, setVideo] = useState(undefined)
    const [videoPercent, setVideoPercent] = useState(0)
    const [imgPercent, setImgPercent] = useState(0)
    const [inputs, setInputs] = useState({})
 
    const [tags, setTags] = useState([])

    const navigate = useNavigate()

    const handleTags = (e)=>{
        setTags(e.target.value.split(','))
    }

    const handleUpload = async(e)=>{
        e.preventDefault();
        const res = await axios.post('/api/video',{...inputs,tags})
        setOpen(false)
        if(res.status===200)
        navigate(`/video/${res.data._id}`)
    }

    const handleChange = (e) => {
        setInputs((prev) => {
          return { ...prev, [e.target.name]: e.target.value };
        });
      };

    const uploadFile = async (file, urlType)=>{
        const storage = getStorage(app);
        const fileName = new Date().getTime()+file.name
        const storageRef = ref(storage, fileName );

        const uploadTask = uploadBytesResumable(storageRef, file);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
        (snapshot) => {
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            urlType === "imgUrl" ? setImgPercent(Math.round(progress)) : setVideoPercent(Math.round(progress));
            switch (snapshot.state) {
            case 'paused':
                console.log('Upload is paused');
                break;
            case 'running':
                console.log('Upload is running');
                break;
            default:
                break;
            }
        },
        (error)=>{},
        () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                setInputs((prev) => {
                    return { ...prev, [urlType]: downloadURL };
                  });
            });
          }
        ); 

    }

    useEffect(()=>{
        video && uploadFile(video,"videoUrl");
    },[video])

    useEffect(()=>{
        img && uploadFile(img,"imgUrl");
    },[img])
  return (
    <Container>
        <Wrapper>
            <Close onClick={()=>{setOpen(false)}}>X</Close>
            <Title>Uplaod a new video</Title>
            <Label>Video:</Label>
           {(videoPercent>0)?("Uploading: "+ videoPercent+"%"): (<Input type='file' accept='video/*' onChange={(e)=>setVideo(e.target.files[0])}/>)}
            <Input type='text' placeholder='Title' name='title'  onChange={handleChange}/>
            <Description placeholder='Description' rows={8} name='desc' onChange={handleChange}/>
            <Input type='text' placeholder='seperate tags with commas' onChange={handleTags}/>
            <Label>Thumbnail:</Label>
            {imgPercent>0?("Uploading: "+ imgPercent+ "%"):(<Input type='file' accept='image/*' onChange={(e)=>setImg(e.target.files[0])}/>)}
            <Button onClick={handleUpload}>Upload</Button>
        </Wrapper>
    </Container>
  )
}

export default Upload