// Banner.tsx
import React from "react";

function Banner() {
  return (
    <div className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-12 text-center">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold mb-4">
          Préservons ensemble la langue Hassaniya
        </h1>
        <p className="text-lg mb-6">
          Une plateforme collaborative pour créer, enrichir et partager le
          dictionnaire de la langue Hassaniya.
        </p>
        <div className="flex justify-center space-x-4">
          <button className="bg-white text-blue-600 px-6 py-2 rounded hover:bg-gray-50">
            <i className="bi bi-plus-circle mr-2"></i> Contribuer
          </button>
          <button className="border border-white px-6 py-2 rounded hover:bg-blue-500">
            En savoir plus <i className="bi bi-arrow-up-right ml-2"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Banner;
