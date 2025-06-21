"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  CreditCard,
  Send,
  Download,
  History,
  Bell,
  MessageSquare,
  Settings,
  TrendingUp,
  Eye,
  EyeOff,
  ArrowUpRight,
  ArrowDownLeft,
  Shield,
} from "lucide-react"
import Link from "next/link"
import { NotificationsPopup } from "@/components/notifications-popup"
import { FloatingChatbot } from "@/components/floating-chatbot"
import Image from "next/image"

export default function DashboardPage() {
  const [balanceVisible, setBalanceVisible] = useState(true)
  const [notificationsOpen, setNotificationsOpen] = useState(false)

  const recentTransactions = [
    {
      id: 1,
      type: "payment",
      description: "Paiement Supermarché Monoprix",
      amount: -2500,
      date: "2024-01-15",
      status: "completed",
    },
    {
      id: 2,
      type: "transfer",
      description: "Virement reçu de Ahmed B.",
      amount: 15000,
      date: "2024-01-14",
      status: "completed",
    },
    {
      id: 3,
      type: "withdrawal",
      description: "Retrait GAB BNA Alger Centre",
      amount: -5000,
      date: "2024-01-13",
      status: "completed",
    },
    {
      id: 4,
      type: "payment",
      description: "Facture Algérie Télécom",
      amount: -3200,
      date: "2024-01-12",
      status: "pending",
    },
  ]

  const quickActions = [
    {
      icon: <Send className="h-6 w-6" />,
      title: "Virement",
      description: "Envoyer de l'argent",
      href: "/dashboard/transfer",
      color: "bg-blue-500",
    },
    {
      icon: <CreditCard className="h-6 w-6" />,
      title: "Paiement",
      description: "Payer une facture",
      href: "/dashboard/payment",
      color: "bg-green-500",
    },
    {
      icon: <Download className="h-6 w-6" />,
      title: "Retrait",
      description: "Retirer de l'argent",
      href: "/dashboard/withdrawal",
      color: "bg-purple-500",
    },
    {
      icon: <History className="h-6 w-6" />,
      title: "Historique",
      description: "Voir les transactions",
      href: "/dashboard/history",
      color: "bg-orange-500",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2">
                <Image src="/satim-logo.png" alt="SATIM" width={32} height={32} className="rounded-lg" />
                <div>
                  <span className="text-xl font-bold text-gray-900">SATIM Pay</span>
                  <p className="text-xs text-gray-600 hidden lg:block">SATIM</p>
                </div>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative" onClick={() => setNotificationsOpen(true)}>
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-[#E2211C] text-white text-xs">
                  3
                </Badge>
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>MB</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Mohamed Benali</p>
                  <p className="text-xs text-gray-500">Client Premium</p>
                </div>
              </div>

              <Link href="/dashboard/settings">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Bonjour Mohamed 👋</h1>
          <p className="text-gray-600">Voici un aperçu de votre activité financière aujourd'hui</p>
        </div>

        {/* Balance Card */}
        <Card className="mb-8 bg-gradient-to-r from-[#E2211C] to-[#E5544F] text-white">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardDescription className="text-blue-100">Solde Principal</CardDescription>
                <CardTitle className="text-3xl font-bold flex items-center gap-3">
                  {balanceVisible ? "125,750.00 DZD" : "••••••••"}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setBalanceVisible(!balanceVisible)}
                    className="text-white hover:bg-white/20"
                  >
                    {balanceVisible ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </Button>
                </CardTitle>
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-300 text-sm">
                  <TrendingUp className="h-4 w-4 mr-1" />
                  +2.5%
                </div>
                <p className="text-blue-100 text-sm">vs mois dernier</p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-blue-100 text-sm">Revenus ce mois</p>
                <p className="text-xl font-semibold">+45,200 DZD</p>
              </div>
              <div>
                <p className="text-blue-100 text-sm">Dépenses ce mois</p>
                <p className="text-xl font-semibold">-18,450 DZD</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <Link key={index} href={action.href}>
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div
                      className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3 text-white`}
                    >
                      {action.icon}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Transactions Récentes</CardTitle>
                <CardDescription>Vos dernières opérations</CardDescription>
              </div>
              <Link href="/dashboard/history">
                <Button variant="ghost" size="sm">
                  Voir tout
                  <ArrowUpRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentTransactions.map((transaction) => (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.amount > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                        }`}
                      >
                        {transaction.amount > 0 ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{transaction.description}</p>
                        <p className="text-xs text-gray-500">{transaction.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}>
                        {transaction.amount > 0 ? "+" : ""}
                        {transaction.amount.toLocaleString()} DZD
                      </p>
                      <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="text-xs">
                        {transaction.status === "completed" ? "Terminé" : "En cours"}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* AI Insights & Notifications */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  Insights IA
                </CardTitle>
                <CardDescription>Analyses personnalisées de vos finances</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800 font-medium">💡 Conseil d'épargne</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Vous pourriez économiser 3,200 DZD ce mois en réduisant vos achats alimentaires de 15%.
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800 font-medium">📈 Tendance positive</p>
                  <p className="text-sm text-green-700 mt-1">
                    Vos revenus ont augmenté de 12% par rapport au mois dernier.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Feedback */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Feedback Rapide
                </CardTitle>
                <CardDescription>Comment s'est passée votre dernière transaction ?</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    😊 Excellent
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    😐 Correct
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    😞 Problème
                  </Button>
                </div>
                <Link href="/dashboard/feedback">
                  <Button variant="ghost" size="sm" className="w-full mt-3">
                    Donner un avis détaillé
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Security Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Sécurité du Compte
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Authentification 2FA</span>
                    <Badge className="bg-green-100 text-green-800">Activée</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Biométrie</span>
                    <Badge className="bg-green-100 text-green-800">Configurée</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Dernière connexion</span>
                    <span className="text-sm text-gray-900">Aujourd'hui 14:30</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <NotificationsPopup isOpen={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
      <FloatingChatbot />
    </div>
  )
}
