'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Wrench, UserCircle } from 'lucide-react';
import { useGetUserByIdQuery } from '@/app/redux/services/userApi';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '@/app/redux/slice/userSlice';
import { IUser } from '@/types/user';

interface UserState {
  user: IUser | null;
  isAuthenticated: boolean;
  loading: boolean;
}

interface RootState {
  user: UserState;
}

export default function TopMenu() {
  const dispatch = useDispatch();
  // Acceder correctamente al estado
  const { user, loading } = useSelector((state: RootState) => state.user);

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLogged, setIsLogged] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const navItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Ofertas de trabajo', href: '/job-offer-list' },
    { name: 'Ayuda', href: '/ask-for-help/centro_de_ayuda' },
  ];

  // Obtener userId desde localStorage
  useEffect(() => {
    const token = localStorage.getItem('servineo_user');
    if (token) {
      const userData = JSON.parse(token);
      setUserId(userData._id);
    }
  }, []);

  // Consultar user por ID
  const { data: userData } = useGetUserByIdQuery(userId!, {
    skip: !userId,
  });

  // Guardar user en redux
  useEffect(() => {
    if (userData) dispatch(setUser(userData));
  }, [userData, dispatch]);

  // Detectar scroll y login
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);

    const token = localStorage.getItem('servineo_token');
    setIsLogged(!!token);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Click fuera del dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setAccountOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Determinar qué botón mostrar según el rol
  const getRoleButton = () => {
    // Si está cargando, mostrar skeleton o nada
    if (loading || !user) return null;

    if (!user.role) return null;

    if (user.role === 'requester') {
      return (
        <Link
          href="/become-fixer"
          className="flex items-center gap-2  px-4 py-2 rounded-md text-sm font-medium text-primary transition-colors"
        >
          <Wrench className="h-4 w-4" />
          Convertir a Fixer
        </Link>
      );
    }

    if (user.role === 'fixer') {
      return (
        <Link
          href="/fixer/dashboard"
          className="flex items-center gap-2  text-white px-4 py-2 rounded-md text-sm font-medium bg-primary transition-colors"
        >
          <UserCircle className="h-4 w-4" />
          Perfil de Fixer
        </Link>
      );
    }

    return null;
  };

  const getRoleButtonMobile = () => {
    // Si está cargando, mostrar skeleton o nada
    if (loading || !user) return null;

    if (!user.role) return null;

    if (user.role === 'requester') {
      return (
        <Link
          href="/become-fixer"
          className="flex items-center justify-center gap-2 w-full bg-green-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-green-700 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <Wrench className="h-4 w-4" />
          Convertir a Fixer
        </Link>
      );
    }

    if (user.role === 'fixer') {
      return (
        <Link
          href="/fixer/dashboard"
          className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700 transition-colors"
          onClick={() => setIsOpen(false)}
        >
          <UserCircle className="h-4 w-4" />
          Perfil de Fixer
        </Link>
      );
    }

    return null;
  };

  return (
    <>
      <header
        className={`fixed w-full z-50 transition-all duration-300 ${
          scrolled ? 'bg-white shadow-md' : 'bg-white/95 backdrop-blur-sm'
        } border-t-[1.5px] border-b-[1.5px] border-primary`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo */}
            <Link href="/" className="text-primary font-bold text-xl">
              SERVINEO
            </Link>

            {/* Desktop Menu */}
            <nav className="hidden md:flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-primary px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.name}
                </Link>
              ))}
            </nav>

            {/* Desktop Right */}
            <div className="hidden md:flex items-center space-x-4">
              {!isLogged ? (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors"
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/signUp"
                    className="bg-primary text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90 transition-colors"
                  >
                    Regístrate
                  </Link>
                </>
              ) : (
                <>
                  {/* Botón según rol del usuario */}
                  {getRoleButton()}

                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setAccountOpen(!accountOpen)}
                      className="text-gray-700 hover:text-primary px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Mi cuenta
                    </button>
                    {accountOpen && (
                      <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg border border-gray-200 rounded-md py-2 z-50">
                        <Link
                          href="/requesterEdit"
                          className="block px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          Editar perfil
                        </Link>
                        <button
                          onClick={() => {
                            localStorage.removeItem('servineo_token');
                            localStorage.removeItem('servineo_user');
                            window.location.reload();
                          }}
                          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50"
                        >
                          Cerrar sesión
                        </button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Mobile Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-primary hover:bg-gray-100 transition-colors"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden ${
            isOpen ? 'block' : 'hidden'
          } bg-white/95 backdrop-blur-sm border-t border-gray-200`}
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                {item.name}
              </Link>
            ))}

            <div className="pt-4 pb-2 border-t border-gray-200 px-2 space-y-2">
              {!isLogged ? (
                <>
                  <Link
                    href="/login"
                    className="block w-full text-center text-primary px-4 py-2 rounded-md text-base font-medium hover:bg-gray-50"
                    onClick={() => setIsOpen(false)}
                  >
                    Iniciar Sesión
                  </Link>
                  <Link
                    href="/signUp"
                    className="block w-full text-center text-white bg-primary px-4 py-2 rounded-md text-base font-medium hover:bg-primary/90"
                    onClick={() => setIsOpen(false)}
                  >
                    Regístrate
                  </Link>
                </>
              ) : (
                <>
                  {/* Botón según rol - Mobile */}
                  {getRoleButtonMobile()}

                  <Link
                    href="/app/profile"
                    className="block px-4 py-2 text-primary hover:bg-gray-50 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Mi cuenta
                  </Link>
                  <Link
                    href="/requesterEdit"
                    className="block px-4 py-2 text-gray-700 hover:bg-gray-50 rounded-md"
                    onClick={() => setIsOpen(false)}
                  >
                    Editar perfil
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.removeItem('servineo_token');
                      localStorage.removeItem('servineo_user');
                      window.location.reload();
                    }}
                    className="block w-full text-left text-red-600 px-4 py-2 rounded-md text-base font-medium hover:bg-red-50"
                  >
                    Cerrar sesión
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Spacer */}
      <div className="h-16" />
    </>
  );
}
