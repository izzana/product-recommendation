import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Form from './Form';

jest.mock('../../hooks/useProducts', () => ({
  __esModule: true,
  default: () => ({
    preferences: ['Automação de marketing', 'Integração com chatbots'],
    features: ['Chat ao vivo e mensagens automatizadas', 'Rastreamento de comportamento do usuário'],
    products: [
      {
        id: 2,
        name: 'RD Station Marketing',
        category: 'Marketing',
        preferences: ['Automação de marketing'],
        features: ['Rastreamento de comportamento do usuário'],
      },
      {
        id: 3,
        name: 'RD Conversas',
        category: 'Omnichannel',
        preferences: ['Integração com chatbots'],
        features: ['Chat ao vivo e mensagens automatizadas'],
      },
    ],
  }),
}));

const mockGetRecommendations = jest.fn();

jest.mock('../../hooks/useRecommendations', () => ({
  __esModule: true,
  default: () => ({
    getRecommendations: mockGetRecommendations,
  }),
}));

describe('Form - submit', () => {
  beforeEach(() => {
    mockGetRecommendations.mockReset();
  });

  test('submete com seleções e chama onRecommendationsUpdate e setShowRecommendationsList', async () => {
    const handleUpdate = jest.fn();
    const handleToggleList = jest.fn();

    mockGetRecommendations.mockReturnValue([
      { id: 3, name: 'RD Conversas', category: 'Omnichannel' },
    ]);

    render(
      <Form
        onRecommendationsUpdate={handleUpdate}
        setShowRecommendationsList={handleToggleList}
      />
    );

    // Seleciona uma preferência e uma funcionalidade
    await userEvent.click(screen.getByLabelText(/Integração com chatbots/i));
    await userEvent.click(screen.getByLabelText(/Chat ao vivo e mensagens automatizadas/i));

    // Envio do formulário
    await userEvent.click(screen.getByRole('button', { name: /Obter recomendação/i }));

    // Assert do getRecommendations
    expect(mockGetRecommendations).toHaveBeenCalledTimes(1);
    const [calledFormData] = mockGetRecommendations.mock.calls[0];
    expect(calledFormData.selectedPreferences).toContain('Integração com chatbots');
    expect(calledFormData.selectedFeatures).toContain('Chat ao vivo e mensagens automatizadas');

    // Callback do pai recebe as recomendações mockadas
    expect(handleUpdate).toHaveBeenCalledWith([
      { id: 3, name: 'RD Conversas', category: 'Omnichannel' },
    ]);

    // Toggle da listagem
    expect(handleToggleList).toHaveBeenCalledWith(true);
  });
});

