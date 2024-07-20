import React, { useState, useEffect } from 'react';
import { Button } from 'flowbite-react';
import backgroundImage from '../assets/background.jpg'; // Adjust path if necessary

export default function Home() {
  const [obstacleDetected, setObstacleDetected] = useState(false);

  // Function to handle voice notification
  const speak = (message) => {
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.pitch = 1; // Adjust pitch if necessary
    utterance.rate = 1;  // Adjust rate if necessary
    window.speechSynthesis.speak(utterance);
  };

  // Simulate obstacle detection
  useEffect(() => {
    const detectObstacle = () => {
      setObstacleDetected(true);
      speak("Obstacle detected! Please be cautious."); // Voice notification
      setTimeout(() => setObstacleDetected(false), 3000); // Reset after 3 seconds
    };

    // Simulate obstacle detection every 10 seconds
    const interval = setInterval(detectObstacle, 10000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className='bg-cover bg-center h-screen flex flex-col'
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Navbar */}
      <div className='bg-gradient-to-r from-purple-500 to-pink-500 p-3 shadow-md'>
        <h2 className='font-semibold text-3xl text-white'>
          <span className='text-yellow-200'>Vision</span>-X
        </h2>
      </div>
      
      {/* Main Content */}
      <div className='flex flex-col justify-center items-center flex-grow'>
        <h2 className='text-center text-lg text-white'>Welcome Back!</h2>
        <h3 className='text-center pt-6 text-lg text-white'>How can I assist you today?</h3>
        <div className='mt-6 w-10/12 flex gap-4 mx-auto justify-center'>
          <Button gradientDuoTone='purpleToPink'>Start Navigation Guide</Button>
          <Button gradientDuoTone='purpleToPink'>Read Text</Button>
          <Button gradientDuoTone='purpleToPink'>My Current Location</Button>
        </div>

      {/* Obstacle Alert */}
      {obstacleDetected && (
          <div className='absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-600 text-white p-4 rounded shadow-lg z-20'>
            <h3 className='text-xl font-semibold'>Obstacle Detected!</h3>
            <p>Please be cautious.</p>
          </div>
        )}
      </div>
    </div>
  );
}
