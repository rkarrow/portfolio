import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

function HeroSection() {
  const [slides] = useState([
    {
      id: 1,
      title: 'Creative Design',
      image: '/images/slide1.jpg',
      description: 'Stunning visual designs'
    },
    {
      id: 2,
      title: 'Web Development',
      image: '/images/slide2.jpg',
      description: 'Modern web solutions'
    },
    {
      id: 3,
      title: 'UI/UX Design',
      image: '/images/slide3.jpg',
      description: 'User-centered experiences'
    },
    {
      id: 4,
      title: 'Mobile Apps',
      image: '/images/slide4.jpg',
      description: 'Powerful mobile solutions'
    },
  ]);

  return (
    <section id="home" className="relative min-h-screen bg-gradient-to-br from-gray-900 via-primary-900 to-gray-900 flex items-center justify-center overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 -left-40 w-80 h-80 bg-primary-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto w-full px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8 text-white">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/30 rounded-full">
                <span className="text-primary-300 text-sm font-semibold">Welcome to my portfolio</span>
              </div>

              <h1 className="text-6xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary-400 via-yellow-400 to-red-400 leading-tight">
                Rashmika Kavindu
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 font-light">
                Software Engineering Undergraduate & Professional Graphic Designer
              </p>
            </div>

            <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
              Transforming ideas into stunning visual designs and scalable technical solutions. 8+ months of professional industry experience blending creativity with cutting-edge technology.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a
                href="#projects"
                className="group relative px-8 py-4 bg-gradient-to-r from-primary-500 to-primary-700 text-white rounded-xl font-bold text-lg overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <span className="relative z-10 flex items-center gap-2">
                  View My Work
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
              </a>
              <a
                href="#contact"
                className="px-8 py-4 border-2 border-primary-400 text-primary-400 rounded-xl font-bold text-lg hover:bg-primary-400/10 transition-all duration-300 transform hover:-translate-y-1"
              >
                Get In Touch
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 pt-4">
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 bg-white/10 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 bg-white/10 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v 3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
              </a>
              <a href="https://dribbble.com" target="_blank" rel="noopener noreferrer" className="group w-12 h-12 bg-white/10 hover:bg-primary-500 rounded-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/>
                  <path d="M8.56 2.75c3.611 6.817 7.21 13.634 7.21 13.634M3.75 2.75c2.211 3.901 5.364 8.745 7.21 13.634M12 17.25c-5.175-6.817-7.21-13.634-7.21-13.634" stroke="currentColor" strokeWidth="2" fill="none"/>
                </svg>
              </a>
            </div>
          </div>

          {/* Right Slider */}
          <div className="relative">
            <Swiper
              modules={[Autoplay, Pagination, Navigation]}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
              }}
              pagination={{
                clickable: true,
                dynamicBullets: true,
                bulletActiveClass: 'swiper-pagination-bullet-active',
              }}
              navigation={true}
              loop={true}
              className="w-full h-96 md:h-[500px] rounded-2xl overflow-hidden shadow-2xl group"
            >
              {slides.map((slide) => (
                <SwiperSlide key={slide.id}>
                  <div className="relative w-full h-full group/slide">
                    <img
                      src={slide.image}
                      alt={slide.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"%3E%3Crect fill="%23333" width="1200" height="600"/%3E%3Ctext x="50%25" y="50%25" font-size="48" fill="%23666" text-anchor="middle" dy=".3em"%3EAdd your image%3C/text%3E%3C/svg%3E';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent opacity-60 group-hover/slide:opacity-40 transition-opacity duration-300"></div>
                    <div className="absolute bottom-0 left-0 right-0 p-8 text-white z-10">
                      <h3 className="text-4xl font-bold mb-2">{slide.title}</h3>
                      <p className="text-gray-200 text-lg">{slide.description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Decorative elements */}
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary-500/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl"></div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce text-white/50">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </div>

      <style>{`
        .swiper-button-next,
        .swiper-button-prev {
          background: rgba(255, 255, 255, 0.2);
          border-radius: 50%;
          width: 50px;
          height: 50px;
          border: 2px solid rgba(255, 255, 255, 0.3);
          transition: all 0.3s ease;
        }

        .swiper-button-next:hover,
        .swiper-button-prev:hover {
          background: rgba(102, 126, 234, 0.8);
          border-color: rgba(102, 126, 234, 1);
        }

        .swiper-button-next::after,
        .swiper-button-prev::after {
          font-size: 20px;
          color: white;
        }

        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.3);
          opacity: 1;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          transition: all 0.3s ease;
        }

        .swiper-pagination-bullet-active {
          background: #667eea;
          width: 32px;
          border-radius: 6px;
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
}

export default HeroSection;

