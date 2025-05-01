
export default function PracticePageError({error}:{error: Error}) {
    return <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
    <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full border border-red-100">
      <div className="text-red-500 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-xl font-bold mb-2">Error Loading Flashcards</h2>
        <p className="text-gray-700">{error.message}</p>
      </div>
    </div>
  </div>
}