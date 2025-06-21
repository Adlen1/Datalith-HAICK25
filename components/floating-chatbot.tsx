"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Minimize2,
  Maximize2,
  HelpCircle,
  CreditCard,
  History,
  Settings,
  Mic,
  MicOff,
} from "lucide-react"
import Image from "next/image"

interface Message {
  id: string
  type: "user" | "bot"
  content: string
  timestamp: Date
}

export function FloatingChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "bot",
      content: "Bonjour ! Je suis votre assistant SATIM. Comment puis-je vous aider aujourd'hui ?",
      timestamp: new Date(),
    },
  ])
  const [inputValue, setInputValue] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [audioChunks, setAudioChunks] = useState<Blob[]>([])

  const quickActions = [
    { icon: <CreditCard className="h-4 w-4" />, text: "Faire un paiement", action: "payment" },
    { icon: <History className="h-4 w-4" />, text: "Voir l'historique", action: "history" },
    { icon: <Settings className="h-4 w-4" />, text: "Paramètres du compte", action: "settings" },
    { icon: <HelpCircle className="h-4 w-4" />, text: "Aide et support", action: "help" },
  ]

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const recorder = new MediaRecorder(stream)

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          setAudioChunks((prev) => [...prev, event.data])
        }
      }

      recorder.onstop = () => {
        // Simulate voice-to-text conversion
        setTimeout(() => {
          const voiceMessage = "Quel est mon solde actuel ?" // Simulated transcription
          setInputValue(voiceMessage)
          setIsRecording(false)
        }, 1000)

        // Stop all tracks
        stream.getTracks().forEach((track) => track.stop())
      }

      setMediaRecorder(recorder)
      recorder.start()
      setIsRecording(true)
      setAudioChunks([])

      // Auto-stop after 10 seconds
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop()
        }
      }, 10000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Impossible d'accéder au microphone. Veuillez vérifier les permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state === "recording") {
      mediaRecorder.stop()
    }
  }

  const handleVoiceInput = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: inputValue,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue("")

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: "bot",
        content: getBotResponse(inputValue),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, botResponse])
    }, 1000)
  }

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase()

    if (input.includes("solde") || input.includes("balance")) {
      return "Votre solde actuel est de 125,750.00 DZD. Souhaitez-vous voir plus de détails sur votre compte ?"
    }
    if (input.includes("paiement") || input.includes("payer")) {
      return "Je peux vous aider à effectuer un paiement. Voulez-vous payer une facture ou faire un virement ?"
    }
    if (input.includes("historique") || input.includes("transaction")) {
      return "Vous pouvez consulter votre historique de transactions dans la section 'Historique'. Voulez-vous que je vous y dirige ?"
    }
    if (input.includes("aide") || input.includes("help")) {
      return "Je suis là pour vous aider ! Vous pouvez me poser des questions sur vos comptes, transactions, ou utiliser les actions rapides ci-dessous."
    }

    return "Je comprends votre demande. Pour une assistance plus détaillée, vous pouvez utiliser les actions rapides ou contacter notre support client."
  }

  const handleQuickAction = (action: string) => {
    const actionMessages = {
      payment:
        "Je vous redirige vers la page de paiement. Vous pourrez y effectuer des virements ou payer des factures en toute sécurité.",
      history:
        "Voici le lien vers votre historique de transactions où vous pouvez consulter toutes vos opérations récentes.",
      settings:
        "Accédez à vos paramètres de compte pour modifier vos informations personnelles et préférences de sécurité.",
      help: "Notre centre d'aide contient des guides détaillés. Vous pouvez aussi contacter notre support 24/7 au +213 21 XX XX XX.",
    }

    const botMessage: Message = {
      id: Date.now().toString(),
      type: "bot",
      content: actionMessages[action as keyof typeof actionMessages],
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, botMessage])
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-[#E2211C] hover:bg-[#C11E18] shadow-lg z-50 p-0"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
      </Button>
    )
  }

  return (
    <Card
      className={`fixed bottom-6 right-6 z-50 shadow-2xl border-0 ${isMinimized ? "w-80 h-16" : "w-96 h-[500px]"} transition-all duration-300`}
    >
      <CardHeader className="flex flex-row items-center justify-between p-4 bg-[#E2211C] text-white rounded-t-lg">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
            <Image src="/satim-logo.png" alt="SATIM" width={20} height={20} className="rounded-full" />
          </div>
          <div>
            <CardTitle className="text-sm font-semibold">Assistant SATIM</CardTitle>
            {!isMinimized && (
              <CardDescription className="text-red-100 text-xs">
                En ligne • Répond généralement en quelques secondes
              </CardDescription>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[436px]">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start space-x-2 ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center ${message.type === "user" ? "bg-[#E2211C]" : "bg-gray-100"}`}
                  >
                    {message.type === "user" ? (
                      <User className="h-4 w-4 text-white" />
                    ) : (
                      <Bot className="h-4 w-4 text-[#E2211C]" />
                    )}
                  </div>
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${message.type === "user" ? "bg-[#E2211C] text-white" : "bg-gray-100 text-gray-900"}`}
                  >
                    <p className="text-sm">{message.content}</p>
                    <p className={`text-xs mt-1 ${message.type === "user" ? "text-red-100" : "text-gray-500"}`}>
                      {message.timestamp.toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          <div className="p-4 border-t bg-gray-50">
            <p className="text-xs text-gray-600 mb-2">Actions rapides :</p>
            <div className="grid grid-cols-2 gap-2">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickAction(action.action)}
                  className="justify-start text-xs h-8 px-2"
                >
                  {action.icon}
                  <span className="ml-1 truncate">{action.text}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Input with Voice */}
          <div className="p-4 border-t">
            <div className="flex space-x-2">
              <Input
                placeholder={isRecording ? "Enregistrement en cours..." : "Tapez votre message..."}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1 text-sm"
                disabled={isRecording}
              />
              <Button
                onClick={handleVoiceInput}
                variant={isRecording ? "destructive" : "outline"}
                size="icon"
                className="h-10 w-10"
              >
                {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
              </Button>
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || isRecording}
                size="icon"
                className="bg-[#E2211C] hover:bg-[#C11E18] h-10 w-10"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            {isRecording && (
              <div className="mt-2 flex items-center justify-center">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-red-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <span className="ml-2 text-xs text-red-600">Enregistrement...</span>
              </div>
            )}
          </div>
        </CardContent>
      )}
    </Card>
  )
}
