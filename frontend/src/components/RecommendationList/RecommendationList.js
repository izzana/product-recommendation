import React from 'react';

function RecommendationList({ recommendations, setShowRecommendationsList }) {
  return (
    <aside className="md:col-span-5">
      <div className="card sticky top-6 p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Lista de Recomendações</h2>
          <span className="text-sm text-gray-500" aria-live="polite">
            {recommendations.length} itens
          </span>
        </div>
      </div>
      <div className="h-[70vh] flex flex-col justify-between">
        {recommendations.length === 0 ? (
          <div className="empty-state">Nenhuma recomendação encontrada.</div>
        ) : (
          <ul className="mt-4 space-y-3">
            {recommendations.map((recommendation, index) => (
              <div className="flex items-center justify-between gap-3">
                <li
                  key={index}
                  className="text-sm px-2 py-1 rounded-full font-semibold bg-gray-100 text-gray-600"
                >
                  {recommendation.name}
                </li>
              </div>
            ))}
          </ul>
        )}
        <div className="flex justify-start">
          <button
            type="button"
            className="mt-4 btn-ghost"
            onClick={() => setShowRecommendationsList(false)}
          >
            Voltar
          </button>
        </div>
      </div>
    </aside>
  );
}

export default RecommendationList;
