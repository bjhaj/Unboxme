import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useGifts } from '../context/GiftContext';

function SendGift() {
  const { giftId } = useParams();
  const navigate = useNavigate();
  const { sendGift } = useGifts();
  const [gift, setGift] = useState(null);
  const [recipientEmail, setRecipientEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!giftId) {
      setError('Invalid gift ID');
      setLoading(false);
      return;
    }

    fetchGiftDetails();
  }, [giftId]);

  const fetchGiftDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .eq('id', giftId)
        .maybeSingle();

      if (error) throw error;
      if (!data) {
        setError('Gift not found');
        return;
      }
      setGift(data);
    } catch (error) {
      console.error('Error fetching gift details:', error);
      setError('Failed to load gift details');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSending(true);

    try {
      const result = await sendGift(giftId, recipientEmail, message);
      
      if (result.success) {
        setSuccess(true);
        setTimeout(() => {
          navigate('/my-gifts');
        }, 2000);
      } else {
        setError(result.error.message || 'Failed to send gift');
      }
    } catch (err) {
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading gift details...</div>
      </div>
    );
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Send Your Gift</h1>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-r-lg">
              <p className="text-green-700">Gift sent successfully! Redirecting to My Gifts...</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-lg">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          {gift && (
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">{gift.gift_name}</h2>
              <p className="text-gray-600 mb-4">{gift.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium text-rose-600">${gift.price}</span>
                <span className="text-sm text-gray-500">{gift.brand}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                Recipient's Email
              </label>
              <input
                type="email"
                id="recipientEmail"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                placeholder="friend@example.com"
                required
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                Personal Message (Optional)
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="block w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-colors"
                placeholder="Add a personal message to your gift..."
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Link
                to="/send-gifts"
                className="px-6 py-3 text-base font-medium text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={sending || !recipientEmail}
                className={`px-6 py-3 text-base font-medium text-white rounded-xl 
                  ${(sending || !recipientEmail) 
                    ? 'bg-gray-400 cursor-not-allowed' 
                    : 'bg-rose-600 hover:bg-rose-700'
                  } transition-colors`}
              >
                {sending ? (
                  <span className="flex items-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Sending...
                  </span>
                ) : (
                  'Send Gift'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default SendGift; 