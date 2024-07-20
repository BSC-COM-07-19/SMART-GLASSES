import React, { useState, useEffect } from 'react';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import backgroundImage from '../assets/background.jpg'; // Use the uploaded image
import { MdKeyboardVoice } from 'react-icons/md';
import { LiaGlassesSolid } from "react-icons/lia";
import { AiFillFolderOpen } from 'react-icons/ai';

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [contact, setContact] = useState('');
  const [contacts, setContacts] = useState([]);
  const [openImagesModal, setOpenImagesModal] = useState(false);

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

  // Greet user on component mount
  useEffect(() => {
    if (!hasGreeted) {
      speakText('Welcome Back! How can I assist you today?');
      setHasGreeted(true);
    }
  }, [hasGreeted]);

  // Read text when guidance modal is opened
  useEffect(() => {
    if (openModal) {
      speakText("Navigation guidance initiated. Where would you like to go?");
    }
  }, [openModal]);

  // Read text when contact modal is open
  useEffect(() => {
    if (openContactModal) {
      speakText("Adding emergency contact initiated. Kindly speak the name and the phone number of your emergency contact");
    }
  }, [openContactModal]);

  // Save contact when modal is closed
  useEffect(() => {
    if (!openContactModal && contact) {
      setContacts([...contacts, contact]);
      setContact('');
    }
  }, [openContactModal, contact, contacts]);

  return (
    <div
      className='relative bg-cover bg-center bg-no-repeat h-screen flex flex-col w-full'
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
    >
      {/* Dark overlay */}
      <div className='absolute inset-0 bg-black opacity-50' />

      {/* Main Content */}
      <div className='absolute z-10 flex flex-col justify-center items-center flex-grow w-full'>
        {/* Navbar */}
        <div className='relative w-full bg-gradient-to-r from-purple-500 to-pink-500 p-3 shadow-md flex items-center gap-2'>
          <LiaGlassesSolid className='text-3xl animate-spin-slow' />
          <h2 className='font-semibold text-xl w-full text-yellow-300'>
            Vision-
            <span className='text-white text-2xl font-bold bg-black p-1 rounded-md'>X</span>
          </h2>
        </div>

        {/* Main Content */}
        <div className='flex flex-col justify-center items-center mt-10 w-8/12'>
          <h2 className='text-center font-semibold text-xl text-white bg-opacity-50 mt-6 p-2 rounded'>Welcome Back!</h2>
          <h3 className='text-center font-semibold pt-6 text-lg text-white bg-opacity-50 p-2 rounded'>How can I assist you today?</h3>
          <div className='mt-6 w-full flex flex-col md:flex-row gap-4 mx-auto justify-between'>
            <Button gradientDuoTone="purpleToPink" className="flex-1" onClick={() => { setOpenModal(true); speakText('Start navigation'); }}>
              Start Navigation Guide
            </Button>
            <Button gradientDuoTone="purpleToPink" className="flex-1" onClick={() => speakText("Read Text")}>
              Read Text
            </Button>
            <Button gradientDuoTone="purpleToPink" className="flex-1" onClick={() => speakText("My current Location")}>
              My Current Location
            </Button>
          </div>
          <div className='mt-5 flex flex-col md:flex-row gap-4 justify-between w-full border-white border-t-2 pt-4'>
            <div className='flex-1'>
              <Button gradientDuoTone="purpleToPink" className="w-full" onClick={() => { setOpenContactModal(true); startRecognition(); }}>
                Add Emergency Contact
              </Button>
              {/* Display Emergency Contacts */}
              <div className='mt-6 w-full bg-gray-200 p-3 rounded-md shadow-sm shadow-pink-800'>
                <h3 className='text-lg text-black'>Emergency Contacts:</h3>
                <ul className='pl-5'>
                  {contacts.map((contact, index) => (
                    <li key={index}>{contact}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className='flex-1'>
              <Button gradientDuoTone="purpleToPink" className="w-full" onClick={() => speakText("Joining the Community")}>
                Join Community
              </Button>
            </div>
            <div className='flex-1'>
              <Button gradientDuoTone="purpleToPink" className="w-full" onClick={() => setOpenImagesModal(true)}>
                <AiFillFolderOpen className='mr-2' />
                Captured Images
              </Button>
            </div>
          </div>
          {/* Modal section */}
          <Modal show={openModal} onClose={() => setOpenModal(false)}>
            <Modal.Header>Navigation Guidance Initiated</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <MdKeyboardVoice className='text-center text-pink-700 mx-auto text-3xl' />
                <Label>Where would you like to go to?</Label>
                <TextInput className='mt-4' placeholder='e.g., To the dining room' />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => {
                setOpenModal(false);
                speakText("Navigation guidance terminated!");
              }}>
                Stop Guide
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Emergency Contact Modal */}
          <Modal show={openContactModal} onClose={() => setOpenContactModal(false)}>
            <Modal.Header>Add Emergency Contact</Modal.Header>
            <Modal.Body>
              <div className="space-y-6">
                <MdKeyboardVoice className='text-center text-pink-700 mx-auto text-3xl' />
                <Label>Speak the name and phone number of your emergency contact</Label>
                <TextInput
                  className='mt-4'
                  placeholder='e.g., John Doe 123-456-7890'
                  value={contact}
                  readOnly
                />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => {
                setOpenContactModal(false);
                speakText("Emergency contact saved successfully");
              }}>
                Save Contact
              </Button>
            </Modal.Footer>
          </Modal>

          {/* Captured Images Modal */}
          <Modal show={openImagesModal} onClose={() => setOpenImagesModal(false)}>
            <Modal.Header>Captured Images</Modal.Header>
            <Modal.Body>
              <div className='grid grid-cols-3 gap-3'>
                <img className='h-20 object-cover' src='https://myinfo.com.gh/wp-content/uploads/2023/03/Funny-Face.jpg' />
                <img className='h-20 object-cover' src='https://dm0qx8t0i9gc9.cloudfront.net/thumbnails/video/rZJIMvhmliwmde8a6/videoblocks-dark-skinned-man-fooling-around-makind-stupid-facial-expressions-touching-nose-with-finger-grey-isolated-background_bz6zj0aul_thumbnail-1080_01.png' />
                <img className='h-20 object-cover' src='https://live.staticflickr.com/8278/30191531635_a53dbdee8b.jpg' />
                <img className='h-20 object-cover' src='https://www.bellanaijaweddings.com/wp-content/uploads/2019/07/Makeup-Addiction-BellaNaija-Weddings-4.jpg' />
                <img className='h-20 object-cover' src='https://th.bing.com/th/id/R.be9c4ae807dbf8bc79b8e071a444786b?rik=bGmc3BTpvH1E9g&riu=http%3a%2f%2fonline-english.biz.ua%2fimg%2fimg_folder04%2fman.png&ehk=PeDnzFlnrUGisrhmZYiCGWxQigndG4%2bEd4bDmDkH1Ic%3d&risl=&pid=ImgRaw&r=0' />
                <img className='h-20 object-cover' src='https://th.bing.com/th/id/OIP.HuWOsRnK5XzRF24Cfe0oAAHaId?pid=ImgDet&w=206&h=235&c=7&dpr=1.1' />
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setOpenImagesModal(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </div>
  );
}
