export default function PracticePageSkeleton() {
    return <div className="flex justify-center items-center h-screen bg-gradient-to-b from-blue-50 to-white">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-lg text-blue-800 font-medium">Loading flashcards...</p>
    </div>
  </div>
}