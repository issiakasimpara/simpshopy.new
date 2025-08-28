
export interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
}

export const templateCategories: TemplateCategory[] = [
  { id: 'fashion', name: 'Mode & Accessoires', icon: '👗' },
  { id: 'electronics', name: 'Électronique', icon: '📱' },
  { id: 'food', name: 'Alimentation', icon: '🍕' },
  { id: 'beauty', name: 'Beauté', icon: '💄' },
  { id: 'sports', name: 'Sport', icon: '⚽' },
  { id: 'home', name: 'Maison', icon: '🏠' },
  { id: 'art', name: 'Art & Artisanat', icon: '🎨' },
];
