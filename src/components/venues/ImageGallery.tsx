
import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const ImageGallery = ({ images, alt }: ImageGalleryProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [zoomedIndex, setZoomedIndex] = useState<number | null>(null);
  
  // If no images, show placeholder
  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-muted flex items-center justify-center rounded-lg">
        <p className="text-muted-foreground">No images available</p>
      </div>
    );
  }

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleZoom = (index: number) => {
    setZoomedIndex(index);
  };
  
  const handleZoomedClose = () => {
    setZoomedIndex(null);
  };
  
  const imageUrls = images.map(img => `http://localhost:5000/uploads/${img}`);  
  
  return (
    <div className="venue-gallery">
      {/* Main Image */}
      <div className="aspect-[16/9] relative rounded-lg overflow-hidden shadow-lg">
        <img 
          src={imageUrls[currentIndex]} 
          alt={`${alt} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Zoom button */}
        <button
          onClick={() => handleZoom(currentIndex)}
          className="absolute top-2 right-2 bg-black/30 text-white hover:bg-black/50 p-2 rounded-full transition-colors"
          aria-label="Zoom image"
        >
          <ZoomIn size={20} />
        </button>
        
        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button 
              onClick={goToPrevious}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 p-3 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 p-3 rounded-full transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>
      
      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {imageUrls.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition-all duration-200",
                currentIndex === index 
                  ? "ring-2 ring-primary scale-105 shadow-md" 
                  : "ring-1 ring-border hover:ring-primary/50"
              )}
            >
              <img 
                src={image} 
                alt={`${alt} - Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
      
      {/* Lightbox Dialog */}
      <Dialog open={zoomedIndex !== null} onOpenChange={handleZoomedClose}>
        <DialogContent className="max-w-screen-lg w-[95vw] h-[85vh] p-0 bg-black">
          <div className="relative w-full h-full flex items-center justify-center">
            {zoomedIndex !== null && (
              <img 
                src={imageUrls[zoomedIndex]} 
                alt={`${alt} - Zoomed Image`}
                className="max-h-full max-w-full object-contain"
              />
            )}
            
            {images.length > 1 && zoomedIndex !== null && (
              <>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedIndex(zoomedIndex === 0 ? images.length - 1 : zoomedIndex - 1);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 p-3 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomedIndex(zoomedIndex === images.length - 1 ? 0 : zoomedIndex + 1);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white hover:bg-black/50 p-3 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ImageGallery;
