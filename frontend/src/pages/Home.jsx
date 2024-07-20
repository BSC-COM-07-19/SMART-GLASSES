import React from 'react'
import { Button } from "flowbite-react";
export default function Home() {
  return (
    <div className='bg-gradient-to-r from-purple-200 to-orange-100 h-screen'>
        <div className='p-3'>
            <h2 className='font-semibold text-3xl text-pink-700'><span className='text-purple-700'>Vision</span>-X</h2>
        </div>
        <h2 className='text-center text-lg'>Welcome Back!</h2>
        <h3 className='text-center pt-6 text-lg'>How can I assist you today?</h3>
        <div className='mt-6 w-10/12 flex gap-4 mx-auto justify-center'>
            <Button gradientDuoTone="purpleToPink">Start Navigation Guide</Button>
            <Button gradientDuoTone="purpleToPink">Read Text</Button>
            <Button gradientDuoTone="purpleToPink">My Current Location</Button>
        </div>
    </div>
  )
}
