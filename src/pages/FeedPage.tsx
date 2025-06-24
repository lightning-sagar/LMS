import { useEffect, useRef, useState } from "react"
import { Video, Wifi, WifiOff, Activity, AlertCircle } from "lucide-react"

const FeedPage = () => {
  const liveCanvasRef = useRef<HTMLCanvasElement>(null)
  const resultCanvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<number | null>(null)

  const [wsStatus, setWsStatus] = useState("Connecting...")
  const [isConnected, setIsConnected] = useState(false)
  const [direction, setDirection] = useState("")
  const [detectionStatus, setDetectionStatus] = useState("Initializing AI detection system...")
  const [frameCount, setFrameCount] = useState(0)
  const [frameState] = useState<'original' | 'ai'>('original')

  // Configuration - you can move these to environment variables
  const CONTROL_API_URL = "https://your-ngrok-url.ngrok-free.app/" // Replace with your actual URL

  const handleMouseEnter = (dir: string) => {
    setDirection(dir)
    intervalRef.current = setInterval(async () => {
      console.log("Sending direction:", dir)
      try {
        const res = await fetch(CONTROL_API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "ngrok-skip-browser-warning": "true",
          },
          body: JSON.stringify({ direction: dir }),
        })

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`)
        }

        const data = await res.json()
        console.log("Control response:", data)
      } catch (error) {
        console.error("Error sending control command:", error)
      }
    }, 500)
  }

  const handleMouseLeave = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
    setDirection("")
  }
useEffect(() => {
  const liveCanvas = liveCanvasRef.current
  const resultCanvas = resultCanvasRef.current
  if (!liveCanvas || !resultCanvas) return

  const liveCtx = liveCanvas.getContext("2d")
  const resultCtx = resultCanvas.getContext("2d")
  if (!liveCtx || !resultCtx) return

  // --- ORIGINAL CAMERA FEED
  const liveSocket = new WebSocket("ws://localhost:8000/share")
  liveSocket.binaryType = "arraybuffer"
  let liveBuffer = new Uint8Array(0)

  // --- AI DETECTION FEED
  const aiSocket = new WebSocket("ws://localhost:8080/ws")
  aiSocket.binaryType = "arraybuffer"
  let aiBuffer = new Uint8Array(0)

  liveSocket.onopen = () => {
    setWsStatus("Connected to Camera")
    setIsConnected(true)
  }

  aiSocket.onopen = () => {
    setDetectionStatus("Connected to AI Detection Service")
  }

  liveSocket.onmessage = (event) => {
    const newData = new Uint8Array(event.data)
    liveBuffer = new Uint8Array([...liveBuffer, ...newData])

    while (liveBuffer.length >= 8) {
      const sizeData = new DataView(liveBuffer.buffer, 0, 8)
      const frameSize = Number(sizeData.getBigUint64(0, true))

      if (liveBuffer.length >= 8 + frameSize) {
        const frameData = liveBuffer.slice(8, 8 + frameSize)
        liveBuffer = liveBuffer.slice(8 + frameSize)

        const blob = new Blob([frameData], { type: "image/jpeg" })
        const url = URL.createObjectURL(blob)
        const img = new Image()
        img.src = url

        img.onload = () => {
          liveCanvas.width = img.width
          liveCanvas.height = img.height
          liveCtx.drawImage(img, 0, 0)
          URL.revokeObjectURL(url)
        }

        // Send raw frame to AI WebSocket
        if (aiSocket.readyState === WebSocket.OPEN) {
          aiSocket.send(frameData)
        }

      } else break
    }
  }

  aiSocket.onmessage = (event) => {
    const newData = new Uint8Array(event.data)
    aiBuffer = new Uint8Array([...aiBuffer, ...newData])

    while (aiBuffer.length >= 8) {
      const sizeData = new DataView(aiBuffer.buffer, 0, 8)
      const frameSize = Number(sizeData.getBigUint64(0, true))

      if (aiBuffer.length >= 8 + frameSize) {
        const frameData = aiBuffer.slice(8, 8 + frameSize)
        aiBuffer = aiBuffer.slice(8 + frameSize)

        const blob = new Blob([frameData], { type: "image/jpeg" })
        const url = URL.createObjectURL(blob)
        const img = new Image()
        img.src = url

        img.onload = () => {
          resultCanvas.width = img.width
          resultCanvas.height = img.height
          resultCtx.drawImage(img, 0, 0)
          setFrameCount((prev) => prev + 1)
          URL.revokeObjectURL(url)
        }
      } else break
    }
  }

  liveSocket.onclose = () => {
    setIsConnected(false)
    setWsStatus("Disconnected from Camera")
  }

  aiSocket.onerror = () => {
    setDetectionStatus("Error connecting to AI Detection")
  }

  aiSocket.onclose = () => {
    setDetectionStatus("AI Detection Disconnected")
  }

  return () => {
    liveSocket.close()
    aiSocket.close()
    if (intervalRef.current) clearInterval(intervalRef.current)
  }
}, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Feed Monitoring</h1>
          <div className="flex items-center space-x-4">
            <div
              className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                isConnected
                  ? "bg-green-100 text-green-700 border border-green-200"
                  : "bg-red-100 text-red-700 border border-red-200"
              }`}
            >
              {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span>WebSocket: {wsStatus}</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
              <Activity className="h-4 w-4" />
              <span>AI Detection Active</span>
            </div>
            {direction && (
              <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700 border border-purple-200">
                <span>Direction: {direction.toUpperCase()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Video Feed Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Live Camera Feed */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Video className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">📹 Live Camera Feed</h3>
            </div>

            <div className="relative">
  <canvas
    ref={liveCanvasRef}
    width="640"
    height="480"
    className={`absolute top-0 left-0 w-full h-auto bg-gray-900 rounded-lg border-2 border-gray-200 ${frameState === 'original' ? '' : 'hidden'}`}
  />
  <canvas
    ref={resultCanvasRef}
    width="640"
    height="480"
    className={`absolute top-0 left-0 w-full h-auto bg-gray-900 rounded-lg border-2 border-gray-200 ${frameState === 'ai' ? '' : 'hidden'}`}
  />
  <div className="absolute top-4 left-4">
    <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${
      isConnected
        ? "bg-green-500/20 text-green-300 border border-green-500/30"
        : "bg-red-500/20 text-red-300 border border-red-500/30"
    }`}>
      <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400" : "bg-red-400"} ${isConnected ? "animate-pulse" : ""}`}></div>
      <span>{isConnected ? "LIVE" : "OFFLINE"}</span>
    </div>
  </div>
</div>


            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span>Streaming • AI Analysis Active</span>
                </div>
                <span>Frames: {frameCount}</span>
              </div>
            </div>

            {/* Control Buttons */}
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div></div>
              <button
                onMouseEnter={() => handleMouseEnter("forward")}
                onMouseLeave={handleMouseLeave}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Forward
              </button>
              <div></div>
              <button
                onMouseEnter={() => handleMouseEnter("left")}
                onMouseLeave={handleMouseLeave}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Left
              </button>
              <button
                onMouseEnter={() => handleMouseEnter("stop")}
                onMouseLeave={handleMouseLeave}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Stop
              </button>
              <button
                onMouseEnter={() => handleMouseEnter("right")}
                onMouseLeave={handleMouseLeave}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Right
              </button>
              <div></div>
              <button
                onMouseEnter={() => handleMouseEnter("backward")}
                onMouseLeave={handleMouseLeave}
                className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
              >
                Backward
              </button>
              <div></div>
            </div>
          </div>

          {/* Detection Results */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">🧠 Detection Results</h3>
            </div>

            <div className="relative">
              <canvas
                ref={resultCanvasRef}
                width="640"
                height="480"
                className="w-full h-auto bg-gray-900 rounded-lg border-2 border-gray-200"
              />
              <div className="absolute top-4 left-4">
                <div className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-medium">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                    <span>AI PROCESSING</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Activity className="h-4 w-4 text-emerald-600" />
                <span className="font-medium text-gray-900">Detection Status:</span>
              </div>
              <p className="text-gray-700 text-sm">{detectionStatus}</p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">System Information</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <div className="text-sm text-blue-600 font-medium mb-1">Stream Quality</div>
              <div className="text-lg font-bold text-blue-900">640x480</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200">
              <div className="text-sm text-green-600 font-medium mb-1">Connection</div>
              <div className="text-lg font-bold text-green-900">{isConnected ? "Active" : "Inactive"}</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <div className="text-sm text-purple-600 font-medium mb-1">AI Model</div>
              <div className="text-lg font-bold text-purple-900">Roboflow</div>
            </div>
            <div className="p-4 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg border border-orange-200">
              <div className="text-sm text-orange-600 font-medium mb-1">Total Frames</div>
              <div className="text-lg font-bold text-orange-900">{frameCount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FeedPage
