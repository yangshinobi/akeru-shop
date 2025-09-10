import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs } from 'swiper';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';

export default function ProductGallery({imageUrls}) {
  const [thumbsSwiper, setThumbsSwiper] = useState(null);

  return (
    <div className='galleryContainer max-w-2xl mx-auto p-4 bg-white rounded-lg' >
      <Swiper 
        spaceBetween={10}
        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
        modules={[FreeMode, Navigation, Thumbs]}
                className="mainSwiper overflow-hidden [&_.swiper-button-next]:text-amber-400 [&_.swiper-button-prev]:text-amber-400 [&_.swiper-button-next]:bg-white/75 [&_.swiper-button-prev]:bg-white/75"
        navigation={true}
        observer={true} // Enable observer
        observeParents={true} // Enable observeParents
        parallax={true} 
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index} className="aspect-w-1 aspect-h-1">
            {url.toLowerCase().endsWith('.mp4') ? (
              <video
                src={url}
                controls
                className="w-full h-full object-contain hover:opacity-90 transition-opacity duration-300"
              />
            ) : (
              <img 
                src={url} 
                alt={`Product view ${index + 1}`}
                className="w-full h-full object-contain hover:opacity-90 transition-opacity duration-300"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <Swiper
        onSwiper={setThumbsSwiper}
        spaceBetween={10}
        slidesPerView={4}
        freeMode={true}
        watchSlidesProgress={true}
        modules={[FreeMode, Navigation, Thumbs]}
        className="thumbsSwiper mt-4"
        loading="lazy"
      >
        {imageUrls.map((url, index) => (
          <SwiperSlide key={index} className="opacity-75 hover:opacity-100 transition-opacity duration-200">
            {url.toLowerCase().endsWith('.mp4') ? (
              <video
                src={url}
                className="w-full h-full object-cover cursor-pointer rounded-md border-2 border-transparent hover:border-amber-400"
              />
            ) : (
              <img 
                src={url} 
                alt={`Product thumbnail ${index + 1}`} 
                className="w-full h-full object-cover cursor-pointer rounded-md border-2 border-transparent hover:border-amber-400"
              />
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
