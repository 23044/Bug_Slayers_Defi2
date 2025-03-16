// Stats.tsx
import React from "react";

function Stats() {
  const stats = [
    { label: "Mots au total", value: "3,427" },
    { label: "Contributeurs", value: "752" },
    { label: "Mots approuvés", value: "86%" },
    { label: "Nouvelles entrées cette semaine", value: "127" },
  ];

  return (
    <div className="bg-gray-100 py-12">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-4 gap-6 px-4">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="text-center bg-white rounded-lg shadow p-6"
          >
            <h2 className="text-3xl font-bold text-blue-600">{stat.value}</h2>
            <p className="mt-2 text-gray-700">{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Stats;
