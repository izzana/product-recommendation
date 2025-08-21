// services/recommendation.service.js

/**
 * @typedef {Object} Product
 * @property {number} id
 * @property {string} name
 * @property {string} category
 * @property {string[]} preferences
 * @property {string[]} features
 */

/**
 * @typedef {Object} FormData
 * @property {string[]} selectedPreferences
 * @property {string[]} selectedFeatures
 * @property {'SingleProduct' | 'MultipleProducts' | string} selectedRecommendationType
 */

/**
 * Calcula a pontuação de um produto com base nas preferências e funcionalidades selecionadas.
 * @param {Product} product
 * @param {string[]} selectedPreferences
 * @param {string[]} selectedFeatures
 * @returns {number}
 */
export function calculateScore(product, selectedPreferences = [], selectedFeatures = []) {
  if (!product) return 0;

  const preferenceMatches = (product.preferences ?? []).filter((preference) =>
    selectedPreferences.includes(preference)
  ).length;

  const featureMatches = (product.features ?? []).filter((feature) =>
    selectedFeatures.includes(feature)
  ).length;

  return preferenceMatches + featureMatches;
}

/**
 * Normaliza o tipo de recomendação.
 * @param {string} rawType
 * @returns {'SingleProduct' | 'MultipleProducts'}
 */
function normalizeRecommendationType(rawType) {
  return String(rawType).toLowerCase() === 'singleproduct'
    ? 'SingleProduct'
    : 'MultipleProducts';
}

/**
 * Retorna recomendações de produtos conforme as regras do desafio.
 * - MultipleProducts: todos com score > 0.
 * - SingleProduct: apenas 1 com maior score; em empate, o último.
 * - Se nada selecionado: Multiple → todos | Single → último.
 *
 * @param {FormData} formData
 * @param {Product[]} products
 * @returns {Product[]}
 */
function getRecommendations(formData, products = []) {
  const {
    selectedPreferences = [],
    selectedFeatures = [],
    selectedRecommendationType = 'MultipleProducts',
  } = formData ?? {};
  console.log('formData', formData);

  if (!Array.isArray(products) || products.length === 0) return [];

  const normalizedType = normalizeRecommendationType(selectedRecommendationType);
  const noFiltersSelected =
    (selectedPreferences?.length ?? 0) === 0 && (selectedFeatures?.length ?? 0) === 0;

  // Sem filtros
  if (noFiltersSelected) {
    if (normalizedType === 'SingleProduct') {
      const lastProduct = products[products.length - 1];
      return lastProduct ? [lastProduct] : [];
    }
    return products;
  }

  if (normalizedType === 'SingleProduct') {
    let bestProduct = null;
    let highestScore = -1;

    for (const product of products) {
      const currentScore = calculateScore(product, selectedPreferences, selectedFeatures);

      // Em caso de empate escolhe o último
      if (currentScore >= highestScore) {
        highestScore = currentScore;
        bestProduct = product;
      }
    }

    return highestScore > 0 && bestProduct ? [bestProduct] : [];
  }

  return products.filter(
    (product) => calculateScore(product, selectedPreferences, selectedFeatures) > 0
  );
}

export default { getRecommendations };
