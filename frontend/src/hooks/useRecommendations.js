// useRecommendations.js

import recommendationService from '../services/recommendation.service';

function useRecommendations(products) {
  const getRecommendations = (formData) => {
    const result = recommendationService.getRecommendations(formData, products);

    return result;
  };

  return { getRecommendations };
}

export default useRecommendations;
