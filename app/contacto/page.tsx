import { Phone, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react"

export default function Contacto() {
  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold text-[#0F1A3D] mb-8">Contacto</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full h-[400px] rounded-lg overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27114.79180508327!2d-58.25910022050809!3d-32.48261549999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95afdb015f5c1837%3A0xec723167e2eacdbc!2sConcepcIon%20del%20Uruguay%2C%20Entre%20Rios%2C%20Argentina!5e0!3m2!1sen!2sus!4v1711742878392!5m2!1sen!2sus" width="600" height="450" style="border:0;"  loading="lazy" referrerpolicy="no-referrer-when-downgrade"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-[#0F1A3D] mb-6">Información de Contacto</h2>

          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-[#0F1A3D] mt-1" />
              <div>
                <h3 className="font-semibold text-[#0F1A3D]">Teléfono</h3>
                <p className="text-gray-600">03442-472412</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <MapPin className="h-6 w-6 text-[#0F1A3D] mt-1" />
              <div>
                <h3 className="font-semibold text-[#0F1A3D]">Dirección</h3>
                <p className="text-gray-600">Concepcion del Uuruguay, Entre Rios, Argentina</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Clock className="h-6 w-6 text-[#0F1A3D] mt-1" />
              <div>
                <h3 className="font-semibold text-[#0F1A3D]">Horarios</h3>
                <p className="text-gray-600">Lunes a Viernes: 9:00 - 18:00</p>
                <p className="text-gray-600">Sábados: 9:00 - 13:00</p>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="font-semibold text-[#0F1A3D] mb-4">Síguenos en redes sociales</h3>
            <div className="flex gap-4">
              <a href="#" className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-pink-600 text-white rounded-full hover:bg-pink-700 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

