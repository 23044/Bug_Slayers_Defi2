import React, { useState, useEffect } from "react";

interface Contributor {
  name: string;
  contributions: number;
  approved: number;
  role: string;
}

const TopContributors: React.FC = () => {
  const [contributors, setContributors] = useState<Contributor[]>([]);

  useEffect(() => {
    const mockContributors = [
      {
        name: "Ahmed Mahmoud",
        contributions: 520,
        approved: 38,
        role: "Contributeur",
      },
      {
        name: "Mariam Diallo",
        contributions: 480,
        approved: 30,
        role: "Linguiste",
      },
      {
        name: "Prof. Khalil",
        contributions: 750,
        approved: 65,
        role: "Modérateur",
      },
    ];

    setContributors(mockContributors);
  }, []);

  // Fonction pour attribuer une couleur au badge selon le rôle
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Contributeur":
        return "bg-gray-400 text-white";
      case "Linguiste":
        return "bg-blue-500 text-white";
      case "Modérateur":
        return "bg-green-600 text-white";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white shadow-md rounded-lg p-6">
      <h3 className="text-xl font-bold text-gray-800 mb-4">
        Top Contributeurs
      </h3>
      <div id="top-contributors">
        {contributors.length > 0 ? (
          <ul>
            {contributors.map((contributor, index) => (
              <li
                key={index}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div className="flex items-center space-x-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 font-bold rounded-full">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-700">
                      {contributor.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {contributor.contributions} pts • {contributor.approved}{" "}
                      mots approuvés
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${getRoleBadgeColor(
                    contributor.role
                  )}`}
                >
                  {contributor.role}
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500 text-center">
            Aucun contributeur trouvé.
          </p>
        )}
      </div>
      <div className="text-center mt-4">
        <button className="px-4 py-2 text-sm font-medium text-blue-600 border border-blue-600 rounded hover:bg-blue-50">
          Voir tous les contributeurs
        </button>
      </div>
    </div>
  );
};

export default TopContributors;
