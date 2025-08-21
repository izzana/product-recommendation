// import recommendationService from './recommendation.service';
// import mockProducts from '../mocks/mockProducts';

// describe('recommendationService', () => {
//   test('Retorna recomendação correta para SingleProduct com base nas preferências selecionadas', () => {
//     const formData = {
//       selectedPreferences: ['Integração com chatbots'],
//       selectedFeatures: ['Chat ao vivo e mensagens automatizadas'],
//       selectedRecommendationType: 'SingleProduct',
//     };

//     const recommendations = recommendationService.getRecommendations(
//       formData,
//       mockProducts
//     );

//     expect(recommendations).toHaveLength(1);
//     expect(recommendations[0].name).toBe('RD Conversas');
//   });

//   test('Retorna recomendações corretas para MultipleProducts com base nas preferências selecionadas', () => {
//     const formData = {
//       selectedPreferences: [
//         'Integração fácil com ferramentas de e-mail',
//         'Personalização de funis de vendas',
//         'Automação de marketing',
//       ],
//       selectedFeatures: [
//         'Rastreamento de interações com clientes',
//         'Rastreamento de comportamento do usuário',
//       ],
//       selectedRecommendationType: 'MultipleProducts',
//     };

//     const recommendations = recommendationService.getRecommendations(
//       formData,
//       mockProducts
//     );

//     expect(recommendations).toHaveLength(2);
//     expect(recommendations.map((product) => product.name)).toEqual([
//       'RD Station CRM',
//       'RD Station Marketing',
//     ]);
//   });

//   test('Retorna apenas um produto para SingleProduct com mais de um produto de match', () => {
//     const formData = {
//       selectedPreferences: [
//         'Integração fácil com ferramentas de e-mail',
//         'Automação de marketing',
//       ],
//       selectedFeatures: [
//         'Rastreamento de interações com clientes',
//         'Rastreamento de comportamento do usuário',
//       ],
//       selectedRecommendationType: 'SingleProduct',
//     };

//     const recommendations = recommendationService.getRecommendations(
//       formData,
//       mockProducts
//     );

//     expect(recommendations).toHaveLength(1);
//     expect(recommendations[0].name).toBe('RD Station Marketing');
//   });

//   test('Retorna o último match em caso de empate para SingleProduct', () => {
//     const formData = {
//       selectedPreferences: ['Automação de marketing', 'Integração com chatbots'],
//       selectedRecommendationType: 'SingleProduct',
//     };

//     const recommendations = recommendationService.getRecommendations(
//       formData,
//       mockProducts
//     );

//     expect(recommendations).toHaveLength(1);
//     expect(recommendations[0].name).toBe('RD Conversas');
//   });
// });

// recommendation.service.test.js
import recommendationService from './recommendation.service';
import mockProducts from '../mocks/mockProducts';

/** Helpers */
const buildFormData = (overrides = {}) => ({
  selectedPreferences: [],
  selectedFeatures: [],
  selectedRecommendationType: 'MultipleProducts',
  ...overrides,
});

const productNames = (list) => list.map((product) => product.name);

describe('recommendationService', () => {
  describe('SingleProduct', () => {
    test('retorna um único produto com melhor pontuação (match por preferências e features)', () => {
      const formData = buildFormData({
        selectedPreferences: ['Integração com chatbots'],
        selectedFeatures: ['Chat ao vivo e mensagens automatizadas'],
        selectedRecommendationType: 'SingleProduct',
      });

      const recommendations = recommendationService.getRecommendations(formData, mockProducts);

      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].name).toBe('RD Conversas');
    });

    test('retorna apenas 1 produto quando há mais de um match; empate escolhe o último', () => {
      const formData = buildFormData({
        selectedPreferences: [
          'Integração fácil com ferramentas de e-mail',
          'Automação de marketing',
        ],
        selectedFeatures: [
          'Rastreamento de interações com clientes',
          'Rastreamento de comportamento do usuário',
        ],
        selectedRecommendationType: 'SingleProduct',
      });

      const recommendations = recommendationService.getRecommendations(formData, mockProducts);

      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].name).toBe('RD Station Marketing');
    });

    test('empate explícito retorna o último produto elegível', () => {
      const formData = buildFormData({
        selectedPreferences: ['Automação de marketing', 'Integração com chatbots'],
        selectedRecommendationType: 'SingleProduct',
      });

      const recommendations = recommendationService.getRecommendations(formData, mockProducts);

      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].name).toBe('RD Conversas');
    });

    test('nenhum filtro selecionado → retorna o último produto do catálogo', () => {
      const formData = buildFormData({
        selectedRecommendationType: 'SingleProduct',
      });

      const recommendations = recommendationService.getRecommendations(formData, mockProducts);

      expect(recommendations).toHaveLength(1);
      expect(recommendations[0].name).toBe('RD Mentor AI');
    });

    test('sem match algum, então retorna array vazio', () => {
      const formData = buildFormData({
        selectedPreferences: ['Preferência inexistente'],
        selectedFeatures: ['Feature inexistente'],
        selectedRecommendationType: 'SingleProduct',
      });

      const recommendations = recommendationService.getRecommendations(formData, mockProducts);

      expect(recommendations).toHaveLength(0);
    });

    test('normaliza tipo de recomendação', () => {
      const formData = buildFormData({
        selectedPreferences: ['Integração com chatbots'],
        selectedRecommendationType: 'SingleProduct',
      });

      const recommendations = recommendationService.getRecommendations(formData, mockProducts);

      expect(recommendations).toHaveLength(1);
      expect(productNames(recommendations)).toEqual(['RD Conversas']);
    });
  });

  describe('MultipleProducts', () => {
    test('retorna todos os produtos com score > 0', () => {
      const formData = buildFormData({
        selectedPreferences: [
          'Integração fácil com ferramentas de e-mail',
          'Personalização de funis de vendas',
          'Automação de marketing',
        ],
        selectedFeatures: [
          'Rastreamento de interações com clientes',
          'Rastreamento de comportamento do usuário',
        ],
        selectedRecommendationType: 'MultipleProducts',
      });

      const recommendations = recommendationService.getRecommendations(formData, mockProducts);

      expect(recommendations).toHaveLength(2);

      expect(productNames(recommendations)).toEqual([
        'RD Station CRM',
        'RD Station Marketing',
      ]);
    });

    test('nenhum filtro selecionado → retorna todos os produtos', () => {
      const formData = buildFormData({
        selectedRecommendationType: 'MultipleProducts',
      });

      const recommendations = recommendationService.getRecommendations(formData, mockProducts);

      expect(recommendations).toHaveLength(mockProducts.length);
      expect(productNames(recommendations)).toEqual(productNames(mockProducts));
    });

    test('apenas features selecionadas funciona (sem preferências)', () => {
      const formData = buildFormData({
        selectedFeatures: ['Chat ao vivo e mensagens automatizadas'],
        selectedRecommendationType: 'MultipleProducts',
      });

      const recommendations = recommendationService.getRecommendations(formData, mockProducts);

      expect(productNames(recommendations)).toEqual(['RD Conversas']);
    });

    test('apenas preferências selecionadas funciona (sem features)', () => {
      const formData = buildFormData({
        selectedPreferences: ['Automação de marketing'],
        selectedRecommendationType: 'MultipleProducts',
      });

      const recommendations = recommendationService.getRecommendations(formData, mockProducts);

      expect(productNames(recommendations)).toEqual(['RD Station Marketing']);
    });

    test('sem matches → retorna array vazio', () => {
      const formData = buildFormData({
        selectedPreferences: ['Preferência inexistente'],
        selectedFeatures: ['Feature inexistente'],
        selectedRecommendationType: 'MultipleProducts',
      });

      const recommendations = recommendationService.getRecommendations(formData, mockProducts);

      expect(recommendations).toEqual([]);
    });
  });

  describe('Robustez', () => {
    test('lista de produtos vazia → sempre retorna array vazio', () => {
      const formDataSingle = buildFormData({
        selectedRecommendationType: 'SingleProduct',
      });

      const formDataMultiple = buildFormData({
        selectedRecommendationType: 'MultipleProducts',
      });

      expect(recommendationService.getRecommendations(formDataSingle, [])).toEqual([]);
      expect(recommendationService.getRecommendations(formDataMultiple, [])).toEqual([]);
    });
  });
});
