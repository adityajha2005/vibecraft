import { IoCamera, IoVideocam, IoVideocamOff } from 'react-icons/io5'
import MinimizeButton from './MinimizeButton'

interface CameraPanelProps {
  isCameraActive: boolean
  setIsCameraActive: (active: boolean) => void
  isMinimized: boolean
  onMinimize: () => void
}

const CameraPanel = ({ isCameraActive, setIsCameraActive, isMinimized, onMinimize }: CameraPanelProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg">
      <div className="p-3 sm:p-4 border-b flex justify-between items-center">
        <h2 className="text-sm sm:text-base font-semibold">Camera Preview</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsCameraActive(!isCameraActive)}
            className={`p-2 rounded-md ${isCameraActive ? 'bg-red-500 text-white' : 'bg-slate-100'}`}
          >
            {isCameraActive ? <IoVideocamOff /> : <IoVideocam />}
          </button>
          <MinimizeButton isMinimized={isMinimized} onClick={onMinimize} />
        </div>
      </div>
      
      {!isMinimized && (
        <div className="aspect-video relative bg-slate-900 overflow-hidden">
          {isCameraActive ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              muted
              playsInline
            />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              <IoCamera size={24} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default CameraPanel
