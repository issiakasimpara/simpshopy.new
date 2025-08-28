
export const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'Rouge': '#EF4444',
    'Bleu': '#3B82F6',
    'Vert': '#10B981',
    'Noir': '#000000',
    'Blanc': '#FFFFFF',
    'Gris': '#6B7280',
    'Rose': '#EC4899',
    'Jaune': '#F59E0B',
    'Orange': '#F97316',
    'Violet': '#8B5CF6'
  };
  return colorMap[colorName] || '#6B7280';
};
