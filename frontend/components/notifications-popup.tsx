"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, X, CheckCircle, AlertTriangle, Info, Shield, Clock, Trash2, Settings } from "lucide-react"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "security"
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    href: string
  }
}

interface NotificationsPopupProps {
  isOpen: boolean
  onClose: () => void
}

export function NotificationsPopup({ isOpen, onClose }: NotificationsPopupProps) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "success",
      title: "Virement réussi",
      message: "Votre virement de 15,000 DZD vers Ahmed Benali a été effectué avec succès.",
      timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
      read: false,
      action: { label: "Voir le reçu", href: "/dashboard/history" },
    },
    {
      id: "2",
      type: "warning",
      title: "Solde faible",
      message: "Votre solde principal est inférieur à 10,000 DZD. Pensez à recharger votre compte.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
      action: { label: "Recharger", href: "/dashboard/transfer" },
    },
    {
      id: "3",
      type: "security",
      title: "Nouvelle connexion détectée",
      message: "Une connexion depuis un nouvel appareil a été détectée à Alger à 14:30.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4), // 4 hours ago
      read: true,
      action: { label: "Vérifier", href: "/dashboard/settings" },
    },
    {
      id: "4",
      type: "info",
      title: "Mise à jour disponible",
      message: "Une nouvelle version de l'application SATIM Pay est disponible avec des améliorations de sécurité.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
      read: true,
    },
    {
      id: "5",
      type: "success",
      title: "Authentification biométrique activée",
      message: "Votre authentification par empreinte digitale a été configurée avec succès.",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
      read: true,
    },
  ])

  const [activeTab, setActiveTab] = useState("all")

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-600" />
      case "security":
        return <Shield className="h-5 w-5 text-red-600" />
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />
      default:
        return <Bell className="h-5 w-5 text-gray-600" />
    }
  }

  const getNotificationBgColor = (type: string) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "warning":
        return "bg-orange-50 border-orange-200"
      case "security":
        return "bg-red-50 border-red-200"
      case "info":
        return "bg-blue-50 border-blue-200"
      default:
        return "bg-gray-50 border-gray-200"
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif)))
  }

  const deleteNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })))
  }

  const filteredNotifications = notifications.filter((notif) => {
    if (activeTab === "all") return true
    if (activeTab === "unread") return !notif.read
    return notif.type === activeTab
  })

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] flex flex-col">
        <CardHeader className="flex flex-row items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#E2211C] rounded-full flex items-center justify-center">
              <Bell className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl">Notifications</CardTitle>
              <CardDescription>
                {unreadCount > 0
                  ? `${unreadCount} notification${unreadCount > 1 ? "s" : ""} non lue${unreadCount > 1 ? "s" : ""}`
                  : "Toutes les notifications sont lues"}
              </CardDescription>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button variant="outline" size="sm" onClick={markAllAsRead}>
                Tout marquer comme lu
              </Button>
            )}
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <div className="px-6 pt-4">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all" className="text-xs">
                  Toutes ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread" className="text-xs">
                  Non lues ({unreadCount})
                </TabsTrigger>
                <TabsTrigger value="success" className="text-xs">
                  Succès
                </TabsTrigger>
                <TabsTrigger value="warning" className="text-xs">
                  Alertes
                </TabsTrigger>
                <TabsTrigger value="security" className="text-xs">
                  Sécurité
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value={activeTab} className="flex-1 mt-4">
              <ScrollArea className="h-[400px] px-6">
                <div className="space-y-3">
                  {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                      <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">Aucune notification dans cette catégorie</p>
                    </div>
                  ) : (
                    filteredNotifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 rounded-lg border transition-all hover:shadow-sm ${
                          notification.read ? "bg-white border-gray-200" : getNotificationBgColor(notification.type)
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-3 flex-1">
                            {getNotificationIcon(notification.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1">
                                <h4 className="font-medium text-gray-900 text-sm">{notification.title}</h4>
                                {!notification.read && <div className="w-2 h-2 bg-[#E2211C] rounded-full"></div>}
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <Clock className="h-3 w-3" />
                                  <span>
                                    {notification.timestamp.toLocaleDateString("fr-FR", {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                {notification.action && (
                                  <Button variant="link" size="sm" className="text-[#E2211C] p-0 h-auto">
                                    {notification.action.label}
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1 ml-2">
                            {!notification.read && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => markAsRead(notification.id)}
                                className="h-8 w-8 text-gray-400 hover:text-gray-600"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => deleteNotification(notification.id)}
                              className="h-8 w-8 text-gray-400 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Settings className="h-4 w-4" />
              <span>Gérer les préférences de notification</span>
            </div>
            <Button variant="outline" size="sm">
              Paramètres
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
