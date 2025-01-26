import Link from 'next/link'
import { 
  IoAdd, IoRemove, IoHome, IoDownloadOutline, 
  IoSparklesOutline, IoCopyOutline, IoSettings, IoBrush 
} from 'react-icons/io5'

interface ToolbarProps {
  scale: number
  setScale: (scale: number) => void
  isSketchMode: boolean
  setIsSketchMode: (mode: boolean) => void
  displayImage: string | null
  isEnhancing: boolean
  setIsEnhancing: (enhancing: boolean) => void
  setIsSettingsOpen: (open: boolean) => void
  handleDownload: () => void
}

const Toolbar = ({ 
  scale, setScale, isSketchMode, setIsSketchMode,
  displayImage, isEnhancing, setIsEnhancing,
  setIsSettingsOpen, handleDownload 
}: ToolbarProps) => {
  return (
    <div className="fixed top-0 left-0 right-0 h-auto min-h-[56px] bg-white border-b shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between p-2 sm:px-6 z-50">
      <div className="flex items-center space-x-4 w-full sm:w-auto justify-between sm:justify-start">
        <Link href="/">
          <button className="p-2.5 hover:bg-slate-100 rounded-md">
            <IoHome className="w-5 h-5" />
          </button>
        </Link>
        <div className="flex items-center space-x-2">
          <button 
            onClick={() => setScale(scale + 0.1)}
            className="p-2.5 hover:bg-slate-100 rounded-md"
          >
            <IoAdd className="w-5 h-5" />
          </button>
          <span className="text-sm font-medium w-12 text-center">
            {Math.round(scale * 100)}%
          </span>
          <button 
            onClick={() => setScale(Math.max(0.5, scale - 0.1))}
            className="p-2.5 hover:bg-slate-100 rounded-md"
          >
            <IoRemove className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex items-center space-x-3 w-full sm:w-auto justify-end mt-2 sm:mt-0">
        <button
          onClick={handleDownload}
          disabled={!displayImage}
          className="p-2.5 hover:bg-slate-100 rounded-md flex items-center gap-2 disabled:opacity-50 text-sm font-medium"
        >
          <IoDownloadOutline className="w-5 h-5" />
          <span className="hidden sm:inline">Download</span>
        </button>

        <button
          onClick={() => setIsEnhancing(!isEnhancing)}
          disabled={!displayImage}
          className={`p-2.5 rounded-md flex items-center gap-2 text-sm font-medium ${
            isEnhancing ? 'bg-black text-white' : 'hover:bg-slate-100'
          } disabled:opacity-50`}
        >
          <IoSparklesOutline className="w-5 h-5" />
          <span className="hidden sm:inline">Analyze</span>
        </button>

        <button
          onClick={() => setIsSettingsOpen(true)}
          className="p-2.5 hover:bg-slate-100 rounded-md flex items-center gap-2 text-sm font-medium"
        >
          <IoSettings className="w-5 h-5" />
          <span className="hidden sm:inline">Settings</span>
        </button>

        <button
          onClick={() => setIsSketchMode(!isSketchMode)}
          className={`p-2.5 rounded-md flex items-center gap-2 ${
            isSketchMode ? 'bg-black text-white' : 'hover:bg-slate-100'
          } text-sm font-medium`}
        >
          <IoBrush className="w-5 h-5" />
          <span className="hidden sm:inline">{isSketchMode ? 'View Mode' : 'Sketch Mode'}</span>
        </button>
      </div>
    </div>
  )
}

export default Toolbar
