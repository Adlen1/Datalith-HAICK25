"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  CreditCard,
  TrendingUp,
  BarChart3,
  Settings,
  Bell,
  Download,
  Eye,
  CheckCircle,
  Clock,
} from "lucide-react"
import Image from "next/image"
import FloatingChatbot from "@/components/FloatingChatbot"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = {
    totalUsers: 12547,
    activeUsers: 8932,
    totalTransactions: 45623,
    totalVolume: 2847392,
    pendingComplaints: 23,
    resolvedComplaints: 156,
  }

  const recentComplaints = [
    {
      id: "REC-2024-001234",
      user: "Mohamed Benali",
      category: "Transaction échouée",
      status: "pending",
      priority: "high",
      date: "2024-01-15",
      description: "Paiement non abouti malgré débit du compte",
    },
    {
      id: "REC-2024-001233",
      user: "Fatima Khelil",
      category: "Problème technique",
      status: "in-progress",
      priority: "medium",
      date: "2024-01-14",
      description: "Application se ferme lors de l'authentification biométrique",
    },
    {
      id: "REC-2024-001232",
      user: "Ahmed Meziani",
      category: "Montant incorrect",
      status: "resolved",
      priority: "low",
      date: "2024-01-13",
      description: "Frais supplémentaires non justifiés",
    },
  ]

  const aiInsights = [
    {
      type: "trend",
      title: "Augmentation des paiements mobiles",
      description: "Les paiements via mobile ont augmenté de 34% ce mois",
      impact: "positive",
      recommendation: "Optimiser l'interface mobile pour maintenir cette croissance",
    },
    {
      type: "alert",
      title: "Pic de réclamations techniques",
      description: "Augmentation de 15% des problèmes d'authentification biométrique",
      impact: "negative",
      recommendation: "Mettre à jour les algorithmes de reconnaissance faciale",
    },
    {
      type: "opportunity",
      title: "Potentiel d'expansion",
      description: "Forte demande dans la région d'Oran (+45% de nouvelles inscriptions)",
      impact: "positive",
      recommendation: "Considérer l'ouverture d'un bureau régional",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Image alt="Logo" className="h-8 w-auto" height="32" src="/logo.svg" width="32" />
                <span className="text-xl font-bold text-gray-900">SATIM Admin</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                  {stats.pendingComplaints}
                </Badge>
              </Button>

              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=32&width=32" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">Admin SATIM</p>
                  <p className="text-xs text-gray-500">Administrateur</p>
                </div>
              </div>

              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Tableau de Bord Administrateur</h1>
          <p className="text-gray-600">Vue d'ensemble des opérations et de la performance système</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="complaints">Réclamations</TabsTrigger>
            <TabsTrigger value="ai-reports">Rapports IA</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Utilisateurs Total</p>
                      <p className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-red-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+12% ce mois</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Utilisateurs Actifs</p>
                      <p className="text-2xl font-bold">{stats.activeUsers.toLocaleString()}</p>
                    </div>
                    <Users className="h-8 w-8 text-green-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <span className="text-gray-600">
                      {((stats.activeUsers / stats.totalUsers) * 100).toFixed(1)}% du total
                    </span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Transactions</p>
                      <p className="text-2xl font-bold">{stats.totalTransactions.toLocaleString()}</p>
                    </div>
                    <CreditCard className="h-8 w-8 text-purple-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+8% ce mois</span>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Volume (DZD)</p>
                      <p className="text-2xl font-bold">{(stats.totalVolume / 1000000).toFixed(1)}M</p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-orange-600" />
                  </div>
                  <div className="mt-2 flex items-center text-sm">
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                    <span className="text-green-600">+15% ce mois</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Insights */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">AI</span>
                  </div>
                  Insights IA - Analyse Prédictive
                </CardTitle>
                <CardDescription>Analyses automatisées et recommandations basées sur les données</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        insight.impact === "positive"
                          ? "border-green-500 bg-green-50"
                          : insight.impact === "negative"
                            ? "border-red-500 bg-red-50"
                            : "border-blue-500 bg-blue-50"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{insight.title}</h4>
                          <p className="text-gray-700 text-sm mb-2">{insight.description}</p>
                          <p className="text-xs text-gray-600 italic">💡 Recommandation: {insight.recommendation}</p>
                        </div>
                        <Badge variant={insight.impact === "positive" ? "default" : "destructive"}>
                          {insight.type}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="complaints" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Gestion des Réclamations</h2>
                <p className="text-gray-600">Suivi et traitement des réclamations clients</p>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>

            {/* Complaints Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">En Attente</p>
                      <p className="text-2xl font-bold text-orange-600">{stats.pendingComplaints}</p>
                    </div>
                    <Clock className="h-8 w-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">En Cours</p>
                      <p className="text-2xl font-bold text-red-600">12</p>
                    </div>
                    <Eye className="h-8 w-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Résolues</p>
                      <p className="text-2xl font-bold text-green-600">{stats.resolvedComplaints}</p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Complaints List */}
            <Card>
              <CardHeader>
                <CardTitle>Réclamations Récentes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentComplaints.map((complaint) => (
                    <div
                      key={complaint.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                    >
                      <div className="flex items-center space-x-4">
                        <div
                          className={`w-3 h-3 rounded-full ${
                            complaint.status === "pending"
                              ? "bg-orange-500"
                              : complaint.status === "in-progress"
                                ? "bg-red-500"
                                : "bg-green-500"
                          }`}
                        ></div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium">{complaint.id}</p>
                            <Badge
                              variant={
                                complaint.priority === "high"
                                  ? "destructive"
                                  : complaint.priority === "medium"
                                    ? "default"
                                    : "secondary"
                              }
                            >
                              {complaint.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600">
                            {complaint.user} • {complaint.category}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">{complaint.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge
                          variant={
                            complaint.status === "pending"
                              ? "secondary"
                              : complaint.status === "in-progress"
                                ? "default"
                                : "outline"
                          }
                        >
                          {complaint.status === "pending"
                            ? "En attente"
                            : complaint.status === "in-progress"
                              ? "En cours"
                              : "Résolue"}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">{complaint.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ai-reports" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">Rapports IA</h2>
                <p className="text-gray-600">
                  Analyses automatisées et rapports générés par l'intelligence artificielle
                </p>
              </div>
              <Button>
                <Download className="mr-2 h-4 w-4" />
                Générer Rapport
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Analyse des Tendances</CardTitle>
                  <CardDescription>Rapport généré automatiquement</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900">Croissance des Paiements Mobiles</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Les paiements via mobile représentent maintenant 67% du volume total, avec une croissance de 34%
                        ce mois.
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <h4 className="font-medium text-green-900">Satisfaction Client</h4>
                      <p className="text-sm text-green-700 mt-1">
                        Score de satisfaction moyen: 4.2/5, en amélioration de 0.3 points.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Détection d'Anomalies</CardTitle>
                  <CardDescription>Alertes automatiques</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <h4 className="font-medium text-yellow-900">Pic d'Activité Détecté</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Volume de transactions 23% au-dessus de la normale entre 14h-16h.
                      </p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <h4 className="font-medium text-red-900">Taux d'Échec Élevé</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Augmentation de 12% des échecs d'authentification biométrique.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <FloatingChatbot />
    </div>
  )
}
