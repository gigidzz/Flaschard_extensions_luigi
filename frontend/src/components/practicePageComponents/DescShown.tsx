import { Flashcard } from "../../types/flashcard";

export default function DescShown({flashcards, startPractice}:{flashcards: Flashcard[], startPractice: () => void}) {
    return <div className="text-center max-w-md mx-auto bg-white p-8 rounded-2xl shadow-xl transform transition-all duration-300 hover:shadow-2xl border border-blue-200">
    <h2 className="text-3xl mb-6 text-blue-700 font-semibold">Ready to Practice?</h2>
    <div className="mb-8 space-y-4">
      <div className="flex items-center justify-center gap-3">
        <div className="bg-blue-100 rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
          </svg>
        </div>
        <p className="font-medium">You have <span className="font-bold text-blue-600">{flashcards.length}</span> flashcards to practice</p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <div className="bg-yellow-100 rounded-full p-3">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <p className="font-medium">Including <span className="font-bold text-yellow-600">{flashcards.length}</span> cards with score less than 5</p>
      </div>
    </div>
    <button 
      onClick={startPractice}
      className={`${
        flashcards.length === 0 
          ? 'bg-gray-400 cursor-not-allowed' 
          : 'bg-blue-600 hover:bg-blue-700 active:transform active:scale-95'
      } text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 shadow-md hover:shadow-lg w-full`}
      disabled={flashcards.length === 0}
    >
      Start Practice
    </button>
    
    {flashcards.length === 0 && (
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
        </svg>
        <p className="text-gray-600">No flashcards available for practice.</p>
        <p className="text-sm text-gray-500 mt-2">Create some flashcards first to begin practicing.</p>
      </div>
    )}
  </div>
}