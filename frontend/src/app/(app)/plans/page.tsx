// frontend/src/app/(app)/plans/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getSubscriptionPlans, createStripeCheckoutSession, SubscriptionPlan } from '@/lib/api';
import toast from 'react-hot-toast';
import { FaCheckCircle } from 'react-icons/fa'; // Ícone de "check"

export default function PlansPage() {
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }

    if (isAuthenticated) {
      const fetchPlans = async () => {
        try {
          const fetchedPlans = await getSubscriptionPlans();
          setPlans(fetchedPlans.sort((a, b) => a.max_generations - b.max_generations)); // Ordena por gerações (Free, Basic, Premium)
        } catch (err: any) {
          setError(err.message || 'Erro ao carregar planos.');
          toast.error(err.message || 'Erro ao carregar planos de assinatura.');
        } finally {
          setIsLoading(false);
        }
      };
      fetchPlans();
    }
  }, [isAuthenticated, isAuthLoading, router]);

  const handleSubscribe = async (priceId: string) => {
    setIsCheckoutLoading(true);
    try {
      const { checkout_url } = await createStripeCheckoutSession(priceId);
      window.location.href = checkout_url; // Redireciona o usuário para o Stripe Checkout
    } catch (err: any) {
      toast.error(err.message || 'Erro ao iniciar o pagamento. Tente novamente.');
      setError(err.message || 'Falha ao criar sessão de checkout.');
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-700">Carregando planos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-100 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Escolha o Plano Ideal para Você</h1>
        <p className="text-xl text-gray-600 mb-12">
          Selecione o plano que melhor se adapta às suas necessidades e comece a gerar conteúdo ilimitado!
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className="bg-white rounded-lg shadow-xl p-8 flex flex-col justify-between border-2 border-gray-200 hover:border-blue-500 transition duration-300"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-4">{plan.name}</h2>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="text-4xl font-extrabold text-blue-600 mb-6">
                  {plan.max_generations === 0 ? 'Ilimitado' : `${plan.max_generations}`}
                  {plan.max_generations !== 0 && <span className="text-xl font-medium"> Gerações/Mês</span>}
                </div>
                
                <ul className="text-gray-700 text-left space-y-2 mb-8">
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Acesso ao Histórico</li>
                  <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Otimização para Redes Sociais</li>
                  {plan.name !== 'Free' && (
                    <>
                      <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Otimização para SEO & GMB</li>
                      <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Suporte Premium</li>
                    </>
                  )}
                  {plan.name === 'Premium' && (
                    <li className="flex items-center"><FaCheckCircle className="text-green-500 mr-2" /> Novos Recursos Exclusivos</li>
                  )}
                </ul>
              </div>
              <button
                onClick={() => handleSubscribe(plan.price_id_stripe)}
                className={`w-full py-3 px-6 rounded-md font-semibold text-lg transition duration-300
                  ${plan.name === 'Free'
                    ? 'bg-gray-400 text-white cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                  }
                `}
                disabled={plan.name === 'Free' || isCheckoutLoading} // Desabilita botão do Free e durante o checkout
              >
                {isCheckoutLoading && plan.price_id_stripe === plans.find(p => p.price_id_stripe === priceId)?.price_id_stripe ? ( // Verifica qual botão está carregando
                  <svg className="animate-spin h-5 w-5 mr-3 text-white inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : null}
                {plan.name === 'Free' ? 'Plano Atual' : 'Escolher Plano'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}