import { useNavigate } from 'react-router-dom'

interface BackButtonProps {
  size?: 'sm' | 'md' | 'lg'
}

export default function BackButton({ size = 'md' }: BackButtonProps) {
  const navigate = useNavigate()

  const sizeClasses = {
    sm: 'text-sm px-2 py-1',
    md: 'text-base px-3 py-2',
    lg: 'text-lg px-4 py-3',
  }

  return (
    <button
      onClick={() => navigate(-1)}
      className={`flex items-center gap-1 text-gray-400 hover:border-grey 500 ${sizeClasses[size]}`}
    >
      ← Back
    </button>
  )
}