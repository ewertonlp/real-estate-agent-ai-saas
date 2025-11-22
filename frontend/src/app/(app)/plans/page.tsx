"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getSubscriptionPlans,
  createStripeCheckoutSession,
  SubscriptionPlan,
} from "@/lib/api";
import Image from "next/image";
import { toast } from "react-toastify";
import { FaCheckCircle, FaLock } from "react-icons/fa";
import { planFeatures } from "@/data/subscriptionPlans";

export default function PlansPage() {
  const [allPlans, setAllPlans] = useState<SubscriptionPlan[]>([]);
  const [displayedPlans, setDisplayedPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<"month" | "year">(
    "month"
  );
  const [currentLoadingPriceId, setCurrentLoadingPriceId] = useState<
    string | null
  >(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCheckoutLoading, setIsCheckoutLoading] = useState<boolean>(false);

  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      const fetchPlans = async () => {
        try {
          const fetchedPlans = await getSubscriptionPlans();
          const upgradeablePlans = fetchedPlans.filter(
            (p) =>
              p.unit_amount !== null && p.interval !== null && p.name !== "Free"
          );

          setAllPlans(
            upgradeablePlans.sort((a, b) => {
              if (a.max_generations === b.max_generations) {
                if (a.interval === "month" && b.interval === "year") return -1;
                if (a.interval === "year" && b.interval === "month") return 1;
                return 0;
              }
              return a.max_generations - b.max_generations;
            })
          );
        } catch (err: any) {
          setError(err.message || "Erro ao carregar planos.");
          toast.error(err.message || "Erro ao carregar planos de assinatura.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchPlans();
    }
  }, [isAuthenticated, isAuthLoading, router]);

  useEffect(() => {
    const filtered = allPlans.filter(
      (plan) => plan.interval === selectedPeriod
    );

    const customOrder = ["Basic", "Premium", "Unlimited"];

    const sortedPlans = filtered.sort((a, b) => {
      const orderA = customOrder.indexOf(a.name);
      const orderB = customOrder.indexOf(b.name);

      if (orderA !== -1 && orderB !== -1) {
        return orderA - orderB;
      }
      return a.max_generations - b.max_generations;
    });

    setDisplayedPlans(sortedPlans);
  }, [allPlans, selectedPeriod]);

  const handleSubscribe = async (priceId: string) => {
    if (priceId === "price_free_plan") {
      toast.warning(
        "Você já está no plano Grátis ou pode se registrar para começar gratuitamente.",
        { icon: "👋" }
      );
      return;
    }

    setIsCheckoutLoading(true);
    setCurrentLoadingPriceId(priceId);
    try {
      const { checkout_url } = await createStripeCheckoutSession(priceId);
      window.location.href = checkout_url;
    } catch (err: any) {
      toast.error(
        err.message || "Erro ao iniciar o pagamento. Tente novamente."
      );
      setError(err.message || "Falha ao criar sessão de checkout.");
    } finally {
      setIsCheckoutLoading(false);
      setCurrentLoadingPriceId(null);
    }
  };

  const formatPrice = (amount: number, currency: string) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
    }).format(amount / 100);
  };

  if (isAuthLoading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-text">Carregando planos...</p>{" "}
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{error}</p>{" "}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-card rounded-lg py-12 px-4 sm:px-6 lg:px-8 max-w-9xl mx-auto">
      <h1 className="text-3xl font-semibold text-text text-center mb-6">
        Escolha o Plano Ideal para Você
      </h1>
      <p className="text-xl text-text text-center mb-12">
        Desbloqueie o potencial máximo do seu negócio imobiliário com o plano
        perfeito para você.
      </p>

      <div className="flex justify-center mb-10">
        <button
          onClick={() => setSelectedPeriod("year")}
          className={`py-2 px-6 rounded-bl-lg rounded-tl-lg font-semibold text-lg transition-colors ${
            selectedPeriod === "year"
              ? "bg-button text-white"
              : "bg-background text-text hover:bg-button/50"
          } `}
        >
          Anual
        </button>
        <button
          onClick={() => setSelectedPeriod("month")}
          className={`py-2 px-6 rounded-tr-lg rounded-br-lg font-semibold text-lg transition-colors
                ${
                  selectedPeriod === "month"
                    ? "bg-button text-white"
                    : "bg-background text-text hover:bg-button/50"
                } `}
        >
          Mensal
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayedPlans.map((plan) => (
          <div
            key={plan.id}
            className="bg-background rounded-lg shadow-md p-8 flex flex-col justify-between border hover:border-hover transition-all duration-300"
          >
            <div className="text-center">
              <h2 className="text-3xl font-semibold text-text mb-4">
                {plan.name}
              </h2>
              <p className="text-text text-center mb-6">{plan.description}</p>{" "}
              <div className="text-4xl text-center font-semibold text-button mb-6">
                {plan.unit_amount !== null && plan.currency
                  ? formatPrice(plan.unit_amount, plan.currency)
                  : plan.max_generations === 0
                  ? "Grátis"
                  : `R$ ${plan.max_generations},00`}{" "}
                <span className="text-xl font-medium">
                  /{plan.interval === "month" ? "mês" : "ano"}
                </span>
              </div>
              <ul className="text-text text-left space-y-2 mb-8">
                {planFeatures[plan.name]?.[plan.interval]?.map(
                  (feature, index) => (
                    <li key={index} className="flex items-center">
                      <FaCheckCircle className="text-green-500 mr-2 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  )
                )}
              </ul>
            </div>{" "}
            <button
              onClick={() => handleSubscribe(plan.price_id_stripe)}
              className={`w-full py-3 px-2 rounded-md font-semibold text-lg hover:bg-primary transition duration-300 ${
                plan.name === "Free"
                  ? "bg-gray-400 text-white cursor-not-allowed"
                  : "bg-button text-white hover:bg-hover"
              }`}
              disabled={plan.name === "Free" || isCheckoutLoading}
            >
              {" "}
              {isCheckoutLoading &&
              plan.price_id_stripe === currentLoadingPriceId ? (
                <svg
                  className="animate-spin h-5 w-5 mr-3 text-white inline-block"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  {" "}
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>{" "}
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>{" "}
                </svg>
              ) : null}
              {plan.name === "Free" ? "Plano Atual" : "Escolher Plano"}{" "}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center text-text text-sm space-y-4">
        <div className="flex items-center justify-center gap-2">
          <FaLock className="text-primary" />
          <span>Pagamento 100% seguro via Stripe.</span>
        </div>
        <p>
          Seus dados de pagamento são criptografados e processados diretamente
          pelo Stripe, garantindo a máxima segurança. Nenhuma informação
          sensível é armazenada em nossos servidores.
        </p>

        <div className="flex justify-center gap-4 mt-4 text-3xl">
          <Image
            src="/stripe-payments.png"
            alt="Stripe logo"
            width={150}
            height={50}
          />
        </div>

        <p className="mt-4">
          Assinaturas são recorrentes e podem ser canceladas a qualquer momento.
        </p>
      </div>
    </div>
  );
}
