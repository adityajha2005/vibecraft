import { IoChevronDown, IoChevronUp } from 'react-icons/io5'

interface MinimizeButtonProps {
  isMinimized: boolean
  onClick: () => void
}

const MinimizeButton = ({ isMinimized, onClick }: MinimizeButtonProps) => {
  return (
    <button
      onClick={onClick}
      className="p-1 hover:bg-slate-100 rounded-md"
      title={isMinimized ? 'Expand' : 'Minimize'}
    >
      {isMinimized ? (
        <IoChevronUp className="w-4 h-4" />
      ) : (
        <IoChevronDown className="w-4 h-4" />
      )}
    </button>
  )
}

export default MinimizeButton
