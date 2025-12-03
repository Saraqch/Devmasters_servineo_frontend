'use client';

import { useEffect, useState } from 'react';
import FixerRegisterForm from '@/Components/fixer/Fixer-register-form';
import { FixerEnableWizard } from '@/Components/fixer/Filter-eneable-wizard';
import { useSelector } from 'react-redux';
import { RootState } from '@/app/redux/store';
import { IUser } from '@/types/user';
import { useRouter } from 'next/navigation';

export default function BecomeFixerPage() {
  const router = useRouter();
  const user = useSelector((state: RootState) => state.user.user);

  const [requester, setRequester] = useState<IUser | null>(null);

  useEffect(() => {
    if (user?.role === 'fixer') {
      router.push('/fixer/dashboard');
    }
  }, [user, router]);

  const defaultValues = {
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.telefono || '',
  };

  return (
    <div>
      <div className="container mx-auto max-w-4xl p-4">
        <header className="mb-6 text-center">
          <h1 className="text-2xl font-bold">Conviértete en un Fixer</h1>
          <p className="text-sm text-gray-500">
            Completa tu registro y habilita tu cuenta como FIXER
          </p>
        </header>

        <section className="space-y-6">
          {!requester ? (
            <div className="neon-border glass-panel rounded-2xl border border-gray-200 p-4 shadow-sm animate-slide-up">
              <h2 className="mb-3 text-center text-lg font-semibold">Datos iniciales</h2>

              <FixerRegisterForm
                defaultValues={defaultValues}
                onSubmit={(data) => {
                  const finalUser: IUser = {
                    _id: user?._id || '',
                    name: data.name || user?.name || '',
                    email: data.email || user?.email || '',
                    telefono: data.phone,
                    url_photo: user?.url_photo || 'https://picsum.photos/80',
                    role: user?.role || 'requester',
                  };

                  setRequester(finalUser);
                }}
                submitButtonText="Continuar"
              />
            </div>
          ) : (
            <div className="animate-fade-in">
              <FixerEnableWizard user={requester} />
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
