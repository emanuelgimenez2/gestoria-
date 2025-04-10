"use client"

import { useEffect, useRef } from "react"
import { Car, SailboatIcon as Boat } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function ServicesSection() {
  const sectionRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const elements = entry.target.querySelectorAll(".fade-in")
            elements.forEach((el, index) => {
              setTimeout(() => {
                el.classList.add("visible")
              }, index * 200)
            })
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <section ref={sectionRef} className="py-20 bg-gray-50" id="servicios">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-[#0F1A3D] text-center mb-12 fade-in">Nuestros Servicios</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="fade-in">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-[#0F1A3D] p-3 rounded-lg">
                  <Car className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Automotor</CardTitle>
              </div>
              <CardDescription>Mandatario Nacional Matriculado </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-[#6B7280]">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0F1A3D]"></div>
                  Inscripción inicial
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0F1A3D]"></div>
                  Transferencia 
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0F1A3D]"></div>
                  Cambio motor y radicación 
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0F1A3D]"></div>
                  Duplicados
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0F1A3D]"></div>
                  Asesoramiento técnico
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="fade-in">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="bg-[#0F1A3D] p-3 rounded-lg">
                  <Boat className="h-6 w-6 text-white" />
                </div>
                <CardTitle>Náutica</CardTitle>
              </div>
              <CardDescription>Embarcaciones Rey y Jurisdiccionales</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-[#6B7280]">
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0F1A3D]"></div>
                  Inscripciones
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0F1A3D]"></div>
                  Transferencias
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0F1A3D]"></div>
                  Cambio de nombre y motor
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0F1A3D]"></div>
                  Inscripción y retiro de motor 
                </li>
                <li className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 rounded-full bg-[#0F1A3D]"></div>
                  Asesoramiento técnico 
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

