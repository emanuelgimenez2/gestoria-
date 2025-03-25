"use client"

import { Phone } from "lucide-react"

export default function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/5491112345678"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors z-50"
      aria-label="Contactar por WhatsApp"
    >
      <Phone className="h-6 w-6" />
    </a>
  )
}

