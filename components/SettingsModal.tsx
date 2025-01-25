import React from 'react'
import { IoClose } from 'react-icons/io5'

export interface ImageSettings {
  seed: number
  shape: 'square' | 'circle' | 'portrait' | 'landscape'
  size: string
  style: string
  quality: 'standard' | 'hd' | 'ultra-hd'
  negativePrompt: string
}

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  settings: ImageSettings
  onSettingsChange: (settings: ImageSettings) => void
}

const SettingsModal = ({ isOpen, onClose, settings, onSettingsChange }: SettingsModalProps) => {
  if (!isOpen) return null

  const handleChange = (key: keyof ImageSettings, value: any) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl w-[480px] flex flex-col max-h-[90vh]">
        <div className="p-4 border-b flex justify-between items-center shrink-0">
          <h2 className="text-lg font-semibold">Image Settings</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-md">
            <IoClose className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Seed Control */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Seed</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={settings.seed}
                  onChange={(e) => handleChange('seed', parseInt(e.target.value))}
                  className="flex-1 p-2 border rounded-xl"
                  placeholder="Enter seed number"
                />
                <button
                  onClick={() => handleChange('seed', Math.floor(Math.random() * 1000000))}
                  className="px-3 py-2 bg-slate-100 rounded-xl text-sm hover:bg-slate-200"
                >
                  Random
                </button>
              </div>
            </div>

            {/* Shape Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Output Shape</label>
              <div className="grid grid-cols-4 gap-2">
                {['square', 'circle', 'portrait', 'landscape'].map((shape) => (
                  <button
                    key={shape}
                    onClick={() => handleChange('shape', shape)}
                    className={`p-2 border rounded-xl text-sm capitalize ${
                      settings.shape === shape ? 'border-black bg-gray-100' : 'hover:bg-slate-50'
                    }`}
                  >
                    {shape}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Image Size</label>
              <select
                value={settings.size}
                onChange={(e) => handleChange('size', e.target.value)}
                className="w-full p-2 border rounded-xl"
              >
                <option value="512x512">512 x 512</option>
                <option value="768x768">768 x 768</option>
                <option value="1024x1024">1024 x 1024</option>
                <option value="1024x1536">1024 x 1536 (Portrait)</option>
                <option value="1536x1024">1536 x 1024 (Landscape)</option>
              </select>
            </div>

            {/* Style Preset */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Style Preset</label>
              <select
                value={settings.style}
                onChange={(e) => handleChange('style', e.target.value)}
                className="w-full p-2 border rounded-xl"
              >
                <option value="natural">Natural</option>
                <option value="anime">Anime</option>
                <option value="photographic">Photographic</option>
                <option value="digital-art">Digital Art</option>
                <option value="cinematic">Cinematic</option>
                <option value="cartoon">Cartoon</option>
              </select>
            </div>

            {/* Quality Selection */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Quality</label>
              <div className="grid grid-cols-3 gap-2">
                {['Standard', 'HD', 'Ultra HD'].map((quality) => (
                  <button
                    key={quality}
                    onClick={() => handleChange('quality', quality)}
                    className={`p-2 border rounded-xl text-sm capitalize ${
                      settings.quality === quality ? 'border-black bg-gray-100' : 'hover:bg-slate-50'
                    }`}
                  >
                    {quality}
                  </button>
                ))}
              </div>
            </div>

            {/* Negative Prompt */}
            <div className="space-y-2 pb-4">
              <label className="text-sm font-medium">Negative Prompt</label>
              <textarea
                value={settings.negativePrompt}
                onChange={(e) => handleChange('negativePrompt', e.target.value)}
                className="w-full p-3 border rounded-xl h-24 resize-none focus:ring-2 focus:ring-black focus:outline-none"
                placeholder="Enter things you don't want in the image..."
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t bg-slate-50 flex justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-xl hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800"
          >
            Apply Settings
          </button>
        </div>
      </div>
    </div>
  )
}

export default SettingsModal
