import { Phone, MapPin, Clock, Facebook, Instagram, Twitter } from "lucide-react";

export default function Contacto() {
  return (
    <div className="container mx-auto py-8 px-4 sm:py-12">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#0F1A3D] mb-6 sm:mb-8 text-center sm:text-left">Contacto</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
        {/* Mapa con sombra y bordes redondeados mejorados */}
        <div className="w-full aspect-video relative rounded-xl overflow-hidden shadow-lg order-2 md:order-1">
         <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3387.2424433622294!2d-58.24036232387335!3d-32.46595697340608!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95afda5edfe23485%3A0x9e16cf3cf77b7705!2sLos%20Geranios%20823%2C%20Concepci%C3%B3n%20del%20Uruguay%2C%20Entre%20R%C3%ADos!5e0!3m2!1ses!2sar!4v1713654753264!5m2!1ses!2sar"
        className="absolute top-0 left-0 w-full h-full"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
        </div>

        {/* Información de contacto */}
        <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg order-1 md:order-2">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0F1A3D] mb-6 text-center sm:text-left">Información de Contacto</h2>

          <div className="space-y-5 sm:space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Phone className="h-5 w-5 text-[#0F1A3D]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F1A3D] text-lg">Teléfono</h3>
                <a href="tel:3442472412" className="text-gray-600 hover:text-blue-600 transition-colors">3442-472412</a>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <MapPin className="h-5 w-5 text-[#0F1A3D]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F1A3D] text-lg">Dirección</h3>
                <p className="text-gray-600">Los Geranios N° 823, Concepción del Uruguay, Entre Ríos, Argentina</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-50 p-2 rounded-lg">
                <Clock className="h-5 w-5 text-[#0F1A3D]" />
              </div>
              <div>
                <h3 className="font-semibold text-[#0F1A3D] text-lg">Horarios</h3>
                <div className="text-gray-600">
                  <p>Lunes a Viernes: 9:00 - 18:00</p>
                  <p>Sábados: 9:00 - 13:00</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center sm:text-left">
            <h3 className="font-semibold text-[#0F1A3D] mb-4 text-lg">Síguenos en redes sociales</h3>
            <div className="flex gap-4 justify-center sm:justify-start">
              <a href="#" className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors hover:scale-110 transform duration-200">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700 transition-colors hover:scale-110 transform duration-200">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="p-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500 transition-colors hover:scale-110 transform duration-200">
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}