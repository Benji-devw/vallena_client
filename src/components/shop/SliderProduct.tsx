'use client';

import { Product } from '@/services/api/productService';
import ProductCard from './ProductCard';
import OriginalSlider, { Settings as SlickSettings } from "react-slick";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Import des icônes

// Assertion de type pour le composant Slider
const Slider = OriginalSlider as unknown as React.ComponentType<SlickSettings>;

interface SliderProductProps {
  products: Product[];
  title?: string;
}

// Flèches personnalisées pour react-slick
function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow right-1 md:right-2 z-10`}
      style={{ ...style, display: "block" }} // Assure-toi que le style est appliqué
      onClick={onClick}
    >
      <button aria-label="Next slide" className="p-1.5 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out focus:outline-none">
        <ChevronRight size={28} />
      </button>
    </div>
  );
}

function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow left-0`}
      style={{ ...style, display: "block" }}
      onClick={onClick}
    >
      <button aria-label="Previous slide" className="p-1.5 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out focus:outline-none">
        <ChevronLeft size={28} />
      </button>
    </div>
  );
}

export default function SliderProduct({ products, title }: SliderProductProps) {
  if (!products || products.length === 0) {
    return null;
  }

  const settings: SlickSettings = {
    dots: true,
    infinite: products.length > 3, // Ou products.length > settings.slidesToShow initial
    speed: 500,
    slidesToShow: 4, // Nombre de base pour les grands écrans
    slidesToScroll: 4,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      {
        breakpoint: 1280, // xl
        settings: {
          slidesToShow: products.length < 4 ? products.length : 4,
          slidesToScroll: products.length < 4 ? products.length : 4,
          infinite: products.length > (products.length < 4 ? products.length : 4),
        }
      },
      {
        breakpoint: 1024, // lg
        settings: {
          slidesToShow: products.length < 3 ? products.length : 3,
          slidesToScroll: products.length < 3 ? products.length : 3,
          infinite: products.length > (products.length < 3 ? products.length : 3),
          dots: true
        }
      },
      {
        breakpoint: 768, // md (au lieu de 640 pour mieux s'aligner sur les breakpoints courants)
        settings: {
          slidesToShow: products.length < 2 ? products.length : 2,
          slidesToScroll: products.length < 2 ? products.length : 2,
          infinite: products.length > (products.length < 2 ? products.length : 2),
          dots: true
        }
      },
      {
        breakpoint: 640, // sm (pour les mobiles)
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: products.length > 1,
          dots: true // Afficher les points sur mobile peut être utile
        }
      }
    ]
  };

  return (
    <div className="py-8 slick-slider-container"> {/* Classe pour cibler le style si besoin */}
      {title && (
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-6 md:mb-8 text-center md:text-left px-4">{title}</h2>
      )}
      {/* La div parente du Slider doit souvent avoir une largeur définie ou être dans un conteneur flexible */}
      <div className="mx-auto max-w-7xl px-0 md:px-4"> {/* Ajuste le padding/max-width si besoin */}
        <Slider {...settings}>
          {products.map((product) => (
            <div key={product._id} className="px-1.5 md:px-2 outline-none"> {/* Padding entre les cartes */}
              <ProductCard product={product} viewMode="grid" />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
} 