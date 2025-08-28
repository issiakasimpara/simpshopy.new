
interface ProductDetailHeaderProps {
  productName: string;
}

const ProductDetailHeader = ({ productName }: ProductDetailHeaderProps) => {
  return (
    <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
      <button onClick={() => window.history.back()} className="hover:text-gray-900">
        Accueil
      </button>
      <span>/</span>
      <span>Produits</span>
      <span>/</span>
      <span className="text-gray-900">{productName}</span>
    </nav>
  );
};

export default ProductDetailHeader;
