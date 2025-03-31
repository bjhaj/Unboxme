import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const GENRE_NAMES = {
  romantic: 'Romantic',
  birthday: 'Birthday',
  work: 'Work',
  'self-care': 'Self-Care',
  child: 'Child',
  friend: 'Friend'
};

function GiftSelection() {
  const { genreId } = useParams();
  const navigate = useNavigate();
  const [gifts, setGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRandomGifts = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .eq('genre', GENRE_NAMES[genreId])
        .order('id')
        .limit(100); // Get a larger pool to select from

      if (error) throw error;

      // Randomly select 4 gifts
      const shuffled = data.sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 4);
      setGifts(selected);
      setSelectedGift(null);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      setError('Failed to load gifts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRandomGifts();
  }, [genreId]);

  const handleFinalize = () => {
    if (selectedGift) {
      navigate(`/send-gift/${selectedGift.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/send-gifts" className="text-2xl font-bold text-gray-900">UnboxMe</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              {GENRE_NAMES[genreId]} Gifts
            </h1>
            <button
              onClick={fetchRandomGifts}
              className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
            >
              Refresh Selection
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-gray-500">Loading gifts...</div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {gifts.map((gift) => (
                  <button
                    key={gift.id}
                    onClick={() => setSelectedGift(gift)}
                    className={`p-6 rounded-xl border-2 transition-all ${
                      selectedGift?.id === gift.id
                        ? 'border-rose-500 bg-rose-50'
                        : 'border-gray-200 hover:border-rose-200 bg-white'
                    }`}
                  >
                    <div className="font-medium text-gray-900 text-lg mb-2">{gift.gift_name}</div>
                    <div className="text-sm text-gray-500 mb-2">{gift.description}</div>
                    <div className="text-sm font-medium text-rose-600">${gift.price}</div>
                    <div className="text-xs text-gray-400 mt-1">{gift.brand}</div>
                  </button>
                ))}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleFinalize}
                  disabled={!selectedGift}
                  className={`px-6 py-3 text-base font-medium text-white rounded-xl 
                    ${selectedGift 
                      ? 'bg-rose-600 hover:bg-rose-700' 
                      : 'bg-gray-400 cursor-not-allowed'
                    } transition-colors`}
                >
                  Finalize Selection
                </button>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default GiftSelection; 