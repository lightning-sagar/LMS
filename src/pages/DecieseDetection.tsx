"use client"

import { useState } from "react"
import { AlertTriangle, Activity, Heart, Brain, Stethoscope, User, Thermometer, Construction } from "lucide-react"

export default function DiseaseDetection() {
  const [symptoms, _] = useState<string[]>([])
  const [prediction, setPrediction] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  // const handleSymptomToggle = (symptom: string) => {
  //   setSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  // }

  const handlePredict = () => {
    setIsLoading(true)
    setTimeout(() => {
      setPrediction({
        primaryDiagnosis: "Common Cold",
        confidence: 78,
        alternativeDiagnoses: [
          { name: "Seasonal Allergies", confidence: 65 },
          { name: "Viral Infection", confidence: 52 },
          { name: "Sinusitis", confidence: 34 },
        ],
        recommendations: [
          "Get plenty of rest",
          "Stay hydrated",
          "Consider over-the-counter medications",
          "Consult a healthcare provider if symptoms worsen",
        ],
      })
      setIsLoading(false)
    }, 2000)
  }

  return (
    <div className="min-h-screen  from-blue-50 to-indigo-100 to-green-600/10 relative">
      {/* Transparent Building Overlay Card */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
        <div className="green-600/10 backdrop-blur-sm border-2 border-yellow-400/50 dark:border-yellow-300/50 rounded-2xl p-8 shadow-2xl pointer-events-auto">
          <div className="flex flex-col items-center space-y-4">
            <div className="relative">
              <Construction className="w-16 h-16 text-yellow-500 dark:text-yellow-400 animate-bounce" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-yellow-600 dark:text-yellow-400 mb-2 tracking-wider">BUILDING</h2>
              <p className="text-yellow-700 dark:text-yellow-300 font-medium text-lg">Feature Under Development</p>
              <p className="text-yellow-600 dark:text-yellow-400 text-sm mt-2 opacity-80">Coming Soon...</p>
            </div>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Original Warning Banner */}
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 dark:bg-yellow-600 text-black dark:text-white text-center py-2 px-4 font-semibold z-40 shadow-lg">
        <div className="flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          BUILDING - This page is under development
          <AlertTriangle className="w-4 h-4" />
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 pt-20">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-full">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-black">Disease Prediction System</h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Advanced AI-powered health assessment tool to help identify potential conditions based on your symptoms
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white p-6 rounded-t-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <User className="w-5 h-5" />
                Patient Information & Symptoms
              </h2>
              <p className="text-blue-100 dark:text-blue-200 text-sm">
                Please provide your details and select your symptoms
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="temperature"
                  className="block font-medium text-sm mb-1 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Thermometer className="w-4 h-4" />
                  Body Temperature (°F)
                </label>
                <input
                  id="temperature"
                  type="number"
                  step="0.1"
                  placeholder="98.6"
                  className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

            

              <div>
                <label htmlFor="additional" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                   Symptoms or Notes
                </label>
                <textarea
                  id="additional"
                  rows={3}
                  className="w-full p-2 border dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Describe any other symptoms..."
                />
              </div>

              {symptoms.length > 0 && (
                <div>
                  <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Selected Symptoms:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                      >
                        {symptom}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handlePredict}
                disabled={symptoms.length === 0 || isLoading}
                className="w-full py-3 text-white font-semibold rounded bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing Symptoms...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="w-5 h-5" />
                    Predict Disease
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white p-6 rounded-t-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Prediction Results
              </h2>
              <p className="text-green-100 dark:text-green-200 text-sm">AI-powered analysis of your symptoms</p>
            </div>
            <div className="p-6">
              {!prediction ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Select your symptoms and click "Predict Disease"
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                    <h3 className="text-green-800 dark:text-green-300 font-semibold mb-2">Primary Diagnosis</h3>
                    <div className="flex items-center justify-between">
                      <span className="text-green-900 dark:text-green-100 font-bold text-xl">
                        {prediction.primaryDiagnosis}
                      </span>
                      <span className="bg-green-600 dark:bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                        {prediction.confidence}%
                      </span>
                    </div>
                    <div className="w-full bg-green-100 dark:bg-green-800 rounded h-2 mt-2">
                      <div
                        className="bg-green-600 dark:bg-green-400 h-2 rounded"
                        style={{ width: `${prediction.confidence}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Alternative Possibilities</h3>
                    <div className="space-y-2">
                      {prediction.alternativeDiagnoses.map((alt: any, index: number) => (
                        <div
                          key={index}
                          className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded"
                        >
                          <span className="text-gray-900 dark:text-white">{alt.name}</span>
                          <div className="flex items-center gap-2">
                            <div className="w-20 h-2 bg-gray-200 dark:bg-gray-600 rounded">
                              <div
                                className="h-2 bg-blue-500 dark:bg-blue-400 rounded"
                                style={{ width: `${alt.confidence}%` }}
                              />
                            </div>
                            <span className="text-sm text-gray-600 dark:text-gray-300">{alt.confidence}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">Recommendations</h3>
                    <ul className="space-y-1">
                      {prediction.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="w-2 h-2 bg-blue-600 dark:bg-blue-400 rounded-full mt-2" />
                          <span className="text-gray-700 dark:text-gray-300">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <div className="flex gap-2 items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1 text-sm">
                          Medical Disclaimer
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          This prediction is for informational purposes only and should not replace professional medical
                          advice. Please consult with a healthcare provider.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
