"use client";

import { FaCheck, FaStar } from "react-icons/fa";
import { SubscriptionPlan } from "@/lib/api";
import { Button } from "./ui/button";

type PricingCardProps = {
  plan: SubscriptionPlan;
  features: string[];
  isLoading: boolean;
  isCurrentLoading: boolean;
  onSubscribe: (priceId: string) => void;
  formatPrice: (amount: number, currency: string) => string;
};

export default function PricingCard({
  plan,
  features,
  isLoading,
  isCurrentLoading,
  onSubscribe,
  formatPrice,
}: PricingCardProps) {
  // 🎨 Tema por plano
  const theme = {
    Basic: {
      gradient: "from-orange-400 via-orange-500 to-orange-700",
      button: "bg-orange-500 hover:bg-orange-600",
      glow: "bg-orange-200/70",
    },
    Premium: {
      gradient: "from-indigo-400 via-indigo-500 to-indigo-800",
      button: "bg-indigo-500 hover:bg-indigo-600",
      glow: "bg-indigo-200/70",
      badge: true,
    },
    Unlimited: {
      gradient: "from-teal-400 via-teal-500 to-teal-800",
      button: "bg-teal-500 hover:bg-teal-600",
      glow: "bg-teal-200/70",
    },
  }[plan.name] || {
    gradient: "from-gray-400 to-gray-600",
    button: "bg-gray-500",
    glow: "bg-white/50",
  };

  return (
    <div className="relative group">
      {/* ⭐ Badge Mais Popular */}
      {theme.badge && (
        <div className="absolute z-20 -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-sm font-semibold px-4 py-2 rounded-md flex items-center gap-2 shadow-md">
          <FaStar /> Mais popular
        </div>
      )}

      <div
        className={`
          bg-gradient-to-b ${theme.gradient}
          rounded-2xl shadow-xl p-8 mb-8 flex flex-col justify-between
          transform transition-all duration-300
          hover:scale-105 hover:shadow-2xl
        `}
      >
        {/* Conteúdo */}
        <div>
          <h2 className="text-2xl font-medium text-white mb-6">
            {plan.name}
          </h2>

          <p className="text-white/90 mb-6">{plan.description}</p>

          <div className="text-3xl font-bold text-white mb-6">
            {plan.unit_amount !== null && plan.currency
              ? formatPrice(plan.unit_amount, plan.currency)
              : plan.max_generations === 0
              ? "Grátis"
              : `R$ ${plan.max_generations},00`}
            <span className="text-lg font-medium">
              /{plan.interval === "month" ? "mês" : "ano"}
            </span>
          </div>

          {/* 🔥 Botão com blur/glow */}
          <div className="relative mb-8">
            {/* glow branco/da cor do plano */}
            <div
              className={`absolute inset-0 blur-xl rounded-xl ${theme.glow}`}
            ></div>

            <Button
              onClick={() => onSubscribe(plan.price_id_stripe)}
              disabled={plan.name === "Free" || isLoading}
              className={`
                relative w-full py-5 rounded-lg border border-white/50 font-semibold text-white
                transition duration-300
                ${theme.button}
              `}
            >
              {isLoading && isCurrentLoading
                ? "Processando..."
                : plan.name === "Free"
                ? "Plano Atual"
                : "Escolher Plano"}
            </Button>
          </div>

          {/* Features */}
          <div className="border-t border-white/20 pt-6">
            <ul className="text-white/90 text-sm space-y-2">
              {features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <FaCheck className="mr-2 text-white text-xs" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}