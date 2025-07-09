import React from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
          <div className="relative ">
            <LazyLoadImage
              src={product.image}
              alt={product.name}
              effect="blur"
              className="w-full h-full"
            />
                {/* {product.isBulk && (
                <span className="absolute top-2 right-2 bg-cameroon-yellow text-xs px-2 py-1 rounded">
                    En gros
                </span>
                )} */}
          </div>
          <div className="p-4">
            <h3 className="font-semibold text-lg mb-1 truncate">{product.name}</h3>
            <p className="text-gray-600 text-sm mb-2 line-clamp-2">
              {product.description}
            </p>
            <p> {product.category}</p>
            <div className="flex justify-between items-center">
              <span className="font-bold text-cameroon-green">
                {product.price.toLocaleString()} XAF
              </span>
              <Link
                to={`/product/${product.id}`}
                className="bg-cameroon-green text-white px-3 py-1 rounded text-sm hover:bg-opacity-90 transition"
              >
                Voir plus
              </Link>
            </div>
          </div>
        </div>
      );
}
