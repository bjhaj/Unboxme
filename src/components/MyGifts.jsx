import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';
import { supabase } from '../supabaseClient';

function MyGifts() {
  const [activeTab, setActiveTab] = useState('received');
  const [receivedGifts, setReceivedGifts] = useState([]);
  const [sentGifts, setSentGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { session } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/signin');
      return;
    }
    fetchGifts();
  }, [session, navigate]);

  const fetchGifts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch received gifts
      const { data: receivedData, error: receivedError } = await supabase
        .from('gift_transactions')
        .select(`
          *,
          gift:gifts(*),
          sender:sender_id(email)
        `)
        .eq('recipient_id', session.user.id)
        .order('created_at', { ascending: false });

      if (receivedError) throw receivedError;

      // Fetch sent gifts
      const { data: sentData, error: sentError } = await supabase
        .from('gift_transactions')
        .select(`
          *,
          gift:gifts(*),
          recipient:recipient_id(email)
        `)
        .eq('sender_id', session.user.id)
        .order('created_at', { ascending: false });

      if (sentError) throw sentError;

      setReceivedGifts(receivedData || []);
      setSentGifts(sentData || []);
    } catch (err) {
      console.error('Error fetching gifts:', err);
      setError('Failed to load gifts. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptGift = async (giftId) => {
    try {
      const { error } = await supabase
        .from('gift_transactions')
        .update({ status: 'accepted' })
        .eq('id', giftId);

      if (error) throw error;
      fetchGifts(); // Refresh the gifts list
    } catch (err) {
      console.error('Error accepting gift:', err);
      setError('Failed to accept gift. Please try again.');
    }
  };

  const handleDeclineGift = async (giftId) => {
    try {
      const { error } = await supabase
        .from('gift_transactions')
        .update({ status: 'declined' })
        .eq('id', giftId);

      if (error) throw error;
      fetchGifts(); // Refresh the gifts list
    } catch (err) {
      console.error('Error declining gift:', err);
      setError('Failed to decline gift. Please try again.');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white p-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-rose-600"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <Link to="/dashboard" className="text-2xl font-bold text-gray-900">UnboxMe</Link>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{session?.user?.email}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">My Gifts</h1>
          <p className="text-xl text-gray-600">View and manage your gifts</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('received')}
              className={`${
                activeTab === 'received'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Received Gifts
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`${
                activeTab === 'sent'
                  ? 'border-rose-500 text-rose-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Sent Gifts
            </button>
          </nav>
        </div>

        {/* Gifts List */}
        <div className="space-y-6">
          {activeTab === 'received' ? (
            receivedGifts.length > 0 ? (
              receivedGifts.map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {gift.gift.gift_name}
                      </h3>
                      <p className="text-gray-600 mb-4">{gift.gift.Description}</p>
                      <div className="text-sm text-gray-500">
                        <p>From: {gift.sender.email}</p>
                        <p>Received: {formatDate(gift.created_at)}</p>
                        <p>Price: ${gift.gift.Price}</p>
                      </div>
                      {gift.message && (
                        <p className="mt-4 text-gray-700 italic">"{gift.message}"</p>
                      )}
                    </div>
                    {gift.status === 'pending' && (
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleAcceptGift(gift.id)}
                          className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleDeclineGift(gift.id)}
                          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          Decline
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No gifts received yet.</p>
                <Link
                  to="/send-gifts"
                  className="mt-4 inline-block text-rose-600 hover:text-rose-700"
                >
                  Send a gift to someone
                </Link>
              </div>
            )
          ) : (
            sentGifts.length > 0 ? (
              sentGifts.map((gift) => (
                <div
                  key={gift.id}
                  className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {gift.gift.gift_name}
                    </h3>
                    <p className="text-gray-600 mb-4">{gift.gift.Description}</p>
                    <div className="text-sm text-gray-500">
                      <p>To: {gift.recipient.email}</p>
                      <p>Sent: {formatDate(gift.created_at)}</p>
                      <p>Price: ${gift.gift.Price}</p>
                      <p>Status: <span className="capitalize">{gift.status}</span></p>
                    </div>
                    {gift.message && (
                      <p className="mt-4 text-gray-700 italic">"{gift.message}"</p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">No gifts sent yet.</p>
                <Link
                  to="/send-gifts"
                  className="mt-4 inline-block text-rose-600 hover:text-rose-700"
                >
                  Send your first gift
                </Link>
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default MyGifts; 