"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Star, Send, MessageSquare, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState<"feedback" | "complaint">("feedback")
  const [rating, setRating] = useState<number>(0)
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleStarClick = (starRating: number) => {
    setRating(starRating)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate submission
    setTimeout(() => {
      setIsSubmitted(true)
    }, 1000)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md text-center">
          <CardContent className="pt-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {feedbackType === "feedback" ? "Merci pour votre avis !" : "Réclamation envoyée !"}
            </h2>
            <p className="text-gray-600 mb-4">
              {feedbackType === "feedback"
                ? "Votre feedback nous aide à améliorer nos services."
                : "Nous traiterons votre réclamation dans les plus brefs délais."}
            </p>
            {feedbackType === "complaint" && (
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-sm text-blue-800 font-medium">Numéro de réclamation</p>
                <p className="font-mono text-lg font-semibold text-blue-900">#REC-2024-001234</p>
              </div>
            )}
            <Link href="/dashboard">
              <Button className="w-full">Retour au tableau de bord</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon">
                <ArrowLeft className="h-5 w-5" />
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Feedback & Réclamations</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Type Selection */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Type de retour</CardTitle>
              <CardDescription>Choisissez le type de retour que vous souhaitez nous faire</CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={feedbackType}
                onValueChange={(value) => setFeedbackType(value as "feedback" | "complaint")}
              >
                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="feedback" id="feedback" />
                  <Label htmlFor="feedback" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <MessageSquare className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Feedback / Avis</p>
                        <p className="text-sm text-gray-600">Partagez votre expérience et suggestions</p>
                      </div>
                    </div>
                  </Label>
                </div>

                <div className="flex items-center space-x-2 p-4 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="complaint" id="complaint" />
                  <Label htmlFor="complaint" className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                      </div>
                      <div>
                        <p className="font-medium">Réclamation</p>
                        <p className="text-sm text-gray-600">Signaler un problème ou une insatisfaction</p>
                      </div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Feedback Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {feedbackType === "feedback" ? (
                  <>
                    <MessageSquare className="h-5 w-5 text-blue-600" />
                    Votre Avis
                  </>
                ) : (
                  <>
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Votre Réclamation
                  </>
                )}
              </CardTitle>
              <CardDescription>
                {feedbackType === "feedback"
                  ? "Aidez-nous à améliorer nos services en partageant votre expérience"
                  : "Décrivez le problème rencontré pour que nous puissions vous aider"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {feedbackType === "feedback" && (
                  <div className="space-y-2">
                    <Label>Note globale</Label>
                    <div className="flex items-center space-x-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleStarClick(star)}
                          className={`p-1 rounded ${
                            star <= rating ? "text-yellow-400" : "text-gray-300"
                          } hover:text-yellow-400 transition-colors`}
                        >
                          <Star className="h-8 w-8 fill-current" />
                        </button>
                      ))}
                      {rating > 0 && (
                        <span className="ml-2 text-sm text-gray-600">
                          {rating === 1 && "Très insatisfait"}
                          {rating === 2 && "Insatisfait"}
                          {rating === 3 && "Neutre"}
                          {rating === 4 && "Satisfait"}
                          {rating === 5 && "Très satisfait"}
                        </span>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="category">Catégorie</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez une catégorie" />
                    </SelectTrigger>
                    <SelectContent>
                      {feedbackType === "feedback" ? (
                        <>
                          <SelectItem value="interface">Interface utilisateur</SelectItem>
                          <SelectItem value="speed">Rapidité des transactions</SelectItem>
                          <SelectItem value="security">Sécurité</SelectItem>
                          <SelectItem value="support">Service client</SelectItem>
                          <SelectItem value="features">Fonctionnalités</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </>
                      ) : (
                        <>
                          <SelectItem value="transaction-failed">Transaction échouée</SelectItem>
                          <SelectItem value="wrong-amount">Montant incorrect</SelectItem>
                          <SelectItem value="unauthorized">Transaction non autorisée</SelectItem>
                          <SelectItem value="technical">Problème technique</SelectItem>
                          <SelectItem value="account">Problème de compte</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {feedbackType === "complaint" && (
                  <div className="space-y-2">
                    <Label htmlFor="transaction-id">Numéro de transaction (optionnel)</Label>
                    <Input id="transaction-id" placeholder="TXN-2024-XXXXXX" className="font-mono" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="description">
                    {feedbackType === "feedback" ? "Votre avis" : "Description du problème"}
                  </Label>
                  <Textarea
                    id="description"
                    placeholder={
                      feedbackType === "feedback"
                        ? "Partagez votre expérience, suggestions d'amélioration..."
                        : "Décrivez en détail le problème rencontré..."
                    }
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                <div className="flex items-center justify-between pt-4">
                  <div className="text-sm text-gray-500">
                    {feedbackType === "complaint" && <p>⏱️ Temps de traitement moyen: 24-48h</p>}
                  </div>
                  <Button
                    type="submit"
                    disabled={!category || !description || (feedbackType === "feedback" && rating === 0)}
                    className="flex items-center gap-2"
                  >
                    <Send className="h-4 w-4" />
                    {feedbackType === "feedback" ? "Envoyer l'avis" : "Envoyer la réclamation"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Quick Feedback Options */}
          {feedbackType === "feedback" && (
            <Card className="mt-6">
              <CardHeader>
                <CardTitle className="text-lg">Feedback Rapide</CardTitle>
                <CardDescription>Ou donnez-nous un retour rapide sur votre dernière transaction</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                    <span className="text-2xl">😊</span>
                    <span className="text-sm">Excellent</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                    <span className="text-2xl">🙂</span>
                    <span className="text-sm">Bien</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                    <span className="text-2xl">😐</span>
                    <span className="text-sm">Correct</span>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex-col space-y-2">
                    <span className="text-2xl">😞</span>
                    <span className="text-sm">Problème</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
