import os
import asyncio
import aiohttp
import time
import cv2
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

async def query(image_data):
    async with aiohttp.ClientSession() as session:
        async with session.post(API_URL, headers=headers, data=image_data) as response:
            if response.status != 200:
                print(f"Request failed with status: {response.status}")
                return None
            return await response.json()

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

async def process_frame(frame):
    _, encoded_img = cv2.imencode('.jpg', frame)
    image_data = encoded_img.tobytes()
    
    output = await query(image_data)
    if output is None or 'error' in output:
        print("No valid response or error in response.")
        return
    
    if not output:
        print("No objects detected.")
        return
    
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
        
        await text_to_speech(speech_text)

async def main():
    cap = cv2.VideoCapture(0)
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame.")
            break
        
        await process_frame(frame)
        
        # Exit loop on a key press (ESC key)
        if cv2.waitKey(1) & 0xFF == 27:
            break
    
    cap.release()
    cv2.destroyAllWindows()

# Run the main function
asyncio.run(main())
import os
import asyncio
import aiohttp
import time
import cv2
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

async def query(image_data):
    async with aiohttp.ClientSession() as session:
        async with session.post(API_URL, headers=headers, data=image_data) as response:
            if response.status != 200:
                print(f"Request failed with status: {response.status}")
                return None
            return await response.json()

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

async def process_frame(frame):
    # Pre-process the frame (optional)
    frame = cv2.GaussianBlur(frame, (5, 5), 0)
    _, encoded_img = cv2.imencode('.jpg', frame)
    image_data = encoded_img.tobytes()
    
    output = await query(image_data)
    if output is None or 'error' in output:
        print("No valid response or error in response.")
        return
    
    if not output:
        print("No objects detected.")
        return
    
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
        
        await text_to_speech(speech_text)

async def main():
    cap = cv2.VideoCapture(0)
    
    while True:
        ret, frame = cap.read()
        if not ret:
            print("Failed to grab frame.")
            break
        
        await process_frame(frame)
        
        # Exit loop on a key press (ESC key)
        if cv2.waitKey(1) & 0xFF == 27:
            break
    
    cap.release()
    cv2.destroyAllWindows()

# Run the main function
asyncio.run(main())
