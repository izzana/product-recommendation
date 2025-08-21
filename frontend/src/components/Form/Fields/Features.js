import React, { useState } from 'react';
import Checkbox from '../../shared/Checkbox';

function Features({ features, selectedFeatures = [], onFeatureChange }) {
  const [currentFeatures, setCurrentFeatures] = useState(selectedFeatures)

  const handleFeatureChange = (feature) => {
    const updatedFeatures = currentFeatures.includes(feature)
      ? currentFeatures.filter((pref) => pref !== feature)
      : [...currentFeatures, feature];

    setCurrentFeatures(updatedFeatures);
    onFeatureChange(updatedFeatures);
  };

  return (
    <div className="mb-4">
      <h2 className="legend">Funcionalidades:</h2>
      <ul>
        {features.map((feature, index) => (
          <li key={index} className="checkbox-row">
            <Checkbox
              id={`pref-${feature}`}
              value={feature}
              checked={currentFeatures.includes(feature)}
              onChange={() => handleFeatureChange(feature)}
              className="text-green-500"
            >
              {feature}
            </Checkbox>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Features;
