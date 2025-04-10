import Link from "next/link";
import { Facebook, Instagram, MapPin, Phone } from "lucide-react";
import {  Mail } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-[#0F1A3D] text-white">
      <div className="container mx-auto px-5 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Columna 1 - Logo/Descripción */}
          <div className="text-center sm:text-left">
            <h3 className="text-2xl font-bold text-white mb-4">
              Gestoría Náutica y del Automotor
            </h3>
            <p className="text-gray-300 text-sm leading-relaxed">
              Especialistas en trámites náuticos y automotores con más de 15
              años de experiencia.
            </p>
          </div>

          {/* Columna 2 - Enlaces */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-white mb-4">
              Enlaces Rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/"
                  className="text-gray-300 hover:text-white transition-colors text-sm flex items-center justify-center sm:justify-start"
                >
                  Inicio
                </Link>
              </li>
              <li>
                <Link
                  href="/nautica"
                  className="text-gray-300 hover:text-white transition-colors text-sm flex items-center justify-center sm:justify-start"
                >
                  Trámites Náuticos
                </Link>
              </li>
              <li>
                <Link
                  href="/automotor"
                  className="text-gray-300 hover:text-white transition-colors text-sm flex items-center justify-center sm:justify-start"
                >
                  Trámites Automotor
                </Link>
              </li>
              <li>
                <Link
                  href="/contacto"
                  className="text-gray-300 hover:text-white transition-colors text-sm flex items-center justify-center sm:justify-start"
                >
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Columna 3 - Contacto */}
          <div className="text-center sm:text-left">
            <h3 className="text-xl font-bold text-white mb-4">Contacto</h3>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <MapPin className="h-4 w-4 text-gray-300" />
                <p className="text-gray-300 text-sm">
                  Los Geranios N° 823, Concepcion del Uruguay, Entre Rios,
                  Argentina
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-2">
                <Phone className="h-4 w-4 text-gray-300" />
                <p className="text-gray-300 text-sm">3442-472412</p>
              </div>
            </div>

            <div className="flex justify-center sm:justify-start gap-4 mt-4">
              <a
                href="#"
                className="text-gray-300 hover:text-white transition-colors p-2 bg-[#1a2a5a] rounded-full"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="https://www.instagram.com/gestoria.aom"
                className="text-gray-300 hover:text-white transition-colors p-2 bg-[#1a2a5a] rounded-full"
                aria-label="Instagram"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:gestoria.aom@gmail.com"
                className="text-gray-300 hover:text-white transition-colors p-2 bg-[#1a2a5a] rounded-full"
                aria-label="Gmail"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center">
          <p className="text-gray-300 text-xs">
            &copy; {new Date().getFullYear()} Gestoría Náutica y del Automotor.
            Todos los derechos reservados.
          </p>

          {/* Créditos de desarrollo */}
          <div className="mt-4">
            <p className="text-gray-400 text-xs">
              Desarrollado por{" "}
              <a
                href="https://servi-tec-six.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white transition-colors underline"
              >
                ServiTec
              </a>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
