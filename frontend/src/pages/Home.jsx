import React from 'react'
import { Button,Label,Modal, TextInput } from "flowbite-react";
import { useState,useEffect} from "react";
import { MdKeyboardVoice } from "react-icons/md";

export default function Home() {
const [openModal, setOpenModal] = useState(false);
const [hasGreeted,setHasGreeted]=useState(false)
// function to handle speech sysnthesis
const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language if needed
    speechSynthesis.speak(utterance);
  };
    // Use useEffect to speak when component mounts
    useEffect(() => {
        if(!hasGreeted){
            speakText('Welcome Back! How can I assist you today?');
            setHasGreeted(true)
        }
      },[hasGreeted]);
    // read text when modal is opened
useEffect(()=>{
    if(openModal){
        speakText("Navigation guidance initiated. Where would you like to go?")
    }
},[openModal])
  return (
    <div className='bg-gradient-to-r from-purple-200 to-orange-100 h-screen'>
        <div className='p-3'>
            <h2 className='font-semibold text-3xl text-pink-700'><span className='text-purple-700'>Vision</span>-X</h2>
        </div>
        <h2 className='text-center text-lg'>Welcome Back!</h2>
        <h3 className='text-center pt-6 text-lg'>How can I assist you today?</h3>
        <div className='mt-6 w-10/12 flex gap-4 mx-auto justify-center'>
            <Button gradientDuoTone="purpleToPink" onClick={() => {setOpenModal(true); speakText('Start navigation');}}>
                Start Navigation Guide</Button>
            <Button gradientDuoTone="purpleToPink" onClick={()=>speakText("Read Text")}>Read Text</Button>
            <Button gradientDuoTone="purpleToPink" onClick={()=>speakText("My current Location")}>My Current Location</Button>
        </div>
        <div>
            {/* modal section */}
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
        <Modal.Header>Navigation Guidance Initiated</Modal.Header>
        <Modal.Body>
          <div className="space-y-6">
            <MdKeyboardVoice className='text-center text-pink-700 mx-auto text-3xl'/>
            <Label>Where would you like to go to?</Label>
            <TextInput className='mt-4' placeholder='e.g To the dinning room'></TextInput>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => {setOpenModal(false);
            speakText("Navigation guidance terminated!")
          }}>Stop Guide</Button>
        </Modal.Footer>
      </Modal>
      </div>
      </div>
      )
}
