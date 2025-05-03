import { useState } from "react";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";

interface ImagePreviewProps {
  image: string;
  onRemove: () => void;
}

const ImagePreview = ({ image, onRemove }: ImagePreviewProps) => {
  const [isHovering, setIsHovering] = useState(false);
  
  return (
    <div 
      className="relative rounded-md overflow-hidden border border-gray-200 aspect-square"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      <img 
        src={image} 
        alt="Uploaded image" 
        className="w-full h-full object-cover"
      />
      
      {isHovering && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity">
          <Button 
            variant="destructive" 
            size="icon"
            className="h-7 w-7 rounded-full"
            onClick={(e) => {
              e.stopPropagation();
              onRemove();
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default ImagePreview;