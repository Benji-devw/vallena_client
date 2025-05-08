'use client';

import { Product } from '@/services/api/productService';
import ProductCard from './ProductCard';
import OriginalSlider, { Settings as SlickSettings } from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Slider = OriginalSlider as unknown as React.ComponentType<SlickSettings>;

interface SliderProductProps {
  products: Product[];
  title?: string;
}

function NextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow-right right-1 md:right-2 z-10`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <button
        aria-label="Next slide"
        className="p-1.5 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out focus:outline-none"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
}

function PrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <div
      className={`${className} custom-slick-arrow-left left-1 md:left-2 z-10`}
      style={{ ...style, display: 'block' }}
      onClick={onClick}
    >
      <button
        aria-label="Previous slide"
        className="p-1.5 rounded-full bg-white/80 dark:bg-black/80 hover:bg-white dark:hover:bg-black text-gray-700 dark:text-gray-300 shadow-lg hover:shadow-xl transition-all duration-200 ease-in-out focus:outline-none"
      >
        <ChevronLeft size={32} />
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
    infinite: products.length > 3,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    responsive: [
      // {
      //   breakpoint: 1280,
      //   settings: {
      //     slidesToShow: products.length < 4 ? products.length : 4,
      //     slidesToScroll: products.length < 4 ? products.length : 4,
      //     infinite: products.length > (products.length < 4 ? products.length : 4),
      //     dots: true,
      //   },
      // },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: products.length < 3 ? products.length : 3,
          slidesToScroll: products.length < 3 ? products.length : 3,
          infinite: products.length > (products.length < 3 ? products.length : 3),
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: products.length < 2 ? products.length : 2,
          slidesToScroll: products.length < 2 ? products.length : 2,
          infinite: products.length > (products.length < 2 ? products.length : 2),
          dots: true,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: products.length > 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <div className="py-8 slick-slider-container">
      <style jsx global>{`
          .slick-prev::before,
          .slick-next::before {
            display: none !important;
          }
        .slick-prev {
          z-index: 220;
          left: -50px !important;
        }
        @media (max-width: 1380px) {
          .slick-prev {
            display: block !important;
            left: 0px !important;
          }
          .slick-next {
            display: block !important;
            right: 20px !important;
          }
        }
      `}</style>
      {title && (
        <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-white mb-6 md:mb-8 text-center md:text-left px-4">
          {title}
        </h2>
      )}
      <div className="mx-auto max-w-7xl px-0 md:px-4">
        <Slider {...settings}>
          {products.map(product => (
            <div key={product._id} className="px-1.5 md:px-2 outline-none">
              <ProductCard product={product} viewMode="grid" />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}
