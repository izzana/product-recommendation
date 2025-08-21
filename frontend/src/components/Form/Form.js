// Form.js

import React from 'react';
import { Preferences, Features, RecommendationType } from './Fields';
import { SubmitButton } from './SubmitButton';
import useProducts from '../../hooks/useProducts';
import useForm from '../../hooks/useForm';
import useRecommendations from '../../hooks/useRecommendations';

function Form({ onRecommendationsUpdate, setShowRecommendationsList }) {
  const { preferences, features, products } = useProducts();
  const { formData, handleChange } = useForm({
    selectedPreferences: [],
    selectedFeatures: [],
    selectedRecommendationType: '',
  });

  const { getRecommendations } = useRecommendations(products);

  const handleSubmit = (e) => {
    e.preventDefault();

    const dataRecommendations = getRecommendations(formData);
    onRecommendationsUpdate(dataRecommendations);
    setShowRecommendationsList(true);
  };

  return (
    <form
      className="p-4 bg-white rounded-lg shadow-md"
      onSubmit={handleSubmit}
    >
      <Preferences
        preferences={preferences}
        onPreferenceChange={(selected) =>
          handleChange('selectedPreferences', selected ?? [])
        }
      />
      <Features
        features={features}
        onFeatureChange={(selected) =>
          handleChange('selectedFeatures', selected ?? [])
        }
      />
      <RecommendationType
        onRecommendationTypeChange={(selected) =>
          handleChange('selectedRecommendationType', selected)
        }
      />
      <div className='flex justify-end'>
        <SubmitButton text="Obter recomendação" />
      </div>
    </form>
  );
}

export default Form;
