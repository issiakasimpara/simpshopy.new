import React from 'react';
import { CheckCircle, Calendar, Tag } from 'lucide-react';

interface Article {
  id: string;
  title: string;
  description: string;
  image: string;
  date: string;
  category: string;
  readTime: string;
  slug: string;
}

const articles: Article[] = [
  {
    id: '1',
    title: "Comment créer votre première boutique en ligne en 5 minutes",
    description: "Guide étape par étape pour lancer votre business e-commerce avec SimpShopy. Découvrez comment créer une boutique professionnelle rapidement.",
    image: "/blog/creer-boutique.jpg",
    date: "2024-01-20",
    category: "Tutoriels",
    readTime: "5 min",
    slug: "creer-boutique-en-ligne"
  },
  {
    id: '2',
    title: "Les meilleures stratégies de dropshipping international",
    description: "Découvrez comment réussir le dropshipping sur le marché global. Conseils pratiques et outils pour optimiser vos ventes.",
    image: "/blog/dropshipping-international.jpg",
    date: "2024-01-18",
    category: "Business",
    readTime: "8 min",
    slug: "strategies-dropshipping-international"
  },
  {
    id: '3',
    title: "Paiements internationaux : Le futur du e-commerce global",
    description: "Pourquoi les paiements locaux sont essentiels pour votre succès. Guide complet des solutions de paiement international.",
    image: "/blog/paiements-internationaux.jpg",
    date: "2024-01-15",
    category: "Paiements",
    readTime: "6 min",
    slug: "paiements-internationaux-ecommerce"
  },
  {
    id: '4',
    title: "Intégration DSERS : Importez des produits AliExpress automatiquement",
    description: "Comment utiliser DSERS avec SimpShopy pour le dropshipping. Configuration complète et bonnes pratiques.",
    image: "/blog/dsers-integration.jpg",
    date: "2024-01-12",
    category: "Intégrations",
    readTime: "7 min",
    slug: "integration-dsers-aliExpress"
  },
  {
    id: '5',
    title: "SEO pour e-commerce : Optimisez votre boutique pour Google",
    description: "Techniques avancées de référencement pour augmenter votre visibilité et vos ventes en ligne.",
    image: "/blog/seo-ecommerce.jpg",
    date: "2024-01-10",
    category: "Marketing",
    readTime: "10 min",
    slug: "seo-ecommerce-optimisation"
  },
  {
    id: '6',
    title: "Marketing automation : Automatisez vos ventes avec SimpShopy",
    description: "Découvrez comment automatiser vos processus de vente et fidéliser vos clients avec nos outils intégrés.",
    image: "/blog/marketing-automation.jpg",
    date: "2024-01-08",
    category: "Marketing",
    readTime: "9 min",
    slug: "marketing-automation-simpshopy"
  }
];

const categories = ["Tous", "Tutoriels", "Business", "Paiements", "Intégrations", "Marketing"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = React.useState("Tous");

  const filteredArticles = selectedCategory === "Tous" 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Blog SimpShopy
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos guides, conseils et actualités pour réussir votre business e-commerce
            </p>
          </div>
        </div>
      </div>

      {/* Categories Filter */}
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Articles Grid */}
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredArticles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-video bg-gray-200 relative">
                <img 
                  src={article.image} 
                  alt={article.title} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = '/placeholder.svg';
                  }}
                />
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                    {article.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {article.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <Tag className="h-4 w-4" />
                    {article.readTime}
                  </div>
                </div>
                
                <h2 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {article.title}
                </h2>
                
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {article.description}
                </p>
                
                <button className="text-blue-600 hover:text-blue-700 font-medium text-sm hover:underline">
                  Lire l'article →
                </button>
              </div>
            </article>
          ))}
        </div>

        {filteredArticles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Aucun article trouvé dans cette catégorie.
            </p>
          </div>
        )}
      </div>

      {/* Newsletter Signup */}
      <div className="bg-blue-50 border-t">
        <div className="max-w-4xl mx-auto px-6 py-12 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Restez informé
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Recevez nos derniers articles et conseils directement dans votre boîte mail
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Votre email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors">
              S'abonner
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
