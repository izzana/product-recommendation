import React, { useState } from 'react';
import Form from './components/Form/Form';
import RecommendationList from './components/RecommendationList/RecommendationList';

function App() {
  const [recommendations, setRecommendations ] = useState([])
  const [showRecommendationsList, setShowRecommendationsList] = useState(false);

  /**
   * Dadas atualizações no formulário, necessário atualizar a lista de recomendações
   */

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center">
      <header className="mb-4 mt-4 text-center">
        <h1 className="text-3xl font-bold">
          Recomendador de Produtos RD Station
        </h1>
      </header>
      <div className="bg-white p-8 rounded-lg shadow-md w-full md:w-3/4 lg:w-1/2 gap-8 mb-8">
        {!showRecommendationsList ? (
          <>
            <div className="col-span-2 mb-4">
              <p className="text-base">
                Bem-vindo ao Recomendador de Produtos RD Station. Aqui você pode
                encontrar uma variedade de produtos da RD Station, cada um
                projetado para atender às necessidades específicas do seu
                negócio. De CRM a Marketing, de Conversas a Inteligência
                Artificial, temos uma solução para ajudar você a alcançar seus
                objetivos. Use o formulário abaixo para selecionar suas
                preferências e funcionalidades desejadas e receba recomendações
                personalizadas de produtos que melhor atendam às suas
                necessidades.
              </p>
            </div>
            <div>
              <Form
                onRecommendationsUpdate={setRecommendations}
                setShowRecommendationsList={setShowRecommendationsList}
              />
            </div>
          </>
        ) : (
          <div className="h-[80vh]">
            <RecommendationList
              recommendations={recommendations}
              setShowRecommendationsList={setShowRecommendationsList}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
