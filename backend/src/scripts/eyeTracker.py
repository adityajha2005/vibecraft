import cv2
import numpy as np
import mediapipe as mp
import asyncio
import websockets
import json
import logging
from websockets.exceptions import ConnectionClosedError
from typing import Dict, Any

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# WebSocket server configuration
WEBSOCKET_SERVER_HOST = "localhost"
WEBSOCKET_SERVER_PORT = 5001

class EyeTracker:
    def __init__(self):
        self.mp_face_mesh = mp.solutions.face_mesh
        self.face_mesh = self.mp_face_mesh.FaceMesh(
            max_num_faces=1,
            refine_landmarks=True,
            min_detection_confidence=0.5,
            min_tracking_confidence=0.5
        )
        
        # Define eye landmarks indices
        self.LEFT_EYE = [362, 382, 381, 380, 374, 373, 390, 249, 263, 466, 388, 387, 386, 385, 384, 398]
        self.RIGHT_EYE = [33, 7, 163, 144, 145, 153, 154, 155, 133, 173, 157, 158, 159, 160, 161, 246]
        
    def calculate_eye_aspect_ratio(self, landmarks, eye_indices):
        """Calculate the eye aspect ratio for detection."""
        points = []
        for index in eye_indices:
            point = landmarks.landmark[index]
            points.append([point.x, point.y])
        
        points = np.array(points)
        
        # Calculate the height of the eye
        height_1 = np.linalg.norm(points[1] - points[5])
        height_2 = np.linalg.norm(points[2] - points[4])
        
        # Calculate the width of the eye
        width = np.linalg.norm(points[0] - points[3])
        
        # Calculate eye aspect ratio
        ear = (height_1 + height_2) / (2.0 * width)
        return ear

    async def process_frame(self, frame_data: np.ndarray) -> Dict[str, Any]:
        """Process a single frame and return eye tracking results."""
        try:
            # Decode frame
            frame = cv2.imdecode(frame_data, cv2.IMREAD_COLOR)
            if frame is None:
                raise ValueError("Failed to decode frame")

            # Convert to RGB for MediaPipe
            rgb_frame = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            results = self.face_mesh.process(rgb_frame)

            if not results.multi_face_landmarks:
                return {"status": "no_face_detected"}

            landmarks = results.multi_face_landmarks[0]
            
            # Calculate EAR for both eyes
            left_ear = self.calculate_eye_aspect_ratio(landmarks, self.LEFT_EYE)
            right_ear = self.calculate_eye_aspect_ratio(landmarks, self.RIGHT_EYE)
            
            # Average EAR
            avg_ear = (left_ear + right_ear) / 2.0
            
            # Determine if eyes are too close to screen
            # Typical EAR values: 0.2-0.3
            is_too_close = avg_ear > 0.35  # Adjust threshold as needed
            
            return {
               "status": "success",
               "eye_aspect_ratio": float(avg_ear),  # Ensure avg_ear is a serializable type
               "is_too_close": bool(is_too_close),  # Convert numpy.bool_ to Python bool
               "action": "reduce-stimulation" if bool(is_too_close) else "normal"
}


        except Exception as e:
            logger.error(f"Error processing frame: {str(e)}")
            return {"status": "error", "message": str(e)}

class WebSocketServer:
    def __init__(self):
        self.eye_tracker = EyeTracker()
        
    async def handle_connection(self, websocket):
        """Handle individual WebSocket connection."""
        client_id = id(websocket)
        logger.info(f"Client connected: {client_id}")
        
        try:
            async for message in websocket:
                try:
                    # Parse incoming message
                    data = json.loads(message)
                    
                    if 'frame' not in data:
                        await websocket.send(json.dumps({
                            "status": "error",
                            "message": "No frame data received"
                        }))
                        continue

                    # Convert frame data to numpy array
                    frame_data = np.array(data['frame'], dtype=np.uint8)
                    
                    # Process frame
                    results = await self.eye_tracker.process_frame(frame_data)
                    
                    # Send results back to client
                    await websocket.send(json.dumps(results))

                except json.JSONDecodeError:
                    await websocket.send(json.dumps({
                        "status": "error",
                        "message": "Invalid JSON format"
                    }))
                    
                except Exception as e:
                    logger.error(f"Error processing message: {str(e)}")
                    await websocket.send(json.dumps({
                        "status": "error",
                        "message": str(e)
                    }))

        except ConnectionClosedError:
            logger.info(f"Client disconnected: {client_id}")
        except Exception as e:
            logger.error(f"Connection error: {str(e)}")
        finally:
            logger.info(f"Cleaning up connection: {client_id}")

    async def start(self):
        """Start the WebSocket server."""
        async with websockets.serve(
            self.handle_connection,
            WEBSOCKET_SERVER_HOST,
            WEBSOCKET_SERVER_PORT,
            ping_interval=30,
            ping_timeout=10
        ) as server:
            logger.info(f"WebSocket server started at ws://{WEBSOCKET_SERVER_HOST}:{WEBSOCKET_SERVER_PORT}")
            await asyncio.Future()  # run forever

async def main():
    server = WebSocketServer()
    await server.start()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Server shutting down...")
    except Exception as e:
        logger.error(f"Server error: {str(e)}")
