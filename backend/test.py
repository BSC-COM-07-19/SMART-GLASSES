import os
import asyncio
import aiohttp
import time
from dotenv import load_dotenv
from gtts import gTTS
import io
from playsound import playsound

# Load environment variables
load_dotenv()
VISSIONX_API_KEY = os.environ.get('VISSIONX_API_KEY')

API_URL = "https://api-inference.huggingface.co/models/hustvl/yolos-tiny"
headers = {"Authorization": f"Bearer {VISSIONX_API_KEY}"}

# Camera parameters (example values, replace with your actual values)
REAL_OBJECT_HEIGHT = 0.2  # meters (height of the object in real world)
FOCAL_LENGTH = 800  # pixels (focal length of the camera, needs calibration)

async def query(filename):
    async with aiohttp.ClientSession() as session:
        with open(filename, "rb") as f:
            data = f.read()
        async with session.post(API_URL, headers=headers, data=data) as response:
            if response.status != 200:
                print(f"Request failed with status: {response.status}")
                return None
            return await response.json()

async def wait_for_results(filename, max_attempts=5, delay=2):
    attempts = 0
    while attempts < max_attempts:
        output = await query(filename)
        if output:
            return output
        else:
            print("Retrying...")
            attempts += 1
            await asyncio.sleep(delay)
    return {"error": "Max attempts reached, no successful response"}

async def text_to_speech(text):
    start_time = time.time()
    
    # Generate speech
    tts = gTTS(text, lang='en')
    
    # Save to a bytes buffer
    audio_bytes = io.BytesIO()
    tts.write_to_fp(audio_bytes)
    audio_bytes.seek(0)
    
    # Save audio to a file
    audio_file_path = 'temp_audio.mp3'
    with open(audio_file_path, 'wb') as f:
        f.write(audio_bytes.read())
    
    # Measure the time taken to generate the audio
    generation_time = time.time() - start_time
    print(f"Time taken to generate audio: {generation_time:.2f} seconds")
    
    # Play the audio file
    playsound(audio_file_path)
    
    # Measure the time taken to play the audio
    play_time = time.time() - start_time - generation_time
    print(f"Time taken to play audio: {play_time:.2f} seconds")
    
    return generation_time + play_time

def calculate_distance(box_height):
    if box_height <= 0:
        return None
    return (REAL_OBJECT_HEIGHT * FOCAL_LENGTH) / box_height

async def main():
    image_path = "/home/joka/Downloads/ball.jpeg"
    output = await wait_for_results(image_path)
    if isinstance(output, dict) and 'error' in output:
        print(output['error'])
        return
    
    total_time = 0
    for item in output:
        label = item.get('label', 'Unknown object')
        box = item.get('box', {})
        
        # Calculate height of the bounding box
        box_height = box.get('ymax', 0) - box.get('ymin', 0)
        
        print(f"Object detected is {label}")
        distance = calculate_distance(box_height)
        
        if distance is not None:
            speech_text = f"Object detected is {label}. It is approximately {distance:.2f} meters away."
        else:
            speech_text = f"Object detected is {label}. Distance calculation not possible."
        
        # Measure the total time for each sentence
        sentence_time = await text_to_speech(speech_text)
        total_time += sentence_time
        
        print(f"Total time for this sentence: {sentence_time:.2f} seconds")
    
    print(f"Total time for all sentences: {total_time:.2f} seconds")

# Run the main function
asyncio.run(main())
