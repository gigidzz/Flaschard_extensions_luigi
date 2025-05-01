export default function GestureGuide() {
  return (
    <div className="mt-10 p-6 rounded-xl shadow-md max-w-md w-full border border-blue-100">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        Gesture Controls:
      </h3>
      <ul className="space-y-3 pl-2">
        <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors">
          <span className="mr-3 text-2xl">👍</span> 
          <span>Thumbs Up = Rate as <span className="font-bold text-green-600">Easy</span></span>
        </li>
        <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors">
          <span className="mr-3 text-2xl">✋</span> 
          <span>Flat Hand = Rate as <span className="font-bold text-yellow-600">Hard</span></span>
        </li>
        <li className="flex items-center p-2 hover:bg-blue-50 rounded-lg transition-colors">
          <span className="mr-3 text-2xl">✌️</span> 
          <span>Victory Sign = Rate as <span className="font-bold text-red-600">Wrong</span></span>
        </li>
      </ul>
      <div className="mt-4 bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
        <p className="text-sm text-blue-800">
          Hold the gesture for 3 seconds to confirm your rating, or use the buttons below the card.
        </p>
        <p className="mt-2 text-sm text-blue-800 font-medium">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Ratings can only be submitted after flipping the card.
        </p>
      </div>
    </div>
  );
}