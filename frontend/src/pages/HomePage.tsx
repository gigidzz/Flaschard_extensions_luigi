import FlashcardList from "../components/FlashcardList";

function HomePage() {
    return (
      <div className='m-4 space-y-2'>
      <div className='flex justify-center'>
        <h2 className='text-4xl font-bold'>FLASHCARDS</h2>
      </div>
        <FlashcardList/>
      </div>
    );
  }
  
  export default HomePage;