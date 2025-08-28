import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export interface CSVProduct {
  name: string;
  description: string;
  price: number;
  category: string;
  sku: string;
  stock_quantity: number;
  images?: string;
  weight?: number;
  dimensions?: string;
  tags?: string;
  meta_title?: string;
  meta_description?: string;
  status?: 'active' | 'inactive' | 'draft';
}

export interface ImportResult {
  success: boolean;
  imported: number;
  errors: string[];
  warnings: string[];
}

export class CSVImportService {
  /**
   * Valide une ligne de produit CSV
   */
  static validateProductRow(row: any, rowIndex: number): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Validation des champs requis
    if (!row.name || row.name.trim() === '') {
      errors.push(`Ligne ${rowIndex + 1}: Le nom du produit est requis`);
    }

    if (!row.price || isNaN(Number(row.price)) || Number(row.price) < 0) {
      errors.push(`Ligne ${rowIndex + 1}: Le prix doit être un nombre positif`);
    }

    // SKU est maintenant optionnel - validation seulement si fourni
    if (row.sku && row.sku.trim() === '') {
      errors.push(`Ligne ${rowIndex + 1}: Le SKU ne peut pas être vide si fourni`);
    }

    // Validation des champs optionnels
    if (row.description && row.description.trim() === '') {
      errors.push(`Ligne ${rowIndex + 1}: La description ne peut pas être vide si fournie`);
    }

    if (row.category && row.category.trim() === '') {
      errors.push(`Ligne ${rowIndex + 1}: La catégorie ne peut pas être vide si fournie`);
    }

    if (row.stock_quantity && (isNaN(Number(row.stock_quantity)) || Number(row.stock_quantity) < 0)) {
      errors.push(`Ligne ${rowIndex + 1}: La quantité en stock doit être un nombre positif`);
    }

    // Validation du statut
    if (row.status && !['active', 'inactive', 'draft'].includes(row.status.toLowerCase())) {
      errors.push(`Ligne ${rowIndex + 1}: Le statut doit être 'active', 'inactive' ou 'draft'`);
    }

    // Validation du poids
    if (row.weight && (isNaN(Number(row.weight)) || Number(row.weight) < 0)) {
      errors.push(`Ligne ${rowIndex + 1}: Le poids doit être un nombre positif`);
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  

     /**
    * Transforme une ligne CSV en objet produit
    */
      static transformRowToProduct(row: any, storeId: string, defaultStatus: 'active' | 'draft' | 'inactive' = 'draft'): Partial<Tables<'products'>> {
     // Fonction pour nettoyer la description
     const cleanDescription = (description: string): string | null => {
       if (!description || description.trim() === '') {
         return null;
       }
       
       let cleanedDescription = description.trim();
       
       // Si c'est du HTML, extraire le texte
       if (cleanedDescription.includes('<') && cleanedDescription.includes('>')) {
         const tempDiv = document.createElement('div');
         tempDiv.innerHTML = cleanedDescription;
         cleanedDescription = tempDiv.textContent || tempDiv.innerText || '';
       }
       
       // Nettoyer les espaces multiples
       cleanedDescription = cleanedDescription.replace(/\s+/g, ' ').trim();
       
       // Limiter la longueur si nécessaire
       if (cleanedDescription.length > 1000) {
         cleanedDescription = cleanedDescription.substring(0, 997) + '...';
       }
       
       return cleanedDescription || null;
     };

     return {
       store_id: storeId,
       name: row.name?.trim(),
       description: cleanDescription(row.description),
       price: Number(row.price) || 0,
       sku: row.sku?.trim() || `SKU_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
       inventory_quantity: row.stock_quantity ? Number(row.stock_quantity) : null,
       images: row.images ? row.images.split(',').map((url: string) => url.trim()) : [],
       weight: row.weight ? Number(row.weight) : null,
       dimensions: row.dimensions ? JSON.parse(row.dimensions) : null,
       tags: row.tags ? row.tags.split(',').map((tag: string) => tag.trim()) : [],
       status: (row.status?.toLowerCase() || defaultStatus) as 'active' | 'inactive' | 'draft',
       track_inventory: true,
       created_at: new Date().toISOString(),
       updated_at: new Date().toISOString()
     };
   }

     /**
    * Importe des produits depuis des données CSV
    */
   static async importProducts(
     csvData: any[], 
     storeId: string, 
     onProgress?: (progress: number) => void,
     defaultStatus: 'active' | 'draft' | 'inactive' = 'draft'
   ): Promise<ImportResult> {
     console.log('🔍 CSV Import - Début de l\'import:', { csvDataLength: csvData.length, storeId, defaultStatus });
    const result: ImportResult = {
      success: false,
      imported: 0,
      errors: [],
      warnings: []
    };

         try {
       // Détecter si c'est un format Shopify
       const isShopifyFormat = this.detectShopifyFormat(csvData);
       console.log('🔍 CSV Import - Format détecté:', { isShopifyFormat, firstRow: csvData[0] });
      
      let processedData: any[];
      
                    if (isShopifyFormat) {
         // Convertir automatiquement le format Shopify vers le format Simpshopy
         processedData = this.convertShopifyToSimpshopy(csvData, defaultStatus);
         console.log('🔍 CSV Import - Données Shopify converties:', { 
           processedDataLength: processedData.length, 
           firstProcessed: processedData[0],
           sampleDescription: processedData[0]?.description?.substring(0, 100) + '...'
         });
         result.warnings.push(`Format Shopify détecté et converti. ${processedData.length} produits traités.`);
       } else {
         // Traitement standard
         processedData = csvData;
         console.log('🔍 CSV Import - Données standard:', { 
           processedDataLength: processedData.length, 
           firstProcessed: processedData[0],
           sampleDescription: processedData[0]?.description?.substring(0, 100) + '...'
         });
       }

       // Validation de toutes les lignes (maintenant toujours en format Simpshopy)
       const validationErrors: string[] = [];
       const validRows: Record<string, unknown>[] = [];

       processedData.forEach((row, index) => {
         const validation = this.validateProductRow(row, index);
         if (!validation.isValid) {
           validationErrors.push(...validation.errors);
         } else {
           validRows.push(row);
         }
       });

       console.log('🔍 CSV Import - Validation terminée:', { 
         totalRows: processedData.length, 
         validRows: validRows.length, 
         validationErrors: validationErrors.length,
         firstValidRow: validRows[0]
       });

      if (validationErrors.length > 0) {
        result.errors = validationErrors;
        return result;
      }

             // Import des produits validés
       const totalRows = validRows.length;
       let importedCount = 0;

             for (const row of validRows) {
         try {
           const productData = this.transformRowToProduct(row, storeId, defaultStatus);
           console.log('🔍 CSV Import - Produit transformé:', { 
             productData: {
               ...productData,
               description: productData.description?.substring(0, 100) + '...'
             }
           });
          
                     // Vérifier si le SKU existe déjà (seulement si un SKU personnalisé est fourni)
           if (productData.sku && !productData.sku.startsWith('SKU_')) {
             const { data: existingProduct } = await supabase
               .from('products')
               .select('id')
               .eq('store_id', storeId)
               .eq('sku', productData.sku)
               .single();

             console.log('🔍 CSV Import - Vérification SKU:', { sku: productData.sku, existingProduct });

             if (existingProduct) {
               result.warnings.push(`SKU ${productData.sku} existe déjà, produit ignoré`);
               continue;
             }
           }

                     // Insérer le produit
           const { data: insertedData, error: insertError } = await supabase
             .from('products')
             .insert(productData)
             .select();

           console.log('🔍 CSV Import - Tentative d\'insertion:', { 
             productName: productData.name, 
             insertError, 
             insertedData 
           });

           if (insertError) {
             result.errors.push(`Erreur lors de l'insertion du produit ${productData.name}: ${insertError.message}`);
           } else {
             importedCount++;
           }

          // Mettre à jour le progrès
          if (onProgress) {
            onProgress((importedCount / totalRows) * 100);
          }

        } catch (error) {
          result.errors.push(`Erreur lors du traitement du produit: ${error}`);
        }
      }

             result.success = true;
       result.imported = importedCount;

       console.log('🔍 CSV Import - Import terminé:', { 
         success: result.success, 
         imported: result.imported, 
         errors: result.errors.length, 
         warnings: result.warnings.length 
       });

     } catch (error) {
       console.error('🔍 CSV Import - Erreur générale:', error);
       result.errors.push(`Erreur générale lors de l'import: ${error}`);
     }

     return result;
  }

  /**
   * Détecte si le CSV est au format Shopify
   */
     static detectShopifyFormat(csvData: any[]): boolean {
     if (csvData.length === 0) return false;
     
     const firstRow = csvData[0];
     const shopifyColumns = [
       'Handle', 'Title', 'Body (HTML)', 'Body (Plain Text)', 'Vendor', 'Type', 'Tags',
       'Variant SKU', 'Variant Price', 'Variant Inventory Qty', 'Image Src'
     ];
     
     return shopifyColumns.some(col => Object.prototype.hasOwnProperty.call(firstRow, col));
   }

     /**
    * Convertit les données Shopify vers le format Simpshopy standard
    */
   static convertShopifyToSimpshopy(csvData: any[], defaultStatus: 'active' | 'draft' | 'inactive' = 'draft'): any[] {
     const products: { [handle: string]: any } = {};

     csvData.forEach((row, index) => {
       const handle = row['Handle'];
       
       if (!handle) return; // Ignorer les lignes sans handle

       // Fonction pour nettoyer et convertir la description HTML
       const cleanDescription = (htmlDescription: string): string => {
         if (!htmlDescription || htmlDescription.trim() === '') {
           return '';
         }
         
         // Créer un élément temporaire pour extraire le texte
         const tempDiv = document.createElement('div');
         tempDiv.innerHTML = htmlDescription;
         
         // Extraire le texte brut
         let textContent = tempDiv.textContent || tempDiv.innerText || '';
         
         // Nettoyer les espaces multiples et les retours à la ligne
         textContent = textContent.replace(/\s+/g, ' ').trim();
         
         // Limiter la longueur si nécessaire (par exemple 1000 caractères)
         if (textContent.length > 1000) {
           textContent = textContent.substring(0, 997) + '...';
         }
         
         return textContent;
       };

       if (!products[handle]) {
         // Première ligne du produit - conversion vers format Simpshopy
         products[handle] = {
           name: row['Title'] || '',
           description: cleanDescription(row['Body (Plain Text)'] || row['Body (HTML)'] || ''),
           price: row['Variant Price'] || 0,
           sku: row['Variant SKU'] || `SKU_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
           stock_quantity: row['Variant Inventory Qty'] || 0,
           images: [],
           weight: row['Variant Grams'] ? Number(row['Variant Grams']) : null,
           tags: row['Tags'] ? row['Tags'].split(',').map((tag: string) => tag.trim()).join(',') : '',
           status: row['Published'] === 'TRUE' ? 'active' : defaultStatus
         };
       }

       // Ajouter les images si présentes
       if (row['Image Src'] && row['Image Src'].trim()) {
         products[handle].images.push(row['Image Src'].trim());
       }
     });

     // Convertir les images en string pour le format Simpshopy
     return Object.values(products).map(product => ({
       ...product,
       images: product.images.join(',') // Convertir le tableau en string séparé par des virgules
     }));
   }

     /**
    * Génère un template CSV pour les produits
    * Note: SKU est optionnel - sera généré automatiquement si non fourni
    */
   static generateTemplate(): string {
    const headers = [
      'name',
      'price',
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

    const sampleData = [
      'iPhone 15 Pro',
      '999.99',
      'IPHONE-15-PRO',
      'Le dernier iPhone avec des fonctionnalités avancées',
      'Électronique',
      '50',
      'https://example.com/iphone1.jpg,https://example.com/iphone2.jpg',
      '0.187',
      '147.7x71.5x8.25',
      'smartphone,apple,5g',
      'iPhone 15 Pro - Le meilleur smartphone',
      'Découvrez le iPhone 15 Pro avec ses fonctionnalités révolutionnaires',
      'active'
    ];

    return [headers.join(','), sampleData.join(',')].join('\n');
  }

  /**
   * Génère un template CSV compatible Shopify
   */
  static generateShopifyTemplate(): string {
    const headers = [
      'Handle',
      'Title',
      'Body (HTML)',
      'Vendor',
      'Type',
      'Tags',
      'Published',
      'Option1 Name',
      'Option1 Value',
      'Variant SKU',
      'Variant Grams',
      'Variant Inventory Qty',
      'Variant Price',
      'Variant Compare At Price',
      'Image Src',
      'Image Position'
    ];

    const sampleData = [
      'unmark-sneaker-eraser-1',
      'unmark - sneaker eraser',
      'Description du produit en HTML',
      'Unbloo',
      'Shoe Cleaning',
      'sneaker,cleaning',
      'TRUE',
      'Title',
      'Default Title',
      'CJYD197864601AZ',
      '58',
      '100',
      '19.99',
      '33.99',
      'https://example.com/image1.jpg',
      '1'
    ];

    return [headers.join(','), sampleData.join(',')].join('\n');
  }

  /**
   * Exporte les produits existants en CSV
   */
  static async exportProducts(storeId: string): Promise<string> {
    try {
      const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', storeId)
        .order('created_at', { ascending: false });

      if (error) {
        throw new Error(`Erreur lors de l'export: ${error.message}`);
      }

      if (!products || products.length === 0) {
        return '';
      }

      const headers = [
        'name',
        'description',
        'price',
        'category', 
        'sku',
        'stock_quantity',
        'images',
        'weight',
        'dimensions',
        'tags',
        'meta_title',
        'meta_description',
        'status'
      ];

      const csvRows = [headers.join(',')];

      products.forEach(product => {
        const row = [
          `"${product.name || ''}"`,
          `"${product.description || ''}"`,
          product.price || 0,
          `"${product.category || ''}"`,
          `"${product.sku || ''}"`,
          product.stock_quantity || 0,
          `"${Array.isArray(product.images) ? product.images.join(',') : ''}"`,
          product.weight || '',
          `"${product.dimensions || ''}"`,
          `"${Array.isArray(product.tags) ? product.tags.join(',') : ''}"`,
          `"${product.meta_title || ''}"`,
          `"${product.meta_description || ''}"`,
          product.status || 'active'
        ];
        csvRows.push(row.join(','));
      });

      return csvRows.join('\n');

    } catch (error) {
      throw new Error(`Erreur lors de l'export: ${error}`);
    }
  }
}

