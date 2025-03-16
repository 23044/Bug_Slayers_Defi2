import React from "react";

const HowItWorks: React.FC = () => {
  return (
    <div className="bg-light py-5">
      <div className="container">
        <h2 className="text-center mb-4">Comment ça marche</h2>
        <div className="row g-4">
          <div className="col-md-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <div
                  className="rounded-circle bg-primary bg-opacity-10 p-3 d-inline-flex justify-content-center align-items-center mb-3"
                  style={{ width: "64px", height: "64px" }}
                >
                  <i className="bi bi-plus-circle text-primary fs-3"></i>
                </div>
                <h4 className="fw-bold mb-2">1. Proposer</h4>
                <p className="text-muted small">
                  Soumettez des mots avec leurs définitions et exemples
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <div
                  className="rounded-circle bg-warning bg-opacity-10 p-3 d-inline-flex justify-content-center align-items-center mb-3"
                  style={{ width: "64px", height: "64px" }}
                >
                  <i className="bi bi-clock text-warning fs-3"></i>
                </div>
                <h4 className="fw-bold mb-2">2. Révision</h4>
                <p className="text-muted small">
                  Les linguistes et modérateurs examinent les propositions
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <div
                  className="rounded-circle bg-success bg-opacity-10 p-3 d-inline-flex justify-content-center align-items-center mb-3"
                  style={{ width: "64px", height: "64px" }}
                >
                  <i className="bi bi-check-circle text-success fs-3"></i>
                </div>
                <h4 className="fw-bold mb-2">3. Approbation</h4>
                <p className="text-muted small">
                  Les entrées validées sont ajoutées au dictionnaire
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card text-center h-100">
              <div className="card-body">
                <div
                  className="rounded-circle bg-info bg-opacity-10 p-3 d-inline-flex justify-content-center align-items-center mb-3"
                  style={{ width: "64px", height: "64px" }}
                >
                  <i className="bi bi-trophy text-info fs-3"></i>
                </div>
                <h4 className="fw-bold mb-2">4. Récompenses</h4>
                <p className="text-muted small">
                  Gagnez des points et badges pour vos contributions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HowItWorks;
