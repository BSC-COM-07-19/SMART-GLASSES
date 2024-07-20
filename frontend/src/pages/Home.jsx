import React, { useState, useEffect } from 'react';
import { Button, Label, Modal, TextInput } from 'flowbite-react';
import backgroundImage from '../assets/background.jpg'; // Use the uploaded image
import { MdKeyboardVoice } from 'react-icons/md';

export default function Home() {
  const [openModal, setOpenModal] = useState(false);
  const [openContactModal, setOpenContactModal] = useState(false);
  const [hasGreeted, setHasGreeted] = useState(false);
  const [contactNumber, setContactNumber] = useState('');
  const [contactName, setContactName] = useState('');
  const [contacts, setContacts] = useState([]);
  const [isAskingForName, setIsAskingForName] = useState(false);
  const [currentLocation, setCurrentLocation] = useState('');
  const [destination, setDestination] = useState('');

  // Function to handle speech synthesis
  const speakText = (text, callback) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; // Set language if needed
    utterance.onend = callback;
    speechSynthesis.speak(utterance);
  };

  // Function to handle speech recognition
  const startRecognition = (callback) => {
    const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.lang = 'en-US'; // Set language if needed
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      callback(transcript);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event);
    };

    recognition.start();
  };

  // Greet user on component mount
  useEffect(() => {
    if (!hasGreeted) {
      speakText('Welcome Back! How can I assist you today?', () => {
        setHasGreeted(true);
        startRecognition((transcript) => {
          setCurrentLocation(transcript);
          speakText('Where would you like to go?', () => {
            startRecognition((transcript) => {
              setDestination(transcript);
            });
          });
        });
      });
    }
  }, [hasGreeted]);

  // Save contact when modal is closed
  useEffect(() => {
    if (!openContactModal && contactNumber && contactName) {
      setContacts([...contacts, { name: contactName, number: contactNumber }]);
      setContactNumber('');
      setContactName('');
      setIsAskingForName(false);
    }
  }, [openContactModal, contactNumber, contactName, contacts]);

  // Function to handle adding a new contact
  const handleAddContact = () => {
    speakText('Please say the contact number', () => {
      startRecognition((number) => {
        setContactNumber(number);
        speakText('Please say the name of the contact', () => {
          startRecognition((name) => {
            setContactName(name);
            setOpenContactModal(false);
          });
        });
      });
    });
  };

  return (
    <div
      className='bg-cover bg-center bg-no-repeat h-screen flex flex-col'
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundSize: 'cover' }}
    >
      {/* Navbar */}
      <div className='bg-gradient-to-r from-purple-500 to-pink-500 py-2 px-3 shadow-md'>
        <h2 className='font-semibold text-2xl text-white'>
          <span className='text-yellow-200'>Vision</span>-X
        </h2>
      </div>

      {/* Main Content */}
      <div className='flex flex-col justify-center items-center flex-grow mt-10'>
        <h2 className='text-center text-lg text-white bg-black bg-opacity-50 p-2 rounded'>Welcome Back!</h2>
        <h3 className='text-center pt-6 text-lg text-white bg-black bg-opacity-50 p-2 rounded'>How can I assist you today?</h3>
        <div className='mt-6 w-10/12 flex gap-4 mx-auto justify-center'>
          <Button gradientDuoTone="purpleToPink" onClick={() => { setOpenModal(true); speakText('Start navigation'); }}>
            Start Navigation Guide
          </Button>
          <Button gradientDuoTone="purpleToPink" onClick={() => speakText("Read Text")}>
            Read Text
          </Button>
          <Button gradientDuoTone="purpleToPink" onClick={() => speakText("My current Location")}>
            My Current Location
          </Button>
          <Button gradientDuoTone="purpleToPink" onClick={() => { setOpenContactModal(true); handleAddContact(); }}>
            Add Emergency Contact
          </Button>
        </div>

        {/* Display Emergency Contacts */}
        <div className='mt-6 w-10/12'>
          <h3 className='text-lg text-white'>Emergency Contacts:</h3>
          <ul className='list-disc pl-5 text-white'>
            {contacts.map((contact, index) => (
              <li key={index}>{contact.name}: {contact.number}</li>
            ))}
          </ul>
        </div>

        {/* Modal section */}
        <Modal show={openModal} onClose={() => setOpenModal(false)}>
          <Modal.Header>Navigation Guidance Initiated</Modal.Header>
          <Modal.Body>
            <div className="space-y-6">
              <MdKeyboardVoice className='text-center text-pink-700 mx-auto text-3xl' />
              <Label>Where would you like to go to?</Label>
              <TextInput className='mt-4' placeholder='e.g., To the dining room' value={destination} readOnly />
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
              <Label>Speak the name and number of your emergency contact</Label>
              <TextInput
                className='mt-4'
                placeholder='e.g., 123-456-7890'
                value={contactNumber}
                readOnly
              />
              <TextInput
                className='mt-4'
                placeholder='e.g., John Doe'
                value={contactName}
                readOnly
              />
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={() => setOpenContactModal(false)}>
              Save Contact
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </div>
  );
}
