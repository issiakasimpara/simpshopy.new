import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
const CtaSection = () => {
  return <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width=%2260%22%20height=%2260%22%20viewBox=%220%200%2060%2060%22%20xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cg%20fill=%22none%22%20fill-rule=%22evenodd%22%3E%3Cg%20fill=%22%23ffffff%22%20fill-opacity=%220.1%22%3E%3Ccircle%20cx=%2230%22%20cy=%2230%22%20r=%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')]" />
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto text-white">
          <Sparkles className="h-16 w-16 mx-auto mb-8 animate-pulse" />
          
          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Prêt à lancer votre boutique en ligne ?
          </h2>

          <p className="text-xl md:text-2xl mb-8 opacity-90 leading-relaxed">
            Rejoignez les entrepreneurs internationaux qui ont choisi Simpshopy
            pour vendre leurs produits en ligne.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-8">
            <Button size="lg" className="px-10 py-4 text-lg bg-white text-blue-600 hover:bg-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 group" asChild>
              <Link to="/dashboard">
                Créer ma boutique maintenant
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-10 py-4 text-lg border-white text-white hover:text-blue-600 transition-all duration-300 bg-zinc-50">
              Parler à un expert
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm opacity-80">
            <div className="flex items-center">
              <span className="text-green-300 mr-2">✓</span>
              Configuration simple
            </div>
            <div className="flex items-center">
              <span className="text-green-300 mr-2">✓</span>
              Paiements internationaux
            </div>
            <div className="flex items-center">
              <span className="text-green-300 mr-2">✓</span>
              Support français & anglais
            </div>
          </div>
        </div>
      </div>
    </section>;
};
export default CtaSection;