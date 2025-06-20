"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Smartphone, CreditCard, BarChart3, Bell, Fingerprint, Eye, Zap, Lock } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { FloatingChatbot } from "@/components/floating-chatbot"

export default function HomePage() {
  const [activeFeature, setActiveFeature] = useState(0)

  const features = [
    {
      icon: <CreditCard className="h-8 w-8" />,
      title: "Paiements Instantanés",
      description: "Effectuez vos paiements en quelques secondes avec notre technologie avancée",
    },
    {
      icon: <Fingerprint className="h-8 w-8" />,
      title: "Authentification Biométrique",
      description: "Sécurité renforcée avec reconnaissance faciale et empreinte digitale",
    },
    {
      icon: <BarChart3 className="h-8 w-8" />,
      title: "Analyses IA",
      description: "Insights personnalisés et prédictions basées sur l'intelligence artificielle",
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "Notifications Proactives",
      description: "Alertes intelligentes pour optimiser votre gestion financière",
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image src="/satim-logo.png" alt="SATIM" width={40} height={40} className="rounded-lg" />
            <div>
              <span className="text-xl font-bold text-gray-900">SATIM Pay</span>
              <p className="text-xs text-gray-600 hidden md:block">
                Société d'Automatisation des Transactions Interbancaires et de Monétique
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-[#E2211C] transition-colors">
              Fonctionnalités
            </a>
            <a href="#security" className="text-gray-600 hover:text-[#E2211C] transition-colors">
              Sécurité
            </a>
            <a href="#contact" className="text-gray-600 hover:text-[#E2211C] transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <Link href="/auth">
              <Button variant="outline" className="hidden sm:inline-flex">
                Connexion
              </Button>
            </Link>
            <Link href="/auth">
              <Button className="bg-[#E2211C] hover:bg-[#C11E18]">
                Commencer
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-red-100 text-[#B01A15] hover:bg-red-100">🚀 Nouvelle Génération de Paiements</Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            L'avenir des
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#E2211C] to-[#B01A15]">
              {" "}
              paiements
            </span>
            <br />
            en Algérie
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Découvrez une expérience bancaire révolutionnaire avec l'IA, la biométrie et des interfaces intuitives.
            Simplifiez vos transactions avec SATIM Pay.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="bg-[#E2211C] hover:bg-[#C11E18] text-lg px-8 py-3">
                <Smartphone className="mr-2 h-5 w-5" />
                Essayer Maintenant
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="text-lg px-8 py-3">
              <Eye className="mr-2 h-5 w-5" />
              Voir la Démo
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Fonctionnalités Innovantes</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Des technologies de pointe pour une expérience bancaire sans précédent
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {features.map((feature, index) => (
              <Card
                key={index}
                className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
                  activeFeature === index ? "ring-2 ring-[#E2211C] shadow-lg" : ""
                }`}
                onClick={() => setActiveFeature(index)}
              >
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full text-[#E2211C]">{feature.icon}</div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-center">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Feature Details */}
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{features[activeFeature].title}</h3>
              <p className="text-gray-600 mb-6 text-lg">{features[activeFeature].description}</p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#E2211C] rounded-full mr-3"></div>
                  Interface intuitive et moderne
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#E2211C] rounded-full mr-3"></div>
                  Sécurité de niveau bancaire
                </li>
                <li className="flex items-center text-gray-700">
                  <div className="w-2 h-2 bg-[#E2211C] rounded-full mr-3"></div>
                  Support 24/7 en arabe et français
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">{features[activeFeature].icon}</div>
              <p className="text-gray-600">Démonstration interactive disponible</p>
            </div>
          </div>
        </div>
      </section>

      {/* Security Section */}
      <section id="security" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Sécurité Maximale</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Vos données et transactions sont protégées par les technologies les plus avancées
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full text-green-600">
                  <Lock className="h-8 w-8" />
                </div>
                <CardTitle>Chiffrement End-to-End</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Toutes vos données sont chiffrées avec les standards bancaires internationaux
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full text-purple-600">
                  <Fingerprint className="h-8 w-8" />
                </div>
                <CardTitle>Biométrie Avancée</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Authentification par empreinte digitale et reconnaissance faciale</CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full text-orange-600">
                  <Shield className="h-8 w-8" />
                </div>
                <CardTitle>Conformité Bancaire</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>Respect des normes PSD2 et des réglementations algériennes</CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-[#E2211C] text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-red-100">Disponibilité</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2s</div>
              <div className="text-red-100">Temps de Transaction</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">256-bit</div>
              <div className="text-red-100">Chiffrement SSL</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-red-100">Support Client</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Prêt à Révolutionner vos Paiements ?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Rejoignez des milliers d'utilisateurs qui ont déjà adopté l'avenir des paiements en Algérie
          </p>
          <Link href="/auth">
            <Button size="lg" className="bg-[#E2211C] hover:bg-[#C11E18] text-lg px-8 py-3">
              <Zap className="mr-2 h-5 w-5" />
              Commencer Gratuitement
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-[#E2211C] rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">S</span>
                </div>
                <span className="text-lg font-bold">SATIM Pay</span>
              </div>
              <p className="text-gray-400">L'avenir des paiements électroniques en Algérie</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Produits</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Paiements
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Transferts
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Retraits
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Centre d'aide
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Confidentialité
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Conditions
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Sécurité
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 SATIM Pay. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
      <FloatingChatbot />
    </div>
  )
}
