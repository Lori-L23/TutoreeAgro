import { MapPin, ChevronRight } from "lucide-react";
import React, { useState, useEffect } from "react";
import { AlertCircle, Loader } from "lucide-react";
import { Link } from "react-router-dom";

// Default images for fallback
const DEFAULT_IMAGES = {
  default: "/placeholder.svg",
  agro: "/agro-placeholder.svg",
};

// Composant pour gérer les images avec fallback
const ImageWithFallback = ({
  src,
  alt,
  className,
  fallbackKey = "default",
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setImgSrc(src);
    setIsLoading(true);
    setHasError(false);
  }, [src]);

  const handleError = () => {
    setHasError(true);
    setImgSrc(DEFAULT_IMAGES[fallbackKey] || DEFAULT_IMAGES.default);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  return (
    <div className={`relative ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <Loader className="h-6 w-6 text-gray-400 animate-spin" />
        </div>
      )}
      <img
        src={imgSrc || "/placeholder.svg"}
        alt={alt}
        className={`${className} ${
          isLoading ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}
        onError={handleError}
        onLoad={handleLoad}
      />
      {hasError && (
        <div className="absolute bottom-1 right-1">
          <AlertCircle className="h-4 w-4 text-yellow-500" />
        </div>
      )}
    </div>
  );
};
// Helper to get fallback image key
const getImageFallbackKey = (category) => {
  return category && category.toLowerCase().includes("agro")
    ? "agro"
    : "default";
};

const EntrepriseCard = ({ enterprise, viewMode }) => {
  if (viewMode === "grid") {
    return (
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all group">
        <div className="h-32 bg-gray-100 relative overflow-hidden">
          <ImageWithFallback
            src={enterprise.cover || "/placeholder.svg"}
            alt={`${enterprise.name} banner`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            fallbackKey={getImageFallbackKey(enterprise.category)}
          />
          <div className="absolute -bottom-10 left-4">
            <ImageWithFallback
              src={enterprise.logo || "/placeholder.svg"}
              alt={enterprise.name}
              className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-md"
              fallbackKey={getImageFallbackKey(enterprise.category)}
            />
          </div>
        </div>

        <div className="p-4 pt-12">
          <h3 className="font-bold text-lg mb-1">{enterprise.name}</h3>
          <p className="text-sm text-gray-500 mb-2">{enterprise.category}</p>

          <p className="text-sm text-gray-600 mb-4 line-clamp-3">
            {enterprise.description}
          </p>

          <div className="flex items-center mb-3">
            <MapPin className="h-4 w-4 text-gray-500 mr-1" />
            <span className="text-sm text-gray-600">
              {enterprise.ville}, {enterprise.region}
            </span>
          </div>

          <div className="flex flex-wrap gap-1 mb-4">
            {enterprise.certifications.map((cert, idx) => (
              <span
                key={idx}
                className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
              >
                {cert}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              {enterprise.products} produits
            </span>
            <Link
              to={`/entreprises/${enterprise.id}`}
              className="text-green-700 hover:text-green-800 text-sm font-medium flex items-center group-hover:translate-x-1 transition-transform"
            >
              Voir le profil <ChevronRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all p-6 flex flex-col md:flex-row group">
      <div className="flex-shrink-0 mb-4 md:mb-0 md:mr-6">
        <ImageWithFallback
          src={enterprise.logo || "/placeholder.svg"}
          alt={enterprise.name}
          className="w-24 h-24 rounded-xl object-cover shadow-sm group-hover:scale-105 transition-transform"
          fallbackKey={getImageFallbackKey(enterprise.category)}
        />
      </div>

      <div className="flex-1">
        <div className="flex flex-col md:flex-row md:justify-between">
          <div>
            <h3 className="font-bold text-lg">{enterprise.name}</h3>
            <p className="text-sm text-gray-500 mb-2">{enterprise.category}</p>
          </div>
          <p className="text-sm text-gray-600 my-3 line-clamp-2">
            {enterprise.description}
          </p>
        </div>

        <div className="flex items-center">
          <MapPin className="h-4 w-4 text-gray-500 mr-1" />
          <span className="text-sm text-gray-600">
            {enterprise.ville}, {enterprise.region}
          </span>
        </div>

        <div className="flex flex-wrap gap-1 mb-4">
          {enterprise.certifications.map((cert, idx) => (
            <span
              key={idx}
              className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full hover:bg-green-200 transition-colors"
            >
              {cert}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col justify-between items-start md:items-end">
        <span className="text-sm font-medium mb-2 md:mb-0">
          {enterprise.products} produits
        </span>
        <Link
          to={`/entreprises/${enterprise.id}`}
          className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center group-hover:translate-x-1 transition-all"
        >
          Voir le profil <ChevronRight className="h-4 w-4 ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default EntrepriseCard;
