import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileText, CheckCircle, AlertCircle, X, Download, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';
import { CSVImportService } from '@/services/csvImportService';

interface ImportProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onImportComplete: () => void;
  storeId: string;
}

interface CSVRow {
  [key: string]: string;
}

interface ColumnMapping {
  [key: string]: string;
}

const ImportProductsDialog: React.FC<ImportProductsDialogProps> = ({
  open,
  onOpenChange,
  onImportComplete,
  storeId
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [csvData, setCsvData] = useState<CSVRow[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({});
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewRows, setPreviewRows] = useState<CSVRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [currentStep, setCurrentStep] = useState<'upload' | 'mapping' | 'preview' | 'importing'>('upload');
  const [isShopifyFormat, setIsShopifyFormat] = useState(false);
  const [defaultStatus, setDefaultStatus] = useState<'active' | 'draft' | 'inactive'>('draft');
  
  const { toast } = useToast();

     // Colonnes requises pour les produits
   const requiredColumns = [
     'name',
     'price'
   ];

     // Colonnes optionnelles
   const optionalColumns = [
     'sku',
     'description',
     'category',
     'stock_quantity',
     'images',
     'weight',
     'dimensions',
     'tags',
     'meta_title',
     'meta_description',
     'status'
   ];

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'text/csv') {
      handleFileSelect(droppedFile);
    }
  }, []);

    const handleFileSelect = (selectedFile: File) => {
    setFile(selectedFile);
    setErrors([]);
    
    Papa.parse(selectedFile, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          setErrors(results.errors.map(err => `Ligne ${err.row}: ${err.message}`));
          return;
        }

        const data = results.data as CSVRow[];
        const headers = Object.keys(data[0] || {});
        
        // Détecter si c'est un format Shopify
        const isShopifyFormat = CSVImportService.detectShopifyFormat(data);
        setIsShopifyFormat(isShopifyFormat);
        
        if (isShopifyFormat) {
          // Convertir automatiquement vers le format Simpshopy
          const convertedData = CSVImportService.convertShopifyToSimpshopy(data);
          setCsvData(convertedData);
          setHeaders(Object.keys(convertedData[0] || {}));
          setPreviewRows(convertedData.slice(0, 5));
          
          // Mapping automatique pour Shopify converti
          const autoMapping: ColumnMapping = {};
          Object.keys(convertedData[0] || {}).forEach(header => {
            autoMapping[header] = header; // Mapping direct car déjà converti
          });
          setColumnMapping(autoMapping);
        } else {
          // Traitement standard
          setCsvData(data);
          setHeaders(headers);
          setPreviewRows(data.slice(0, 5));
          
          // Auto-mapping des colonnes
          const autoMapping: ColumnMapping = {};
          headers.forEach(header => {
            const lowerHeader = header.toLowerCase();
            
            // Mapping standard Simpshopy
            if (lowerHeader.includes('nom') || lowerHeader.includes('name') || lowerHeader === 'title') autoMapping[header] = 'name';
            else if (lowerHeader.includes('description') || lowerHeader.includes('body')) autoMapping[header] = 'description';
            else if (lowerHeader.includes('prix') || lowerHeader.includes('price') || lowerHeader.includes('variant price')) autoMapping[header] = 'price';
            else if (lowerHeader.includes('catégorie') || lowerHeader.includes('category') || lowerHeader === 'type') autoMapping[header] = 'category';
            else if (lowerHeader.includes('sku') || lowerHeader.includes('variant sku')) autoMapping[header] = 'sku';
            else if (lowerHeader.includes('stock') || lowerHeader.includes('quantity') || lowerHeader.includes('inventory') || lowerHeader.includes('variant inventory qty')) autoMapping[header] = 'stock_quantity';
            else if (lowerHeader.includes('image') || lowerHeader.includes('image src')) autoMapping[header] = 'images';
            else if (lowerHeader.includes('poids') || lowerHeader.includes('weight') || lowerHeader.includes('variant grams')) autoMapping[header] = 'weight';
            else if (lowerHeader.includes('dimension')) autoMapping[header] = 'dimensions';
            else if (lowerHeader.includes('tag')) autoMapping[header] = 'tags';
            else if (lowerHeader.includes('meta')) autoMapping[header] = 'meta_title';
            else if (lowerHeader.includes('statut') || lowerHeader.includes('status') || lowerHeader.includes('published')) autoMapping[header] = 'status';
          });
          setColumnMapping(autoMapping);
        }
        
        setCurrentStep('mapping');
      },
      error: (error) => {
        setErrors([`Erreur lors de la lecture du fichier: ${error.message}`]);
      }
    });
  };

  const validateMapping = () => {
    const mappedColumns = Object.values(columnMapping);
    const missingRequired = requiredColumns.filter(col => !mappedColumns.includes(col));
    
    if (missingRequired.length > 0) {
      setErrors([`Colonnes requises manquantes: ${missingRequired.join(', ')}`]);
      return false;
    }
    
    setErrors([]);
    setCurrentStep('preview');
    return true;
  };

  const startImport = async () => {
    setIsUploading(true);
    setCurrentStep('importing');
    setUploadProgress(0);

    try {
      // Transformer les données selon le mapping
      const mappedData = csvData.map(row => {
        const mappedRow: any = {};
        Object.keys(columnMapping).forEach(header => {
          if (columnMapping[header]) {
            mappedRow[columnMapping[header]] = row[header];
          }
        });
        return mappedRow;
      });

             // Importer les produits
       const result = await CSVImportService.importProducts(
         mappedData,
         storeId,
         (progress) => setUploadProgress(progress),
         defaultStatus
       );

      if (result.success) {
        toast({
          title: "Import réussi !",
          description: `${result.imported} produits ont été importés avec succès.`,
        });

        if (result.warnings.length > 0) {
          toast({
            title: "Avertissements",
            description: `${result.warnings.length} avertissements lors de l'import.`,
            variant: "default"
          });
        }

        onImportComplete();
        onOpenChange(false);
      } else {
        toast({
          title: "Erreur d'import",
          description: `${result.errors.length} erreurs lors de l'import.`,
          variant: "destructive"
        });
        setErrors(result.errors);
        setCurrentStep('preview');
      }
      
    } catch (error) {
      toast({
        title: "Erreur d'import",
        description: "Une erreur s'est produite lors de l'import des produits.",
        variant: "destructive"
      });
      setErrors([`Erreur: ${error}`]);
      setCurrentStep('preview');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const downloadTemplate = () => {
    const csv = CSVImportService.generateTemplate();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_produits.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadShopifyTemplate = () => {
    const csv = CSVImportService.generateShopifyTemplate();
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'template_shopify.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Importer des produits depuis CSV
          </DialogTitle>
          <DialogDescription>
            Importez vos produits en masse depuis un fichier CSV. 
            Téléchargez le modèle pour voir le format attendu.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="upload" disabled={currentStep !== 'upload'}>
              Upload
            </TabsTrigger>
            <TabsTrigger value="mapping" disabled={currentStep !== 'mapping'}>
              Mapping
            </TabsTrigger>
            <TabsTrigger value="preview" disabled={currentStep !== 'preview'}>
              Aperçu
            </TabsTrigger>
            <TabsTrigger value="importing" disabled={currentStep !== 'importing'}>
              Import
            </TabsTrigger>
          </TabsList>

                     <TabsContent value="upload" className="space-y-4">
             <Card>
               <CardHeader>
                 <CardTitle className="flex items-center gap-2">
                   <Download className="h-4 w-4" />
                   Télécharger les modèles
                 </CardTitle>
               </CardHeader>
               <CardContent className="space-y-2">
                 <Button onClick={downloadTemplate} variant="outline" className="w-full">
                   <Download className="h-4 w-4 mr-2" />
                   Template Simpshopy
                 </Button>
                 <Button onClick={downloadShopifyTemplate} variant="outline" className="w-full">
                   <Download className="h-4 w-4 mr-2" />
                   Template Shopify
                 </Button>
               </CardContent>
             </Card>

             <Card>
               <CardHeader>
                 <CardTitle>Configuration de l'import</CardTitle>
               </CardHeader>
               <CardContent>
                 <div className="space-y-4">
                   <div>
                     <label className="text-sm font-medium mb-2 block">
                       Statut par défaut des produits importés
                     </label>
                     <div className="grid grid-cols-3 gap-2">
                       <Button
                         type="button"
                         variant={defaultStatus === 'draft' ? 'default' : 'outline'}
                         onClick={() => setDefaultStatus('draft')}
                         className="flex flex-col items-center p-4 h-auto"
                       >
                         <FileText className="h-4 w-4 mb-1" />
                         <span className="text-xs">Brouillon</span>
                       </Button>
                       <Button
                         type="button"
                         variant={defaultStatus === 'active' ? 'default' : 'outline'}
                         onClick={() => setDefaultStatus('active')}
                         className="flex flex-col items-center p-4 h-auto"
                       >
                         <CheckCircle className="h-4 w-4 mb-1" />
                         <span className="text-xs">Actif</span>
                       </Button>
                       <Button
                         type="button"
                         variant={defaultStatus === 'inactive' ? 'default' : 'outline'}
                         onClick={() => setDefaultStatus('inactive')}
                         className="flex flex-col items-center p-4 h-auto"
                       >
                         <X className="h-4 w-4 mb-1" />
                         <span className="text-xs">Inactif</span>
                       </Button>
                     </div>
                     <p className="text-xs text-gray-500 mt-2">
                       {defaultStatus === 'draft' && "Les produits seront importés en mode brouillon pour révision"}
                       {defaultStatus === 'active' && "Les produits seront directement visibles dans votre boutique"}
                       {defaultStatus === 'inactive' && "Les produits seront importés mais masqués du public"}
                     </p>
                   </div>
                 </div>
               </CardContent>
             </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload du fichier CSV</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors"
                  onDrop={handleFileDrop}
                  onDragOver={(e) => e.preventDefault()}
                >
                  <Upload className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <p className="text-lg font-medium mb-2">
                    Glissez-déposez votre fichier CSV ici
                  </p>
                  <p className="text-sm text-gray-500 mb-4">
                    ou cliquez pour sélectionner un fichier
                  </p>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                    className="hidden"
                    id="csv-upload"
                  />
                  <label htmlFor="csv-upload">
                    <Button variant="outline" className="cursor-pointer">
                      Sélectionner un fichier
                    </Button>
                  </label>
                </div>
                
                                 {file && (
                   <div className="mt-4 p-4 bg-green-50 rounded-lg">
                     <div className="flex items-center gap-2">
                       <CheckCircle className="h-4 w-4 text-green-600" />
                       <span className="font-medium">{file.name}</span>
                       <Badge variant="secondary">{file.size} bytes</Badge>
                       {isShopifyFormat && (
                         <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                           Format Shopify détecté
                         </Badge>
                       )}
                     </div>
                   </div>
                 )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mapping" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Mapping des colonnes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {headers.map((header) => (
                    <div key={header} className="space-y-2">
                      <label className="text-sm font-medium">{header}</label>
                      <select
                        value={columnMapping[header] || ''}
                        onChange={(e) => setColumnMapping(prev => ({
                          ...prev,
                          [header]: e.target.value
                        }))}
                        className="w-full p-2 border rounded-md"
                      >
                        <option value="">-- Sélectionner --</option>
                        {requiredColumns.map(col => (
                          <option key={col} value={col} className="font-medium">
                            {col} (requis)
                          </option>
                        ))}
                        {optionalColumns.map(col => (
                          <option key={col} value={col}>
                            {col} (optionnel)
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 flex gap-2">
                  <Button onClick={validateMapping}>
                    Valider le mapping
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentStep('upload')}>
                    Retour
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Aperçu des données</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {headers.map(header => (
                          <TableHead key={header}>
                            <div className="flex items-center gap-1">
                              {header}
                              {columnMapping[header] && (
                                <Badge variant="outline" className="text-xs">
                                  {columnMapping[header]}
                                </Badge>
                              )}
                            </div>
                          </TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewRows.map((row, index) => (
                        <TableRow key={index}>
                          {headers.map(header => (
                            <TableCell key={header} className="max-w-xs truncate">
                              {row[header]}
                            </TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                
                <div className="mt-4 text-sm text-gray-500">
                  Affichage des 5 premières lignes sur {csvData.length} au total
                </div>
                
                <div className="mt-6 flex gap-2">
                  <Button onClick={startImport}>
                    Commencer l'import
                  </Button>
                  <Button variant="outline" onClick={() => setCurrentStep('mapping')}>
                    Retour
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="importing" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Import en cours...</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-center text-sm text-gray-500">
                    {Math.round(uploadProgress)}% terminé
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {errors.length > 0 && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              <ul className="list-disc list-inside">
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default ImportProductsDialog;
