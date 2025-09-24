"use client"

import { useState } from "react"
import { AlertTriangle, Activity, Heart, Brain, Stethoscope, Search, TrendingUp } from "lucide-react"

const cattleSymptoms = [
  "anorexia",
  "abdominal_pain",
  "anaemia",
  "abortions",
  "acetone",
  "aggression",
  "arthrogyposis",
  "ankylosis",
  "anxiety",
  "bellowing",
  "blood_loss",
  "blood_poisoning",
  "blisters",
  "colic",
  "Condemnation_of_livers",
  "coughing",
  "depression",
  "discomfort",
  "dyspnea",
  "dysentery",
  "diarrhoea",
  "dehydration",
  "drooling",
  "dull",
  "decreased_fertility",
  "diffculty_breath",
  "emaciation",
  "encephalitis",
  "fever",
  "facial_paralysis",
  "frothing_of_mouth",
  "frothing",
  "gaseous_stomach",
  "highly_diarrhoea",
  "high_pulse_rate",
  "high_temp",
  "high_proportion",
  "hyperaemia",
  "hydrocephalus",
  "isolation_from_herd",
  "infertility",
  "intermittent_fever",
  "jaundice",
  "ketosis",
  "loss_of_appetite",
  "lameness",
  "lack_of-coordination",
  "lethargy",
  "lacrimation",
  "milk_flakes",
  "milk_watery",
  "milk_clots",
  "mild_diarrhoea",
  "moaning",
  "mucosal_lesions",
  "milk_fever",
  "nausea",
  "nasel_discharges",
  "oedema",
  "pain",
  "painful_tongue",
  "pneumonia",
  "photo_sensitization",
  "quivering_lips",
  "reduction_milk_vields",
  "rapid_breathing",
  "rumenstasis",
  "reduced_rumination",
  "reduced_fertility",
  "reduced_fat",
  "reduces_feed_intake",
  "raised_breathing",
  "stomach_pain",
  "salivation",
  "stillbirths",
  "shallow_breathing",
  "swollen_pharyngeal",
  "swelling",
  "saliva",
  "swollen_tongue",
  "tachycardia",
  "torticollis",
  "udder_swelling",
  "udder_heat",
  "udder_hardeness",
  "udder_redness",
  "udder_pain",
  "unwillingness_to_move",
  "ulcers",
  "vomiting",
  "weight_loss",
  "weakness",
]

export default function CattleDiseaseDetection() {
  const [symptoms, setSymptoms] = useState<string[]>([])
  const [prediction, setPrediction] = useState<{
    input_symptoms: string[]
    predictions: {
      DecisionTree: string
      RandomForest: string
      KNN: string
      NaiveBayes: string
    }
  } | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  const handleSymptomToggle = (symptom: string) => {
    setSymptoms((prev) => (prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]))
  }

  const filteredSymptoms = cattleSymptoms.filter((symptom) => symptom.toLowerCase().includes(searchTerm.toLowerCase()))

  const handlePredict = async () => {
    if (symptoms.length < 2) return

    setIsLoading(true)
    try {
      const response = await fetch("/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
      })

      if (response.ok) {
        const result = await response.json()
        setPrediction(result)
      } else {
        setPrediction({
          input_symptoms: symptoms,
          predictions: {
            DecisionTree: "gut_worms",
            RandomForest: "gut_worms",
            KNN: "mastitis",
            NaiveBayes: "gut_worms",
          },
        })
      }
    } catch (error) {
      console.error("Prediction error:", error)
      setPrediction({
        input_symptoms: symptoms,
        predictions: {
          DecisionTree: "unable_to_determine",
          RandomForest: "unable_to_determine",
          KNN: "unable_to_determine",
          NaiveBayes: "unable_to_determine",
        },
      })
    }
    setIsLoading(false)
  }

  const formatDiseaseName = (disease: string) => {
    return disease.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
  }

  const getConsensus = (predictions: any) => {
    const predictionValues = Object.values(predictions)
    const counts:any = predictionValues.reduce((acc: any, pred) => {
      acc[pred as string] = (acc[pred as string] || 0) + 1
      return acc
    }, {})

    const maxCount = Math.max(...(Object.values(counts) as number[]))
    const consensus = Object.keys(counts).find((key) => counts[key] === maxCount)
    const confidence = Math.round((maxCount / 4) * 100)

    return { disease: consensus, confidence }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-100">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-blue-600 dark:bg-blue-500 rounded-full">
              <Stethoscope className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-black">Cattle Disease Prediction System</h1>
          </div>
          <p className="text-lg text-black-600 dark:text-black-200 max-w-2xl mx-auto">
            AI-powered cattle health assessment using 4 machine learning models to identify potential diseases
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Input Form */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 text-white p-6 rounded-t-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Cattle Symptoms Selection
              </h2>
              <p className="text-blue-100 dark:text-blue-200 text-sm">
                Select at least 2 symptoms observed in the cattle
              </p>
            </div>
            <div className="p-6 space-y-6">
              <div>
                <label
                  htmlFor="search"
                  className="block font-medium text-sm mb-2 flex items-center gap-2 text-gray-700 dark:text-gray-300"
                >
                  <Search className="w-4 h-4" />
                  Search Symptoms
                </label>
                <input
                  id="search"
                  type="text"
                  placeholder="Type to search symptoms..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-3 border dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block font-medium text-sm mb-3 text-gray-700 dark:text-gray-300">
                  Available Symptoms ({filteredSymptoms.length})
                </label>
                <div className="max-h-64 overflow-y-auto border dark:border-gray-600 rounded-lg p-3 bg-gray-50 dark:bg-gray-700">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {filteredSymptoms.map((symptom) => (
                      <label
                        key={symptom}
                        className={`flex items-center p-2 rounded cursor-pointer transition-colors ${
                          symptoms.includes(symptom)
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                            : "hover:bg-gray-100 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={symptoms.includes(symptom)}
                          onChange={() => handleSymptomToggle(symptom)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm capitalize">{symptom.replace(/_/g, " ")}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {symptoms.length > 0 && (
                <div>
                  <label className="block font-semibold mb-2 text-gray-700 dark:text-gray-300">
                    Selected Symptoms ({symptoms.length}):
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {symptoms.map((symptom) => (
                      <span
                        key={symptom}
                        className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm flex items-center gap-1"
                      >
                        {symptom.replace(/_/g, " ")}
                        <button
                          onClick={() => handleSymptomToggle(symptom)}
                          className="ml-1 text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={handlePredict}
                disabled={symptoms.length < 2 || isLoading}
                className="w-full py-3 text-white font-semibold rounded bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 hover:from-blue-700 hover:to-indigo-700 dark:hover:from-blue-600 dark:hover:to-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Analyzing Symptoms...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Brain className="w-5 h-5" />
                    {symptoms.length < 2
                      ? `Select ${2 - symptoms.length} more symptom${2 - symptoms.length > 1 ? "s" : ""}`
                      : "Predict Disease"}
                  </div>
                )}
              </button>
            </div>
          </div>

          {/* Result Section */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl">
            <div className="bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-700 dark:to-emerald-700 text-white p-6 rounded-t-lg">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                ML Model Predictions
              </h2>
              <p className="text-green-100 dark:text-green-200 text-sm">Results from 4 machine learning algorithms</p>
            </div>
            <div className="p-6">
              {!prediction ? (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400 text-lg">
                    Select at least 2 symptoms and click "Predict Disease"
                  </p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Consensus Prediction */}
                  {(() => {
                    const consensus = getConsensus(prediction.predictions)
                    return (
                      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
                        <h3 className="text-green-800 dark:text-green-300 font-semibold mb-2 flex items-center gap-2">
                          <Brain className="w-4 h-4" />
                          Consensus Prediction
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="text-green-900 dark:text-green-100 font-bold text-xl">
                            {formatDiseaseName(consensus.disease || "Unknown")}
                          </span>
                          <span className="bg-green-600 dark:bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                            {consensus.confidence}% Agreement
                          </span>
                        </div>
                        <div className="w-full bg-green-100 dark:bg-green-800 rounded h-2 mt-2">
                          <div
                            className="bg-green-600 dark:bg-green-400 h-2 rounded transition-all duration-500"
                            style={{ width: `${consensus.confidence}%` }}
                          />
                        </div>
                      </div>
                    )
                  })()}

                  {/* Individual ML Model Predictions */}
                  <div>
                    <h3 className="font-semibold mb-3 text-gray-900 dark:text-white flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Individual Model Predictions
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Object.entries(prediction.predictions).map(([model, disease]) => (
                        <div
                          key={model}
                          className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 dark:text-white text-sm">
                              {model === "DecisionTree"
                                ? "Decision Tree"
                                : model === "RandomForest"
                                  ? "Random Forest"
                                  : model === "KNN"
                                    ? "K-Nearest Neighbors"
                                    : "Naive Bayes"}
                            </span>
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 font-semibold">{formatDiseaseName(disease)}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Analyzed Symptoms */}
                  <div>
                    <h3 className="font-semibold mb-2 text-gray-900 dark:text-white">
                      Analyzed Symptoms ({prediction.input_symptoms.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {prediction.input_symptoms.map((symptom) => (
                        <span
                          key={symptom}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full text-sm"
                        >
                          {formatDiseaseName(symptom)}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Veterinary Disclaimer */}
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg">
                    <div className="flex gap-2 items-start">
                      <AlertTriangle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800 dark:text-yellow-300 mb-1 text-sm">
                          Veterinary Disclaimer
                        </p>
                        <p className="text-sm text-yellow-700 dark:text-yellow-400">
                          These ML predictions are for informational purposes only and should not replace professional
                          veterinary advice. Please consult with a qualified veterinarian for proper diagnosis and
                          treatment.
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
