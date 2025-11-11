'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleJobOffersClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    // Si ya estamos en la página de jobOfert, forzar recarga
    if (pathname === '/jobOfert') {
      // Limpiar localStorage para resetear el estado
      localStorage.removeItem('jobOffers_paginaActual');
      localStorage.removeItem('jobOffers_registrosPorPagina');
      localStorage.removeItem('jobOffers_search');
      localStorage.removeItem('jobOffers_filters');
      localStorage.removeItem('jobOffers_sortBy');

      // Navegar con recarga completa
      window.location.href = '/jobOfert?sort=recent&page=1&limit=10';
    } else {
      // Si venimos de otra página, navegar normalmente
      router.push('/jobOfert?sort=recent&page=1&limit=10');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-95 shadow-lg backdrop-blur-md transition-all duration-300 border-b border-gray-100">
      {/* Desktop Header (solo desde lg en adelante) */}
      <div className="hidden lg:flex items-center justify-between px-6 py-3 max-w-7xl mx-auto">
        <div className="flex items-center">
          <Link
            href="/"
            onClick={scrollToTop}
            className="flex items-center gap-2 group transition-transform duration-300 hover:scale-105"
          >
            <div className="relative overflow-hidden rounded-full shadow-md">
              <Image
                src="/icon.png"
                alt="Servineo Logo"
                width={45}
                height={45}
                className="transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <span className="text-2xl font-bold text-[#2B6AE0]">Servineo</span>
          </Link>
        </div>
        <nav className="hidden lg:flex gap-6">
          <Link
            href="/servicios"
            className="text-gray-700 hover:text-[#2B6AE0]/90 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#2B6AE0] after:transition-all hover:after:w-full"
          >
            Servicios
          </Link>
          <Link
            href="/jobOfert?sort=recent&page=1&limit=10"
            onClick={handleJobOffersClick}
            className="text-[#2B6AE0] hover:text-[#2B6AE0]/90 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-[#2B6AE0] after:transition-all"
          >
            Ofertas de trabajo
          </Link>
          <Link
            href="/ayuda"
            className="text-gray-700 hover:text-[#2B6AE0]/90 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#2B6AE0] after:transition-all hover:after:w-full"
          >
            Ayuda
          </Link>
           <Link
            href="/users"
            className="text-gray-700 hover:text-[#2B6AE0]/90 font-medium relative after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:bg-[#2B6AE0] after:transition-all hover:after:w-full"
          >
            Usuarios
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/login">
            <button className="w-auto px-4 sm:px-6 py-2 sm:py-2 text-sm sm:text-base font-semibold rounded text-gray-700 hover:bg-gray-100 shadow transition-all duration-200">
              Iniciar sesión
            </button>
          </Link>
          <Link href="/registro">
            <button className="bg-[#2B6AE0] text-white hover:bg-[#2B6AE0]/90 w-auto px-4 sm:px-6 py-2 sm:py-2 text-sm sm:text-base font-semibold rounded shadow transition-all duration-200">
              Registrarse
            </button>
          </Link>
        </div>
      </div>

      {/* Mobile/Tablet Header (hasta lg) */}
      <div className="lg:hidden flex items-center justify-between p-4">
        <Link href="/" onClick={scrollToTop} className="flex items-center gap-2 group">
          <div className="relative overflow-hidden rounded-full shadow-md">
            <Image
              src="/icon.png"
              alt="Servineo Logo"
              width={36}
              height={36}
              className="transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span className="text-xl font-bold text-[#2B6AE0]">Servineo</span>
        </Link>
        <div className="flex items-center gap-2">
          <Link href="/login">
            <button className="w-auto px-4 sm:px-6 py-2 sm:py-2 text-sm sm:text-base font-semibold rounded text-gray-700 hover:bg-gray-100 shadow transition-all duration-200">
              Iniciar
            </button>
          </Link>
          <Link href="/registro">
            <button className="bg-[#2B6AE0] text-white hover:bg-[#2B6AE0]/90 w-auto px-4 sm:px-6 py-2 sm:py-2 text-sm sm:text-base font-semibold rounded shadow transition-all duration-200 whitespace-nowrap">
              Registrarse
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
