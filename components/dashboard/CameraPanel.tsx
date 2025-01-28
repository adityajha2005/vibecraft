import React, { useRef, useState, useEffect } from "react";
import { toast } from 'react-toastify'; // Add error notifications

interface CameraPanelProps {
  isCameraActive: boolean;
  setIsCameraActive: React.Dispatch<React.SetStateAction<boolean>>;
  isMinimized: boolean;
  onMinimize: () => void;
}

const CameraPanel: React.FC<CameraPanelProps> = ({
  isCameraActive,
  setIsCameraActive,
  isMinimized,
  onMinimize
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<WebSocket | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const frameIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const startCamera = async () => {
    try {
      // Access the camera
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      
      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize WebSocket connection
      initializeWebSocket();
    } catch (err) {
      console.error("Error accessing camera:", err);
      toast.error("Failed to access camera. Please check permissions.");
      setIsCameraActive(false);
    }
  };

  const initializeWebSocket = () => {
    // Close existing socket if any
    if (socketRef.current) {
      socketRef.current.close();
    }

    const ws = new WebSocket("ws://localhost:5001");
    socketRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to Python backend.");
      startFrameCapture();
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log("Message from backend:", message);
        if (message.action === "reduce-stimulation") {
          toast.warning("High eye strain detected! Adjusting UI...");
          // Implement UI adjustment logic here
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from backend.");
      // Attempt to reconnect after 5 seconds
      setTimeout(() => {
        if (isCameraActive) {
          initializeWebSocket();
        }
      }, 5000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      toast.error("Connection error. Retrying...");
    };
  };

  const startFrameCapture = () => {
    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
    }

    frameIntervalRef.current = setInterval(() => {
      if (videoRef.current && socketRef.current?.readyState === WebSocket.OPEN) {
        const canvas = document.createElement("canvas");
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

          canvas.toBlob((blob) => {
            if (blob && socketRef.current?.readyState === WebSocket.OPEN) {
              const reader = new FileReader();
              reader.onload = () => {
                try {
                  socketRef.current?.send(
                    JSON.stringify({
                      frame: Array.from(new Uint8Array(reader.result as ArrayBuffer)),
                    })
                  );
                } catch (error) {
                  console.error("Error sending frame:", error);
                }
              };
              reader.readAsArrayBuffer(blob);
            }
          }, 'image/jpeg', 0.7); // Use JPEG format with 70% quality for better performance
        }
      }
    }, 200); // Reduced to 5 FPS for better performance
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (frameIntervalRef.current) {
      clearInterval(frameIntervalRef.current);
      frameIntervalRef.current = null;
    }

    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };

  useEffect(() => {
    if (isCameraActive) {
      startCamera();
    } else {
      stopCamera();
    }

    return () => {
      stopCamera();
    };
  }, [isCameraActive]);

  return (
    <div className={`bg-white rounded-lg shadow-lg ${isMinimized ? 'h-12' : ''}`}>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-xl font-semibold">Camera Panel</h1>
        <button 
          onClick={onMinimize}
          className="p-2 hover:bg-gray-100 rounded"
        >
          {isMinimized ? 'Maximize' : 'Minimize'}
        </button>
      </div>
      
      {!isMinimized && (
        <div className="p-4">
          <video 
            ref={videoRef} 
            autoPlay 
            muted 
            playsInline 
            className="w-full rounded-lg mb-4"
          />
          <button
            onClick={() => setIsCameraActive((prev) => !prev)}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors"
          >
            {isCameraActive ? "Stop Camera" : "Start Camera"}
          </button>
        </div>
      )}
    </div>
  );
};

export default CameraPanel;
