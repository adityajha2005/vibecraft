import React, { useRef, useEffect, useState } from 'react'
import { IoTrashBin } from 'react-icons/io5'

interface SketchCanvasProps {
  activeColor: string
  brushSize: number
  setBrushSize: (size: number) => void
  setActiveColor: (color: string) => void
  onGenerate: (dataUrl: string, prompt: string) => Promise<ArrayBuffer>
  isGenerating: boolean
}

const SketchCanvas: React.FC<SketchCanvasProps> = ({
  activeColor,
  brushSize,
  setBrushSize,
  setActiveColor,
  onGenerate,
  isGenerating
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasWrapperRef = useRef<HTMLDivElement>(null)
  const [prompt, setPrompt] = useState('')
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isEraser, setIsEraser] = useState(false)

  useEffect(() => {
    if (canvasRef.current && canvasWrapperRef.current) {
      const canvas = canvasRef.current
      const wrapper = canvasWrapperRef.current
      
      // Make the canvas square based on the smaller dimension
      const size = Math.min(wrapper.clientWidth, wrapper.clientHeight)
      
      canvas.style.width = `${size}px`
      canvas.style.height = `${size}px`
      
      // Set actual canvas dimensions (making them square)
      canvas.width = size
      canvas.height = size
      
      const context = canvas.getContext('2d')
      if (context) {
        context.lineCap = 'round'
        context.strokeStyle = activeColor
        context.lineWidth = brushSize
        contextRef.current = context
      }
    }
  }, [])

  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = isEraser ? '#ffffff' : activeColor
      contextRef.current.lineWidth = brushSize
    }
  }, [isEraser, activeColor, brushSize])

  const getMousePos = (e: React.MouseEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const getTouchPos = (e: React.TouchEvent) => {
    if (!canvasRef.current) return { x: 0, y: 0 }
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    const touch = e.touches[0]
    return {
      x: (touch.clientX - rect.left) * scaleX,
      y: (touch.clientY - rect.top) * scaleY
    }
  }

  const startDrawing = (e: React.MouseEvent) => {
    if (!contextRef.current) return
    const pos = getMousePos(e)
    contextRef.current.beginPath()
    contextRef.current.moveTo(pos.x, pos.y)
    setIsDrawing(true)
  }

  const startDrawingTouch = (e: React.TouchEvent) => {
    if (!contextRef.current) return
    e.preventDefault()
    const pos = getTouchPos(e)
    contextRef.current.beginPath()
    contextRef.current.moveTo(pos.x, pos.y)
    setIsDrawing(true)
  }

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing || !contextRef.current) return
    const pos = getMousePos(e)
    contextRef.current.lineTo(pos.x, pos.y)
    contextRef.current.stroke()
  }

  const drawTouch = (e: React.TouchEvent) => {
    if (!isDrawing || !contextRef.current) return
    e.preventDefault()
    const pos = getTouchPos(e)
    contextRef.current.lineTo(pos.x, pos.y)
    contextRef.current.stroke()
  }

  const stopDrawing = () => {
    if (!contextRef.current) return
    contextRef.current.closePath()
    setIsDrawing(false)
    saveHistory()
  }

  const stopDrawingTouch = (e: React.TouchEvent) => {
    e.preventDefault()
    if (!contextRef.current) return
    contextRef.current.closePath()
    setIsDrawing(false)
    saveHistory()
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
      setGeneratedImage(null)
    }
  }

  const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
    let binary = ''
    const bytes = new Uint8Array(buffer)
    for (let i = 0; i < bytes.length; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }

  const handleGenerate = async () => {
    if (!canvasRef.current || !prompt.trim()) return
    const sketchDataUrl = canvasRef.current.toDataURL('image/png')
    try {
      const arrayBuffer = await onGenerate(sketchDataUrl, prompt)
      const base64String = arrayBufferToBase64(arrayBuffer)
      setGeneratedImage(`data:image/jpeg;base64,${base64String}`)
    } catch (error) {
      console.error('Failed to generate image:', error)
    }
  }

  const saveHistory = () => {
    if (!canvasRef.current) return
    const snapshot = canvasRef.current.toDataURL()
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(snapshot)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  const handleUndo = () => {
    if (historyIndex <= 0) return
    const newIndex = historyIndex - 1
    setHistoryIndex(newIndex)
    restoreCanvas(history[newIndex])
  }

  const handleRedo = () => {
    if (historyIndex >= history.length - 1) return
    const newIndex = historyIndex + 1
    setHistoryIndex(newIndex)
    restoreCanvas(history[newIndex])
  }

  const restoreCanvas = (dataUrl: string) => {
    if (!canvasRef.current || !contextRef.current) return
    const canvas = canvasRef.current
    const context = contextRef.current
    const img = new Image()
    img.src = dataUrl
    img.onload = () => {
      context.clearRect(0, 0, canvas.width, canvas.height)
      context.drawImage(img, 0, 0)
    }
  }

  const toggleEraser = () => {
    setIsEraser(!isEraser)
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center p-4">
      {/* Controls */}
      <div className="w-full bg-white p-2 rounded-lg shadow-lg flex gap-2 mb-4 z-10">
        <input 
          type="color" 
          value={activeColor}
          onChange={(e) => setActiveColor(e.target.value)}
          className="w-8 h-8"
        />
        <input 
          type="range" 
          min="1" 
          max="50" 
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          className="w-24"
        />
        <button 
          onClick={clearCanvas}
          className="p-1 hover:bg-slate-100 rounded"
        >
          <IoTrashBin className="w-6 h-6" />
        </button>
        <button onClick={handleUndo} className="p-1 hover:bg-slate-100 rounded">Undo</button>
        <button onClick={handleRedo} className="p-1 hover:bg-slate-100 rounded">Redo</button>
        <button onClick={toggleEraser} className="p-1 hover:bg-slate-100 rounded">
          {isEraser ? 'Disable Eraser' : 'Eraser'}
        </button>
      </div>

      {/* Split View Container */}
      <div className="w-full flex flex-col sm:flex-row gap-4 flex-grow">
        {/* Sketch Area */}
        <div className="w-full sm:w-1/2 h-[50vh] sm:h-[calc(85vh-160px)] flex items-center justify-center">
          <div 
            ref={canvasWrapperRef}
            className="relative aspect-square h-full"
          >
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawingTouch}
              onTouchMove={drawTouch}
              onTouchEnd={stopDrawingTouch}
              className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair absolute inset-0 shadow-lg"
            />
          </div>
        </div>

        {/* Generated Image Area */}
        <div className="w-full sm:w-1/2 h-[50vh] sm:h-[calc(85vh-160px)] flex items-center justify-center">
          {generatedImage ? (
            <img 
              src={generatedImage} 
              alt="Generated artwork"
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg"
            />
          ) : (
            <div className="w-full aspect-square h-auto border-2 border-gray-300 border-dashed rounded-lg flex items-center justify-center text-gray-400">
              Generated image will appear here
            </div>
          )}
        </div>
      </div>

      {/* Prompt Input and Generate Button */}
      <div className="w-full mt-6 flex flex-col sm:flex-row items-center gap-4 justify-center">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt for your sketch"
          className="w-full sm:w-96 px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="w-full sm:w-auto px-8 py-2 bg-black text-white rounded-lg hover:bg-black/90 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate from Sketch'}
        </button>
      </div>
    </div>
  )
}

export default SketchCanvas
