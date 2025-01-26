import { IoLogoGithub, IoHeartOutline } from 'react-icons/io5'

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm border-t py-2 px-4 flex justify-between items-center text-xs text-gray-600 z-10">
      <div className="flex items-center gap-2">
        <span>VibeCraft v1.0.0</span>
        <span className="hidden sm:inline">•</span>
        <span className="hidden sm:flex items-center gap-1">
          Made with <IoHeartOutline className="w-3 h-3" /> by VibeCraft Team
        </span>
      </div>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/2005akjha/vibecraft"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-black flex items-center gap-1"
        >
          <IoLogoGithub className="w-4 h-4" />
          <span className="hidden sm:inline">GitHub</span>
        </a>
      </div>
    </footer>
  )
}

export default Footer
