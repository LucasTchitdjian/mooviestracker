import './MovieSwiper.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/effect-coverflow';
import 'swiper/css/pagination';
import { Autoplay } from 'swiper/modules';

export function MovieSwiper({ slides, onSlideChange }) {
    return (
        <Swiper
            autoplay={{
                delay: 5000,
                disableOnInteraction: false
            }}
            loop={true}
            modules={[Autoplay]}
            className='movieSwiper'
            onSlideChange={onSlideChange}
        >
            {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                    <img
                        src={`https://image.tmdb.org/t/p/original${slide.backdrop_path}`}
                        alt={slide.title || slide.name}
                    />
                </SwiperSlide>
            ))}
        </Swiper>
    );
}
