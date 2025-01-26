import { FaPencilAlt, FaMagic, FaDownload, FaShare } from 'react-icons/fa'

const features = [
  {
    icon: <FaPencilAlt className="w-6 h-6" />,
    title: "Free-hand Drawing",
    description: "Create detailed sketches with customizable brush sizes and colors"
  },
  {
    icon: <FaMagic className="w-6 h-6" />,
    title: "AI Enhancement",
    description: "Transform your sketches into polished artwork with AI"
  },
  {
    icon: <FaDownload className="w-6 h-6" />,
    title: "Easy Export",
    description: "Download your creations in high quality"
  },
  {
    icon: <FaShare className="w-6 h-6" />,
    title: "Quick Share",
    description: "Share your artwork directly with others"
  }
]

const SketchFeatures = () => {
  return (
    <div className="w-full bg-white/50 backdrop-blur-sm py-6 rounded-lg shadow-sm">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 px-4">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center p-4">
            <div className="bg-black/5 p-3 rounded-full mb-3">
              {feature.icon}
            </div>
            <h3 className="font-medium mb-1">{feature.title}</h3>
            <p className="text-sm text-gray-600">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SketchFeatures
