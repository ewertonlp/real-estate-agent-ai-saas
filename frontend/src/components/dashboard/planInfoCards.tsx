import React, { useState } from 'react'
import { Card } from '../ui/card'
import { useAuth } from '@/context/AuthContext';
import { CustomCard } from '../customCard';

function PlanInfoCards() {
  const [selectedCard, setSelectedCard] = useState<number | null>(0)
     const {
        isLoading,
        userPlanName,
        userGenerationsCount,
        userMaxGenerations,
  
      } = useAuth();

      const cards = [
        { title: "Seu plano atual", description: userPlanName },
        { title: "Conteúdos gerados", description: userGenerationsCount },
        { title: "Você ainda pode gerar", description: userMaxGenerations },
      ]

      
  return (
    <div className='grid grid-cols-1 md:grid-cols-3 gap-3 mb-6'>
      {cards.map((card, index) => (
        <div key={index} onClick={() => setSelectedCard(index)}>
          <CustomCard title={card.title} description={card.description} selected={selectedCard === index} />
        </div>
      ))}
    </div>
  )
}

export default PlanInfoCards
