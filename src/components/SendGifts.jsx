import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGifts } from '../context/GiftContext';
import { supabase } from '../supabaseClient';

const GENRES = [
  {
    id: 'romantic',
    name: 'Romantic',
    icon: '❤️',
    description: 'Perfect gifts for your special someone'
  },
  {
    id: 'birthday',
    name: 'Birthday',
    icon: '🎂',
    description: 'Celebrate their special day'
  },
  {
    id: 'work',
    name: 'Work',
    icon: '💼',
    description: 'Professional gifts for colleagues'
  },
  {
    id: 'self-care',
    name: 'Self-Care',
    icon: '🧘',
    description: 'Gifts for wellness and relaxation'
  },
  {
    id: 'child',
    name: 'Child',
    icon: '🎨',
    description: 'Fun gifts for the little ones'
  },
  {
    id: 'friend',
    name: 'Friend',
    icon: '🤝',
    description: 'Thoughtful gifts for friends'
  }
];

function SendGifts() {
  const [gifts, setGifts] = useState([]);
  const [selectedGift, setSelectedGift] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { sendGift } = useGifts();

  useEffect(() => {
    fetchGifts();
  }, []);

  const fetchGifts = async () => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .order('gift_name');

      if (error) throw error;
      setGifts(data || []);
    } catch (error) {
      console.error('Error fetching gifts:', error);
      setError('Failed to load gifts');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    try {
      const result = await sendGift(selectedGift.id, recipientEmail, message);
      
      if (result.success) {
        setSuccess(true);
        setSelectedGift(null);
        setRecipientEmail('');
        setMessage('');
      } else {
        setError(result.error.message || 'Failed to send gift');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-gray-900">UnboxMe</Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Choose a Gift Category</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {GENRES.map((genre) => (
              <Link
                key={genre.id}
                to={`/gift-selection/${genre.id}`}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="p-6">
                  <div className="text-4xl mb-4">{genre.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{genre.name}</h3>
                  <p className="text-gray-600">{genre.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default SendGifts; 