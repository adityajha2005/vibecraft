import React from 'react'
import MinimizeButton from './MinimizeButton'

interface PromptPanelProps {
  prompt: string
  setPrompt: (prompt: string) => void
  history: string[]
  handlePromptSubmit: (e: React.FormEvent) => void
  isMinimized: boolean
  onMinimize: () => void
}

const PromptPanel = ({
  prompt,
  setPrompt,
  history,
  handlePromptSubmit,
  isMinimized,
  onMinimize
}: PromptPanelProps) => {
  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col max-h-[350px] sm:max-h-[450px]">
      <div className="p-3 sm:p-4 border-b flex justify-between items-center">
        <h2 className="text-sm sm:text-base font-semibold">Prompt Assistant</h2>
        <div className="flex items-center gap-2">
          <span className="text-xs sm:text-sm text-slate-500">{history.length} prompts</span>
          <MinimizeButton isMinimized={isMinimized} onClick={onMinimize} />
        </div>
      </div>
      
      {!isMinimized && (
        <>
          <div className="flex-1 overflow-auto p-2 sm:p-3 max-h-[200px] sm:max-h-[250px]">
            {history.map((item, index) => (
              <div 
                key={index} 
                className="p-2 sm:p-3 bg-slate-50 rounded-lg mb-2 text-xs sm:text-sm hover:bg-slate-100 cursor-pointer"
                onClick={() => setPrompt(item)}
              >
                {item}
              </div>
            ))}
          </div>

          <form onSubmit={handlePromptSubmit} className="p-3 sm:p-4 border-t">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your prompt here..."
              className="w-full p-2 sm:p-3 border rounded-lg resize-none h-[80px] sm:h-[100px] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-black"
            />
            <button 
              type="submit"
              className="mt-2 sm:mt-3 w-full bg-black text-white py-2 sm:py-2.5 rounded-lg hover:bg-black/90 text-xs sm:text-sm font-medium transition-colors"
            >
              Generate Image
            </button>
          </form>
        </>
      )}
    </div>
  )
}

export default PromptPanel
