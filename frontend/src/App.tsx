import React, { useEffect, useState, useRef } from "react";
import { Routes, Route } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { SignupPage } from "./components/SignupPage";
import { Navigation } from "./components/Navigation";
import Stats from "./components/Stats";
import Banner from "./components/Banner";
import TopContributors from "./components/TopContributors";
import HowItWorks from "./components/HowItWorks";

import "./index.css";

import {
  Search,
  Award,
  Upload,
  FileText,
  BookOpen,
  Star,
  FileCheck,
  MessageSquare,
} from "lucide-react";
import axios from "axios";

// Types
type WordStatus = "pending" | "under-review" | "approved" | "rejected";

// interface Word {
//   id: number;
//   word: string;
//   definition: string;
//   examples?: string[];
//   contributor: string;
//   contributorId: number;
//   dateSubmitted: string;
//   status: WordStatus;
//   comments: Comment[];
//   variants: string[];
//   votes: number;
// }

interface Comment {
  id: number;
  user: string;
  userId: number;
  text: string;
  date: string;
}

interface Word {
  id: number;
  word: string;
  definition: string;
  examples?: string[];
  contributor: string;
  contributorId: number;
  dateSubmitted: string;
  status: WordStatus;
  bonner: boolean; // Nouveau champ pour Bonner
  comments: Comment[];
  variants: string[];
  votes: number;
}

// Données Mock avec le champ bonner
const mockWords: Word[] = [
  {
    id: 1,
    word: "احماهم",
    definition: "Se sentir frustré ou affligé par le comportement de quelqu'un",
    examples: ["احماهم من مشيك", "احماهم من الصداع"],
    contributor: "Ahmed Mahmoud",
    contributorId: 1,
    dateSubmitted: "2023-06-15",
    status: "approved",
    bonner: true, // Exemple de Bonner
    comments: [
      {
        id: 1,
        user: "Prof. Khalil",
        userId: 3,
        text: "Excellente contribution, merci!",
        date: "2023-06-16",
      },
    ],
    variants: ["محماهم", "يحماهم"],
    votes: 24,
  },
  {
    id: 2,
    word: "تبارك",
    definition: "Expression de bénédiction ou d'admiration",
    examples: ["تبارك الله في هذا الولد"],
    contributor: "Mariam Diallo",
    contributorId: 2,
    dateSubmitted: "2023-06-20",
    status: "pending",
    bonner: false, // Exemple de Bonner
    comments: [],
    variants: ["مبارك", "يتبارك"],
    votes: 12,
  },
];

function HomePage() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [currentTab, setCurrentTab] = React.useState<
    "all" | "approved" | "pending" | "review"
  >("all");
  const [words, setWords] = React.useState<Word[]>(mockWords);
  const [importedFile, setImportedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const filteredWords = words.filter((word) => {
    const matchesSearch =
      word.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
      word.definition.toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    switch (currentTab) {
      case "approved":
        return word.status === "approved";
      case "pending":
        return word.status === "pending";
      case "review":
        return word.status === "under-review";
      default:
        return true;
    }
  });

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setImportedFile(file);
      console.log("Fichier sélectionné :", file.name);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // Déclenche le champ de fichier masqué
    }
  };

  const handleImport = () => {
    if (importedFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        console.log("Contenu du fichier :", content); // Traitez le contenu ici
      };
      reader.readAsText(importedFile);
    } else {
      console.error("Aucun fichier sélectionné.");
    }
  };

  return (
    <>
      <Navigation />

      <Banner />
      <Stats />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dictionary Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <div className="flex flex-col md:flex-row justify-between md:items-center mb-6">
                <h2 className="text-2xl font-bold mb-4 md:mb-0">
                  Dictionnaire
                </h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher un mot..."
                    className="pl-10 pr-4 py-2 border rounded-lg w-full md:w-64"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Tabs */}
              <div className="flex space-x-2 mb-6 border-b">
                {["all", "approved", "pending", "review"].map((tab) => (
                  <button
                    key={tab}
                    className={`px-4 py-2 -mb-px ${
                      currentTab === tab
                        ? "border-b-2 border-blue-600 text-blue-600 font-medium"
                        : "text-gray-500 hover:text-gray-700"
                    }`}
                    onClick={() => setCurrentTab(tab as typeof currentTab)}
                  >
                    {tab === "all"
                      ? "Tous"
                      : tab === "approved"
                      ? "Approuvés"
                      : tab === "pending"
                      ? "En attente"
                      : "En révision"}
                  </button>
                ))}
              </div>

              {/* Word List */}
              <div className="space-y-4">
                {filteredWords.map((word) => (
                  <WordCard key={word.id} word={word} />
                ))}
              </div>
            </div>

            {/* Add Word Form */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">
                Soumettre un nouveau mot
              </h2>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Mot en Hassaniya *
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Définition *
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-lg p-2"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Exemple d'utilisation
                  </label>
                  <textarea className="w-full border rounded-lg p-2" rows={3} />
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  Soumettre pour approbation
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Challenge Card */}
            <div className="bg-white rounded-xl shadow-sm p-6 border-t-4 border-blue-600">
              <div className="flex items-center space-x-2 mb-4">
                <Award className="h-6 w-6 text-blue-600" />
                <h3 className="text-lg font-bold">Challenge 1000 mots</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Participez au challenge des 1000 mots racines du hassaniya !
              </p>
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="font-medium">Progression globale</span>
                  <span className="font-bold">64%</span>
                </div>
                <div className="h-2 bg-gray-200 rounded-full">
                  <div className="h-2 bg-blue-600 rounded-full w-[64%]" />
                </div>
                <div className="text-center text-sm text-gray-500 mt-2">
                  640 mots sur 1000
                </div>
              </div>
              <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
                Contribuer au challenge
              </button>
            </div>
            <TopContributors />
            {/* Tools */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold mb-4">Outils</h3>
              <div className="space-y-2">
                <button
                  onClick={handleButtonClick}
                  className="w-full flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  <Upload className="h-4 w-4" />
                  <span>Importer un document</span>
                </button>
                <input
                  type="file"
                  accept=".txt,.csv,.pdf,.docx"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />

                <button
                  onClick={handleImport}
                  // className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  className="w-full flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition"
                >
                  <FileCheck className="h-4 w-4" />
                  <span>Traiter le fichier importé</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                  <BookOpen className="h-4 w-4" />
                  <span>Guide de contribution</span>
                </button>
                <button className="w-full flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50 transition">
                  <FileText className="h-4 w-4" />
                  <span>Règles de transcription</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        <HowItWorks />
      </div>
    </>
  );
}

// Word Card Component
function BonnerBadge({ bonner }: { bonner: boolean }) {
  return (
    <span
      className={`text-xs px-2 py-1 rounded-full ${
        bonner ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}
    >
      {bonner ? "Bon" : "Mauvais"}
    </span>
  );
}

// Card pour afficher un mot avec son status et son bonner
function WordCard({ word }: { word: Word }) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition">
      <div className="flex justify-between">
        <div>
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-bold">{word.word}</h3>
            <StatusBadge status={word.status} />
            <BonnerBadge bonner={word.bonner} />{" "}
            {/* Affichage du badge Bonner */}
          </div>
          <p className="text-gray-600">{word.definition}</p>

          {word.examples && word.examples.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold mb-1">Exemples:</h4>
              <ul className="text-sm text-gray-500 list-disc list-inside">
                {word.examples.map((example, i) => (
                  <li key={i}>{example}</li>
                ))}
              </ul>
            </div>
          )}

          {word.variants.length > 0 && (
            <div className="mt-3">
              <h4 className="text-sm font-semibold mb-1">Variantes:</h4>
              <div className="flex flex-wrap gap-2">
                {word.variants.map((variant, i) => (
                  <span
                    key={i}
                    className="text-sm bg-gray-100 px-2 py-1 rounded"
                  >
                    {variant}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="text-center">
          <button className="flex flex-col items-center p-2 hover:bg-gray-50 rounded transition">
            <Star className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-500">{word.votes}</span>
          </button>
        </div>
      </div>

      {word.comments.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center space-x-1 mb-2">
            <MessageSquare className="h-4 w-4 text-gray-400" />
            <h4 className="text-sm font-semibold">Commentaires:</h4>
          </div>
          <div className="space-y-2">
            {word.comments.map((comment) => (
              <div key={comment.id} className="bg-gray-50 p-3 rounded text-sm">
                <div className="font-medium">{comment.user}</div>
                <p className="text-gray-600">{comment.text}</p>
                <div className="text-xs text-gray-400 mt-1">{comment.date}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 text-sm text-gray-500">
        Contribué par: {word.contributor}
      </div>
    </div>
  );
}

// Status Badge Component
function StatusBadge({ status }: { status: WordStatus }) {
  const styles = {
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    "under-review": "bg-blue-100 text-blue-800",
    rejected: "bg-red-100 text-red-800",
  };

  const labels = {
    approved: "Approuvé",
    pending: "En attente",
    "under-review": "En révision",
    rejected: "Rejeté",
  };

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}

function Footer() {
  return (
    <footer className="bg-blue-600 text-white py-5">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Dictionnaire Description */}
          <div>
            <h5 className="text-lg font-semibold mb-3">
              Dictionnaire Hassaniya
            </h5>
            <p className="text-white/80">
              Une initiative collaborative pour préserver et enrichir la langue
              Hassaniya pour les générations futures.
            </p>
          </div>

          {/* Liens */}
          <div>
            <h5 className="text-lg font-semibold mb-3">Liens</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Accueil
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Dictionnaire
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Contributeurs
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Challenge 1000 mots
                </a>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h5 className="text-lg font-semibold mb-3">Ressources</h5>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Guide de contribution
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Règles de transcription
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-white/80 hover:text-white">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h5 className="text-lg font-semibold mb-3">
              Inscrivez-vous à notre newsletter
            </h5>
            <div className="flex">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-3 py-2 bg-blue-700 border border-white/50 rounded-l-md text-white placeholder-white/80"
              />
              <button className="bg-white text-blue-600 px-4 py-2 rounded-r-md hover:bg-gray-200">
                S'inscrire
              </button>
            </div>
            <p className="text-sm text-white/80 mt-2">
              Recevez les dernières mises à jour et nouvelles sur le projet.
            </p>
          </div>
        </div>

        {/* Copyright */}
        <div className="container mx-auto text-center text-white-600 text-sm">
          © {new Date().getFullYear()} Dictionnaire Hassaniya. Tous droits
          réservés.
        </div>
      </div>
    </footer>
  );
}

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Fetch data from Django API
    axios
      .get("http://127.0.0.1:8000/api/accounts/users/")
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the users!", error);
      });
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
      </Routes>

      {/* User List */}

      <Footer />
    </div>
  );
}

export default App;
