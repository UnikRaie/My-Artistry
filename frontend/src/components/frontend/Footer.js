import React from 'react';

export default function Footer() {
  return (
    <div>
      <footer className="flex flex-wrap justify-between items-center py-6 mt-8">
        <div className="flex items-center space-x-6">
          {/* Logo */}
          <a href="/">
            <img
              src="/logo.svg" 
              alt="Logo"
              className="h-16"
            />
          </a>
          {/* Copyright text */}
          <span className="text-white text-sm">© 2025 Company, Inc</span>
        </div>
      </footer>
    </div>
  );
}
