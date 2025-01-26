import React, { useRef, useEffect, useState } from 'react'
import { IoTrashBin } from 'react-icons/io5'

interface SketchCanvasProps {
  activeColor: string
  brushSize: number
  setBrushSize: (size: number) => void
  setActiveColor: (color: string) => void
  onGenerate: (dataUrl: string, prompt: string) => void
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

  useEffect(() => {
    if (canvasRef.current && canvasWrapperRef.current) {
      const canvas = canvasRef.current
      const wrapper = canvasWrapperRef.current
      
      canvas.style.width = '100%'
      canvas.style.height = '100%'
      
      canvas.width = wrapper.clientWidth
      canvas.height = wrapper.clientHeight
      
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
      contextRef.current.strokeStyle = activeColor
      contextRef.current.lineWidth = brushSize
    }
  }, [activeColor, brushSize])

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

  const startDrawing = (e: React.MouseEvent) => {
    if (!contextRef.current) return
    const pos = getMousePos(e)
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

  const stopDrawing = () => {
    if (!contextRef.current) return
    contextRef.current.closePath()
    setIsDrawing(false)
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current
    const context = contextRef.current
    if (canvas && context) {
      context.clearRect(0, 0, canvas.width, canvas.height)
    }
  }

  const handleGenerate = () => {
    if (!canvasRef.current || !prompt.trim()) return
    const sketchDataUrl = canvasRef.current.toDataURL('image/png')
    onGenerate(sketchDataUrl, prompt)
  }

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
      <div className="w-full sm:w-auto bg-white p-2 rounded-lg shadow-lg flex gap-2 mb-4 sm:absolute sm:top-4 sm:left-4 z-10">
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
      </div>

      <div 
        ref={canvasWrapperRef}
        className="relative w-full max-w-[1200px] h-[calc(80vh-80px)] sm:h-[calc(85vh-80px)] flex justify-center items-center"
      >
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border-2 border-gray-300 rounded-lg bg-white cursor-crosshair absolute inset-0 shadow-lg"
        />
      </div>

      <div className="w-full sm:w-auto mt-6 mb-8 flex flex-col items-center gap-4">
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt for your sketch"
          className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg"
        />
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !prompt.trim()}
          className="px-8 py-3 bg-black text-white rounded-lg hover:bg-black/90 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate from Sketch'}
        </button>
      </div>
    </div>
  )
}

export default SketchCanvas
