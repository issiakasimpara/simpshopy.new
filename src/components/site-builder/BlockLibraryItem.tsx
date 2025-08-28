
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface BlockLibraryItemProps {
  blockType: {
    type: string;
    name: string;
    description: string;
    icon: string;
    content: any;
    styles: any;
  };
  onAddBlock: (template: any) => void;
}

const BlockLibraryItem = ({ blockType, onAddBlock }: BlockLibraryItemProps) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => onAddBlock(blockType)}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <span className="text-base sm:text-lg">{blockType.icon}</span>
          <CardTitle className="text-xs sm:text-sm">{blockType.name}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <CardDescription className="text-xs">
          {blockType.description}
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default BlockLibraryItem;
