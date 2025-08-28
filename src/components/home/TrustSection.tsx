
const TrustSection = () => {
  const partners = [
    { name: "Stripe", logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=60&fit=crop" },
    { name: "PayPal", logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=60&fit=crop" },
    { name: "Google", logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=60&fit=crop" },
    { name: "Facebook", logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=60&fit=crop" },
    { name: "Amazon", logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=60&fit=crop" },
    { name: "Shopify", logo: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=120&h=60&fit=crop" }
  ];

  return (
    <section className="py-16 px-4 bg-white border-t border-gray-100">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <p className="text-gray-500 font-medium text-lg mb-8">
            Intégrations natives avec vos outils préférés
          </p>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
          {partners.map((partner, index) => (
            <div key={index} className="flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 opacity-60 hover:opacity-100">
              <div className="w-24 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-600 font-semibold text-sm">{partner.name}</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-500">
            + plus de 50 intégrations disponibles
          </p>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
