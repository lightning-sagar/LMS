import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Square } from "lucide-react"
import { DirectionButton } from "./direction-button"

interface ArrowControlPadProps {
  onDirectionStart: (direction: string) => void
  currentDirection?: string
}

export const ArrowControlPad = ({ onDirectionStart, currentDirection }: ArrowControlPadProps) => {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Directional Controls</h4>
      <div className="grid grid-cols-3 gap-2 max-w-48 mx-auto">
        <div></div>
        <DirectionButton
          direction="f"
          onClick={onDirectionStart}
          className="aspect-square flex items-center justify-center"
        >
          <ChevronUp className="h-5 w-5" />
        </DirectionButton>
        <div></div>

        {/* Middle Row */}
        <DirectionButton
          direction="a"
          onClick={onDirectionStart}
          className="aspect-square flex items-center justify-center"
        >
          <ChevronLeft className="h-5 w-5" />
        </DirectionButton>
        <DirectionButton
          direction="s"
          onClick={onDirectionStart}
          variant="danger"
          className="aspect-square flex items-center justify-center"
        >
          <Square className="h-4 w-4" />
        </DirectionButton>
        <DirectionButton
          direction="c"
          onClick={onDirectionStart}
          className="aspect-square flex items-center justify-center"
        >
          <ChevronRight className="h-5 w-5" />
        </DirectionButton>

        {/* Bottom Row */}
        <div></div>
        <DirectionButton
          direction="b"
          onClick={onDirectionStart}
          className="aspect-square flex items-center justify-center"
        >
          <ChevronDown className="h-5 w-5" />
        </DirectionButton>
        <div></div>
      </div>

      {currentDirection && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Active: {currentDirection.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
