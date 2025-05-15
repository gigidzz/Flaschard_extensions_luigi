import { useState } from 'react';
import FlashcardList from "../components/FlashcardList";

function HomePage() {
  const [activeTab, setActiveTab] = useState('all');
  
  const tabs = [
    { id: 'all', label: 'All Flashcards' },
    { id: 'learned', label: 'Learned Flashcards' },
    { id: 'practice', label: 'Practice Flashcards' }
  ];

  // For the homepage, we don't need rating functionality
  // But we pass the activeTab to show the appropriate flashcards
  return (
    <div className='m-4 space-y-4'>
      <div className='flex justify-center'>
        <h2 className='text-4xl font-bold'>FLASHCARDS</h2>
      </div>
      
      <div className='flex justify-center'>
        <div className='flex space-x-2 p-1 bg-gray-100 rounded-lg'>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`px-4 py-2 rounded-md transition-all ${
                activeTab === tab.id 
                  ? 'bg-blue-500 text-white shadow-md' 
                  : 'hover:bg-gray-200 text-gray-700'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
      
      <FlashcardList activeTab={activeTab} />
    </div>
  );
}

export default HomePage;