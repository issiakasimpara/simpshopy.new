
import { useState } from 'react';
import { Template, TemplateBlock } from '@/types/template';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Home, 
  Package, 
  Grid, 
  Phone, 
  Settings,
  Eye,
  FileText,
  Layout,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import BlockLibrary from './BlockLibrary';
import SiteSettings from './SiteSettings';

interface EditorSidebarProps {
  template: Template;
  currentPage: string;
  onPageChange: (page: string) => void;
  onBlockAdd: (block: TemplateBlock) => void;
  showSettings: boolean;
  onToggleSettings: () => void;
}

const EditorSidebar = ({
  template,
  currentPage,
  onPageChange,
  onBlockAdd,
  showSettings,
  onToggleSettings
}: EditorSidebarProps) => {
  const [activeTab, setActiveTab] = useState('pages');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const getPageIcon = (pageName: string) => {
    switch (pageName) {
      case 'home': return <Home className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'product': return <Package className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'category': return <Grid className="h-3 w-3 sm:h-4 sm:w-4" />;
      case 'contact': return <Phone className="h-3 w-3 sm:h-4 sm:w-4" />;
      default: return <FileText className="h-3 w-3 sm:h-4 sm:w-4" />;
    }
  };

  const getPageDisplayName = (pageName: string) => {
    const names = {
      'home': 'Accueil',
      'product': 'Produits',
      'category': 'Catégories',
      'contact': 'Contact'
    };
    return names[pageName] || pageName;
  };

  const getPageDescription = (pageName: string) => {
    const descriptions = {
      'home': 'Page d\'accueil principale',
      'product': 'Catalogue des produits',
      'category': 'Pages de catégories',
      'contact': 'Informations de contact'
    };
    return descriptions[pageName] || '';
  };

  const getPageBlockCount = (pageName: string) => {
    return template.pages[pageName]?.length || 0;
  };

  return (
    <>
      {/* Bouton flottant pour ouvrir le sidebar sur mobile quand il est fermé */}
      {isCollapsed && (
        <button
          onClick={toggleCollapse}
          className="fixed top-20 left-4 z-20 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 transition-colors sm:hidden"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      )}

      <div className={`relative bg-white border-r border-gray-200 h-full mt-16 sm:mt-20 flex flex-col transition-all duration-300 ease-in-out ${
        isCollapsed 
          ? 'w-0 sm:w-64 lg:w-80' 
          : 'w-64 sm:w-72 lg:w-80'
      }`}>
        {/* Bouton de basculement - visible uniquement sur mobile */}
        <button
          onClick={toggleCollapse}
          className="absolute -right-3 top-1/2 transform -translate-y-1/2 z-10 bg-white border border-gray-200 rounded-full p-1.5 shadow-md hover:shadow-lg transition-shadow sm:hidden"
        >
          {isCollapsed ? (
            <ChevronRight className="h-4 w-4 text-gray-600" />
          ) : (
            <ChevronLeft className="h-4 w-4 text-gray-600" />
          )}
        </button>

        {/* Contenu du sidebar */}
        <div className={`flex flex-col h-full ${isCollapsed ? 'hidden sm:flex' : 'flex'}`}>
          <div className="p-3 sm:p-4 border-b">
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="font-semibold text-sm sm:text-lg">Éditeur</h2>
              <Button
                variant={showSettings ? 'default' : 'outline'}
                size="sm"
                onClick={onToggleSettings}
                className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm h-8 sm:h-9 px-2 sm:px-3"
              >
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{showSettings ? 'Éditeur' : 'Réglages'}</span>
              </Button>
            </div>
            
            {!showSettings && (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-8 sm:h-9">
                  <TabsTrigger value="pages" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Layout className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Pages</span>
                  </TabsTrigger>
                  <TabsTrigger value="blocks" className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Blocs</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {showSettings ? (
              <div className="p-3 sm:p-4">
                <SiteSettings
                  template={template}
                  onUpdate={() => {}}
                />
              </div>
            ) : (
              <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                <TabsContent value="pages" className="p-3 sm:p-4 space-y-3 sm:space-y-4 mt-0">
                  <div>
                    <h3 className="font-medium mb-2 sm:mb-3 text-xs sm:text-sm text-gray-600 uppercase tracking-wide">
                      Pages du site
                    </h3>
                    <div className="space-y-2">
                      {Object.keys(template.pages).map((pageName) => {
                        const blockCount = getPageBlockCount(pageName);
                        const isActive = currentPage === pageName;
                        
                        return (
                          <Card 
                            key={pageName}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                            }`}
                            onClick={() => onPageChange(pageName)}
                          >
                            <CardContent className="p-3 sm:p-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 sm:gap-3">
                                  <div className={`p-1.5 sm:p-2 rounded-lg ${
                                    isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'
                                  }`}>
                                    {getPageIcon(pageName)}
                                  </div>
                                  <div>
                                    <h4 className="font-medium text-xs sm:text-sm">
                                      {getPageDisplayName(pageName)}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                      {getPageDescription(pageName)}
                                    </p>
                                  </div>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                  <Badge 
                                    variant={blockCount > 0 ? 'default' : 'secondary'}
                                    className="text-xs"
                                  >
                                    {blockCount} bloc{blockCount !== 1 ? 's' : ''}
                                  </Badge>
                                  {isActive && (
                                    <Badge variant="outline" className="text-xs">
                                      Actuelle
                                    </Badge>
                                  )}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="font-medium mb-2 sm:mb-3 text-xs sm:text-sm text-gray-600 uppercase tracking-wide">
                      Actions rapides
                    </h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs sm:text-sm h-8 sm:h-9"
                        onClick={() => setActiveTab('blocks')}
                      >
                        <Plus className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Ajouter un bloc</span>
                        <span className="sm:hidden">Ajouter</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs sm:text-sm h-8 sm:h-9"
                        onClick={onToggleSettings}
                      >
                        <Settings className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden sm:inline">Réglages du site</span>
                        <span className="sm:hidden">Réglages</span>
                      </Button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="blocks" className="mt-0 h-full">
                  <div className="p-3 sm:p-4">
                    <div className="mb-3 sm:mb-4">
                      <h3 className="font-medium mb-2 text-xs sm:text-sm">Ajouter à la page</h3>
                      <Badge variant="outline" className="text-xs">
                        {getPageDisplayName(currentPage)}
                      </Badge>
                    </div>
                    <BlockLibrary onBlockAdd={onBlockAdd} />
                  </div>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default EditorSidebar;
