
import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import { CartProvider } from './contexts/CartContext';
import { useSessionOptimizer } from './hooks/useSessionOptimizer';
import { AuthProvider } from './hooks/useAuth';
import { Toaster } from './components/ui/toaster';
import ConditionalPreloading from './components/ConditionalPreloading';
import LoadingFallback from './components/LoadingFallback';
import ConditionalCookieConsent from './components/ConditionalCookieConsent';
import StorageInitializer from './components/StorageInitializer';
import ProtectedRoute from './components/ProtectedRoute';
import { useGlobalMarketSettingsCleanup } from './hooks/useGlobalMarketSettings';

// 🔍 LOGS DE DIAGNOSTIC - App.tsx
console.log('🚀 [DEBUG] App.tsx - Démarrage du composant App');
console.log('🔍 [DEBUG] React version dans App:', React.version);

// ⚡ IMPORT SYNCHRONE pour la boutique publique (rapide comme Shopify)
import Storefront from './pages/Storefront';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import Index from './pages/Index';

// Lazy loading UNIQUEMENT pour les pages admin (pas critiques)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Analytics = lazy(() => import('./pages/Analytics'));
const Products = lazy(() => import('./pages/Products'));
const Orders = lazy(() => import('./pages/Orders'));
const Customers = lazy(() => import('./pages/Customers'));
const Settings = lazy(() => import('./pages/Settings'));
const SiteBuilder = lazy(() => import('./pages/SiteBuilder'));
const Integrations = lazy(() => import('./pages/Integrations'));
const Testimonials = lazy(() => import('./pages/admin/TestimonialsPage'));
const Categories = lazy(() => import('./pages/Categories'));
const StoreConfig = lazy(() => import('./pages/StoreConfig'));
const Shipping = lazy(() => import('./pages/MarketsShipping'));
const Payments = lazy(() => import('./pages/Payments'));
const Themes = lazy(() => import('./pages/Themes'));
const Domains = lazy(() => import('./pages/Domains'));
const DsersIntegration = lazy(() => import('./pages/integrations/DsersIntegration'));
const MailchimpIntegration = lazy(() => import('./pages/integrations/MailchimpIntegration'));
const IntegrationDetailPage = lazy(() => import('./pages/IntegrationDetailPage'));
const OnboardingWizard = lazy(() => import('./components/onboarding/OnboardingWizard'));
const OptimizedTemplateEditor = lazy(() => import('./components/site-builder/OptimizedTemplateEditor'));
const TemplatePreview = lazy(() => import('./components/site-builder/TemplatePreview'));

// Pages publiques SEO optimisées (chargement synchrone)
import Home from './pages/Home'; // Main homepage - IMPORT SYNCHRONE pour performance
import Features from './pages/Features'; // Page importante - IMPORT SYNCHRONE
import Pricing from './pages/Pricing'; // Page importante - IMPORT SYNCHRONE
import About from './pages/About'; // Page importante - IMPORT SYNCHRONE
import TestimonialsPublic from './pages/Testimonials'; // Page importante - IMPORT SYNCHRONE
import WhyChooseUs from './pages/WhyChooseUs'; // Page importante - IMPORT SYNCHRONE
import Support from './pages/Support'; // Page importante - IMPORT SYNCHRONE
import Auth from './pages/Auth'; // Page critique - IMPORT SYNCHRONE pour conversion

// Pages légales (peuvent rester en lazy loading car moins critiques)
const Legal = lazy(() => import('./pages/Legal'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));

// Configuration du client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (anciennement cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Composant pour les optimisations globales
function GlobalOptimizations() {
  console.log('🔧 [DEBUG] GlobalOptimizations - Rendu du composant');
  
  // Optimiseur de session global
  console.log('📦 [DEBUG] GlobalOptimizations - Appel useSessionOptimizer...');
  const { configureSession } = useSessionOptimizer();
  console.log('✅ [DEBUG] GlobalOptimizations - useSessionOptimizer OK');
  
  // Nettoyage du cache global market_settings
  console.log('📦 [DEBUG] GlobalOptimizations - Appel useGlobalMarketSettingsCleanup...');
  const cleanupMarketSettings = useGlobalMarketSettingsCleanup();
  console.log('✅ [DEBUG] GlobalOptimizations - useGlobalMarketSettingsCleanup OK');
  
  // Configuration de session optimisée au démarrage
  React.useEffect(() => {
    console.log('🔧 [DEBUG] GlobalOptimizations - useEffect configureSession...');
    configureSession({
      searchPath: 'public',
      role: 'authenticated'
    });
    console.log('✅ [DEBUG] GlobalOptimizations - configureSession appelé');
  }, [configureSession]);

  // Nettoyage au démontage
  React.useEffect(() => {
    console.log('🔧 [DEBUG] GlobalOptimizations - useEffect cleanup...');
    return cleanupMarketSettings;
  }, [cleanupMarketSettings]);

  console.log('✅ [DEBUG] GlobalOptimizations - Rendu terminé');
  return null;
}

function App() {
  console.log('🎨 [DEBUG] App() - Rendu du composant App');
  
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AuthProvider>
          <CartProvider>
            <StorageInitializer>
              <Router>
                <GlobalOptimizations />
                <ConditionalPreloading />
                
                {/* 🌐 ROUTAGE SIMPLIFIÉ - Tout sur simpshopy.com */}
                <Routes>
                  {/* 🏠 PAGE D'ACCUEIL */}
                  <Route path="/" element={<Home />} />
                  
                  {/* 🛍️ BOUTIQUE PUBLIQUE */}
                  <Route path="/store/:storeSlug" element={<Storefront />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/payment-success" element={<PaymentSuccess />} />
                  <Route path="/product/:productId" element={<Index />} />
                  
                  {/* 📄 PAGES PUBLIQUES SEO OPTIMISÉES */}
                  <Route path="/features" element={<Features />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/testimonials" element={<TestimonialsPublic />} />
                  <Route path="/why-choose-us" element={<WhyChooseUs />} />
                  <Route path="/support" element={<Support />} />
                  <Route path="/about" element={<About />} />
                  
                  {/* 📜 PAGES LÉGALES */}
                  <Route path="/legal" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Legal />
                    </Suspense>
                  } />
                  <Route path="/privacy" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Privacy />
                    </Suspense>
                  } />
                  <Route path="/terms" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Terms />
                    </Suspense>
                  } />
                  
                  {/* 🔐 AUTHENTIFICATION */}
                  <Route path="/auth" element={
                    <Suspense fallback={<LoadingFallback />}>
                      <Auth />
                    </Suspense>
                  } />
                  
                  {/* 🎛️ INTERFACE ADMIN */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Dashboard />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/analytics" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Analytics />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/products" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Products />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/orders" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Orders />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/customers" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Customers />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Settings />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/site-builder" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <SiteBuilder />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/integrations" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Integrations />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/categories" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Categories />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/store-config" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <StoreConfig />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/store-config/site-builder" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <SiteBuilder />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/store-config/site-builder/editor/:templateId" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <OptimizedTemplateEditor />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/shipping" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Shipping />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/payments" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Payments />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/themes" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Themes />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/domains" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Domains />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/testimonials-admin" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <Testimonials />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  
                  {/* 🔌 INTÉGRATIONS SPÉCIFIQUES */}
                  <Route path="/integrations/dsers" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <DsersIntegration />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/integrations/mailchimp" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <MailchimpIntegration />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/integrations/:integrationId" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <IntegrationDetailPage />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  
                  {/* 🚀 ONBOARDING ET ÉDITEURS */}
                  <Route path="/onboarding" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <OnboardingWizard />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/template-editor" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <OptimizedTemplateEditor />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                  <Route path="/template-preview" element={
                    <ProtectedRoute>
                      <Suspense fallback={<LoadingFallback />}>
                        <TemplatePreview />
                      </Suspense>
                    </ProtectedRoute>
                  } />
                </Routes>
                
                <Toaster />
                <ConditionalCookieConsent />
              </Router>
            </StorageInitializer>
          </CartProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
