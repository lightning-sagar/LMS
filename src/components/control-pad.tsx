"use client"

import { DirectionButton } from "./direction-button"

interface ControlPadProps {
  onDirectionStart: (direction: string) => void
  onDirectionStop: () => void
  currentDirection?: string
}

export const ControlPad = ({ onDirectionStart, onDirectionStop, currentDirection }: ControlPadProps) => {
  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium text-gray-700 mb-3">Vehicle Controls</h4>
      <div className="grid grid-cols-3 gap-2">
        {/* Top Row */}
        <div></div>
        <DirectionButton direction="f" onMouseEnter={onDirectionStart} onMouseLeave={onDirectionStop}>
          ↑ Forward
        </DirectionButton>
        <div></div>

        {/* Middle Row */}
        <DirectionButton direction="a" onMouseEnter={onDirectionStart} onMouseLeave={onDirectionStop}>
          ← Left
        </DirectionButton>
        <DirectionButton
          direction="s"
          onMouseEnter={onDirectionStart}
          onMouseLeave={onDirectionStop}
          variant="danger"
        >
          ⏹ Stop
        </DirectionButton>
        <DirectionButton direction="c" onMouseEnter={onDirectionStart} onMouseLeave={onDirectionStop}>
          → Right
        </DirectionButton>

        {/* Bottom Row */}
        <div></div>
        <DirectionButton direction="b" onMouseEnter={onDirectionStart} onMouseLeave={onDirectionStop}>
          ↓ Backward
        </DirectionButton>
        <div></div>
      </div>

      {/* Current Direction Indicator */}
      {currentDirection && (
        <div className="mt-3 text-center">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
            <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
            <span>Moving: {currentDirection.toUpperCase()}</span>
          </div>
        </div>
      )}
    </div>
  )
}
