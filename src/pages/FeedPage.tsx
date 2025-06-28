import { useEffect, useRef, useState } from "react"
import { Video, Wifi, WifiOff, Activity, AlertCircle } from "lucide-react"
import { ControlPad } from "../components/control-pad"
import { ArrowControlPad } from "../components/Arrow-controller-pad"
import axios from "axios"
interface Prediction {
  x: number
  y: number
  width: number
  height: number
  confidence: number
  class: string
  class_id: number
  detection_id: string
}

const FeedPage = () => {
  const liveCanvasRef = useRef<HTMLCanvasElement>(null)
  const resultCanvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<number | null>(null)

  const [wsStatus, setWsStatus] = useState("Connecting...")
  const [isConnected, setIsConnected] = useState(false)
  const [direction, setDirection] = useState("")
  const [detectionStatus, setDetectionStatus] = useState("Initializing AI detection system...")
  const [frameCount, setFrameCount] = useState(0)
  const [controlStyle, setControlStyle] = useState<"text" | "arrows">("text")

  const CONTROL_API_URL = "https://8ecd-2409-40c4-43-820a-cdc1-c0ee-4cd9-6b10.ngrok-free.app/"
  const ROBOFLOW_API_KEY = "iWTbz1A2Zwcd6yJNw8F3"
  const ROBOFLOW_API_URL = "https://serverless.roboflow.com/person-detection-9a6mk/16"

  const handleDirectionStart = async (dir: string) => {
    setDirection(dir)
    try {
      const res = await fetch(CONTROL_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "ngrok-skip-browser-warning": "true",
        },
        body: JSON.stringify({ direction: dir }),
      })

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
      const data = await res.json()
      console.log("Control response:", data)
    } catch (error) {
      console.error("Error sending control command:", error)
    }
  }

  useEffect(() => {
    const liveCanvas = liveCanvasRef.current
    const resultCanvas = resultCanvasRef.current
    if (!liveCanvas || !resultCanvas) return

    const liveCtx = liveCanvas.getContext("2d")
    const resultCtx = resultCanvas.getContext("2d")
    if (!liveCtx || !resultCtx) return

    const liveSocket = new WebSocket("wss://98e5-2409-40c4-43-820a-5394-304d-cafb-c0df.ngrok-free.app/share")
    liveSocket.binaryType = "arraybuffer"
    let liveBuffer = new Uint8Array(0)
    let frameIndex = 0

    liveSocket.onopen = () => {
      setWsStatus("Connected to Camera")
      setIsConnected(true)
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

          img.onload = async () => {
            liveCanvas.width = img.width
            liveCanvas.height = img.height
            resultCanvas.width = img.width
            resultCanvas.height = img.height

            liveCtx.drawImage(img, 0, 0)
            resultCtx.drawImage(img, 0, 0)

            URL.revokeObjectURL(url)
            setFrameCount(prev => prev + 1)

            frameIndex++
            if (frameIndex % 10 !== 0) return

            try {
              const frameBase64 = liveCanvas.toDataURL("image/jpeg").split(",")[1]

              const response = await axios({
                method: "POST",
                url: ROBOFLOW_API_URL,
                params: { api_key: ROBOFLOW_API_KEY },
                data: frameBase64,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
              })

              const predictions = response.data.predictions as Prediction[]
              setDetectionStatus(`${predictions.length} personas detected`)

              resultCtx.drawImage(img, 0, 0)
              resultCtx.strokeStyle = "lime"
              resultCtx.lineWidth = 2
              resultCtx.font = "14px Arial"
              resultCtx.fillStyle = "lime"

              predictions.forEach((pred) => {
                const { x, y, width, height, confidence } = pred
                resultCtx.strokeRect(x - width / 2, y - height / 2, width, height)
                resultCtx.fillText(`${(confidence * 100).toFixed(1)}%`, x - width / 2, y - height / 2 - 5)
              })
            } catch (error: unknown) {
              const err = error as Error
              console.error("Detection error:", err.message)
              setDetectionStatus("Detection failed")
            }
          }
        } else break
      }
    }

    liveSocket.onclose = () => {
      setIsConnected(false)
      setWsStatus("Disconnected from Camera")
    }

    liveSocket.onerror = () => {
      setIsConnected(false)
      setWsStatus("Error connecting to Camera")
    }

    return () => {
      liveSocket.close()
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 pt-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Live Feed Monitoring</h1>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium transition-colors ${isConnected
              ? "bg-green-100 text-green-700 border border-green-200"
              : "bg-red-100 text-red-700 border border-red-200"
              }`}>
              {isConnected ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
              <span>WebSocket: {wsStatus}</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-700 border border-blue-200">
              <Activity className="h-4 w-4" />
              <span>AI Detection Active</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Video className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">📹 Live Camera Feed</h3>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setControlStyle("text")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${controlStyle === "text"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Text
                </button>
                <button
                  onClick={() => setControlStyle("arrows")}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${controlStyle === "arrows"
                    ? "bg-blue-100 text-blue-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                >
                  Arrows
                </button>
              </div>
            </div>

            <div className="relative">
              <canvas ref={liveCanvasRef} width="640" height="480" className="w-full h-auto bg-gray-900 rounded-lg border-2 border-gray-200" />
              <div className="absolute top-4 left-4">
                <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium ${isConnected
                  ? "bg-green-500/20 text-green-300 border border-green-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}>
                  <div className={`w-2 h-2 rounded-full ${isConnected ? "bg-green-400 animate-pulse" : "bg-red-400"}`}></div>
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

            {controlStyle === "text" ? (
              <ControlPad onDirectionStart={handleDirectionStart} currentDirection={direction} />
            ) : (
              <ArrowControlPad onDirectionStart={handleDirectionStart} currentDirection={direction} />
            )}
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="bg-emerald-100 p-2 rounded-lg">
                <AlertCircle className="h-5 w-5 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900">🧠 Detection Results</h3>
            </div>

            <div className="relative">
              <canvas ref={resultCanvasRef} width="640" height="480" className="w-full h-auto bg-gray-900 rounded-lg border-2 border-gray-200" />
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
      </div>
    </div>
  )
}

export default FeedPage
