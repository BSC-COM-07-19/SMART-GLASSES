import React, { useState, useEffect } from 'react';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import backgroundImage from '../assets/background.jpg'; // Use the uploaded image
import { MdKeyboardVoice } from 'react-icons/md';
import { LiaGlassesSolid } from "react-icons/lia";
import { AiFillFolderOpen } from 'react-icons/ai';

// import images
import imageTrial1 from '../images/JaaDSTZWQf2moKreAArnxg-removebg-preview.png'
//  import icons
import { FaWalking } from "react-icons/fa";
import { FaBookReader } from "react-icons/fa";
import { FaPhoneVolume } from "react-icons/fa6";
import { RiVolumeVibrateFill } from "react-icons/ri";



export default function Home() {
  const [hasGreeted, setHasGreeted] = useState(false);
  const [contact, setContact] = useState('');
  const [listening, setListening] = useState(true); //State for listening indicator

  const [TimeoutId, setTimeoutId] = useState(null);
  useEffect(() => {
    // Clear the interval when the component unmounts
    return () => {
      if (TimeoutId) {
        clearInterval(TimeoutId);
      }
    };
  }, [TimeoutId]);

  const startNavigation = () => {
    speakText("Navigation guidance Initiated");

    const id = setTimeout(() => {
      speakText("Obstacle detected");
    }, 1000);

    setTimeoutId(id);
  };
  // Function to handle speech synthesis
  const speakText = (text) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language if needed
    speechSynthesis.speak(utterance);
  };

  // Function to handle speech recognition
  const startRecognition = () => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Set language if needed
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setContact(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
    };

    recognition.start();
  };

// Function to handle recognized commands
  const handleVoiceCommand = (command) => {
    if (command.includes('start navigation')) {
      setOpenModal(true);
    } else if (command.includes('read text')) {
      speakText("Read Text Initiated");
    } else if (command.includes('current location')) {
      speakText("Ok, let me tell you your current location shortly");
    } else if (command.includes('add emergency contact')) {
      setOpenContactModal(true);
      startRecognition((transcript) => setContact(transcript));
    } else if (command.includes('join community')) {
      speakText("Joining the Community");
    }
  };
  // Greet user on component mount
  useEffect(() => {
    if (!hasGreeted) {
      speakText('Welcome Back! How can I assist you today?');
      startRecognition(handleVoiceCommand); // Start listening for commands after greeting
      setHasGreeted(true);
    }
  }, [hasGreeted]);

  return (
    <div>
{/* trial design div section */}
      <div className='bg-gradient-to-r from-purple-50 via-gray-50 to-pink-50 h-screen'>
        <div 
              className='relative bg-cover bg-center bg-no-repeat h-screen flex flex-col w-full'
              style={{ backgroundImage: `url(${imageTrial1})`, backgroundSize: 'cover' }}
        >
        <div className='absolute inset-0 bg-black opacity-20'/>
        <div className=''>
            <Button 
            color="orange"  className='fixed bg-transparent shadow-md shadow-white rounded-full mx-auto mt-[145px] ml-[746px] cursor-pointer' onClick={startNavigation}
            >
            <FaWalking className='text-2xl text-white'/>
            </Button>

            <Button 
            color="orange" onClick={()=>speakText("Read Text Initiated")}
            className=' mx-auto mt-[150px] ml-[846px] cursor-pointer bg-transparent fixed shadow-md shadow-white'
            >
                <FaBookReader className='text-xl text-white'/>
            </Button>

            <Button 
            color="orange" onClick={()=>speakText("Emergency call initiated. Who do you wish to call?")} className=' mx-auto mt-[158px] ml-[946px] cursor-pointer bg-transparent fixed shadow-md shadow-white'
            >
                <FaPhoneVolume className='text-xl text-white'/>
            </Button>

            <Button 
            color="orange" size="sm" className="animate-vibrate  mx-auto mt-[180px] ml-[346px] cursor-pointer bg-transparent fixed rounded-full shadow-sm shadow-white"
            >
                <RiVolumeVibrateFill className='text-xl text-white font-bold'/>
      </Button>
      
        </div>   
        </div>
      </div>
    </div>
  );
}
