"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  ArrowLeft,
  Search,
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  CalendarIcon,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function HistoryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [filterType, setFilterType] = useState("all")
  const [dateRange, setDateRange] = useState<Date | undefined>(new Date())

  const transactions = [
    {
      id: "TXN-2024-001234",
      type: "payment",
      description: "Paiement Supermarché Monoprix Hydra",
      amount: -2500,
      date: "2024-01-15T14:30:00",
      status: "completed",
      category: "Alimentation",
      merchant: "Monoprix",
    },
    {
      id: "TXN-2024-001233",
      type: "transfer",
      description: "Virement reçu de Ahmed Benali",
      amount: 15000,
      date: "2024-01-14T09:15:00",
      status: "completed",
      category: "Virement",
      merchant: "Ahmed B.",
    },
    {
      id: "TXN-2024-001232",
      type: "withdrawal",
      description: "Retrait GAB BNA Alger Centre",
      amount: -5000,
      date: "2024-01-13T16:45:00",
      status: "completed",
      category: "Retrait",
      merchant: "BNA ATM",
    },
    {
      id: "TXN-2024-001231",
      type: "payment",
      description: "Facture Algérie Télécom",
      amount: -3200,
      date: "2024-01-12T11:20:00",
      status: "pending",
      category: "Télécommunications",
      merchant: "Algérie Télécom",
    },
    {
      id: "TXN-2024-001230",
      type: "payment",
      description: "Carburant Station Naftal",
      amount: -4500,
      date: "2024-01-11T08:30:00",
      status: "completed",
      category: "Transport",
      merchant: "Naftal",
    },
    {
      id: "TXN-2024-001229",
      type: "transfer",
      description: "Virement vers Fatima Khelil",
      amount: -8000,
      date: "2024-01-10T13:45:00",
      status: "completed",
      category: "Virement",
      merchant: "Fatima K.",
    },
  ]

  const filteredTransactions = transactions.filter((transaction) => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.merchant.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = filterType === "all" || transaction.type === filterType
    return matchesSearch && matchesType
  })

  const totalIncome = transactions.filter((t) => t.amount > 0).reduce((sum, t) => sum + t.amount, 0)
  const totalExpenses = transactions.filter((t) => t.amount < 0).reduce((sum, t) => sum + Math.abs(t.amount), 0)

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
            <h1 className="text-xl font-semibold">Historique des Transactions</h1>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Summary Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Revenus ce mois</p>
                  <p className="text-2xl font-bold text-green-600">+{totalIncome.toLocaleString()} DZD</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Dépenses ce mois</p>
                  <p className="text-2xl font-bold text-red-600">-{totalExpenses.toLocaleString()} DZD</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <TrendingDown className="h-6 w-6 text-red-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Solde net</p>
                  <p className="text-2xl font-bold text-blue-600">
                    {(totalIncome - totalExpenses).toLocaleString()} DZD
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <ArrowUpRight className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filtres et Recherche</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Rechercher une transaction..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Type de transaction" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les transactions</SelectItem>
                  <SelectItem value="payment">Paiements</SelectItem>
                  <SelectItem value="transfer">Virements</SelectItem>
                  <SelectItem value="withdrawal">Retraits</SelectItem>
                </SelectContent>
              </Select>

              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full md:w-48">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {dateRange ? format(dateRange, "PPP", { locale: fr }) : "Sélectionner une date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar mode="single" selected={dateRange} onSelect={setDateRange} initialFocus />
                </PopoverContent>
              </Popover>

              <Button variant="outline" className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Exporter
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card>
          <CardHeader>
            <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
            <CardDescription>Historique complet de vos opérations financières</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        transaction.amount > 0 ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                      }`}
                    >
                      {transaction.amount > 0 ? (
                        <ArrowDownLeft className="h-6 w-6" />
                      ) : (
                        <ArrowUpRight className="h-6 w-6" />
                      )}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-gray-900">{transaction.description}</h3>
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{format(new Date(transaction.date), "dd MMM yyyy 'à' HH:mm", { locale: fr })}</span>
                        <span>•</span>
                        <span>{transaction.id}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <p
                      className={`text-lg font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                    >
                      {transaction.amount > 0 ? "+" : ""}
                      {transaction.amount.toLocaleString()} DZD
                    </p>
                    <Badge variant={transaction.status === "completed" ? "default" : "secondary"} className="mt-1">
                      {transaction.status === "completed" ? "Terminé" : "En cours"}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>

            {filteredTransactions.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune transaction trouvée</h3>
                <p className="text-gray-500">Essayez de modifier vos critères de recherche ou vos filtres</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
