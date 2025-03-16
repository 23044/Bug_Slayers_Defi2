import React from 'react';
import { Link } from 'react-router-dom';
import { Book } from 'lucide-react';

export function Navigation() {
  return (
    <nav className="bg-blue-600 text-white">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <Book className="h-6 w-6" />
            <span className="text-xl font-semibold">Dictionnaire Hassaniya</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Link 
              to="/login"
              className="px-3 py-1 text-sm bg-white/10 rounded-full hover:bg-white/20 transition"
            >
              Se connecter
            </Link>
            <Link 
              to="/signup"
              className="px-3 py-1 text-sm bg-white rounded-full text-blue-600 hover:bg-white/90 transition"
            >
              S'inscrire
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}