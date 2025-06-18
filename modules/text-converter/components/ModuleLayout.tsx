import React from 'react';

interface ModuleLayoutProps {
  children: React.ReactNode;
  title: string;
}

export default function ModuleLayout({ children, title }: ModuleLayoutProps) {
  return (
    <div className="module-layout">
      <header className="module-header">
        <h1>{title}</h1>
      </header>
      <main className="module-content">
        {children}
      </main>
    </div>
  );
}