import React from "react";

type PracticePageLayoutProps = {
  children: React.ReactNode;
};

export default function PracticePageLayout({ children }: PracticePageLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-white py-12 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto relative">
        <h1 className="text-4xl md:text-5xl mb-8 text-center font-bold text-blue-800 tracking-tight">
          Practice Flashcards
        </h1>
        {children}
      </div>
    </div>
  );
}