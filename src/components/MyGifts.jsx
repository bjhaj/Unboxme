import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useGifts } from '../context/GiftContext';
import { supabase } from '../supabaseClient';

function MyGifts() {
  const [activeTab, setActiveTab] = useState('received');
  const { receivedGifts, sentGifts, loading, sendThanks } = useGifts();
  const [giftDetails, setGiftDetails] = useState({});

  useEffect(() => {
    fetchGiftDetails();
  }, [receivedGifts, sentGifts]);

  const fetchGiftDetails = async () => {
    try {
      const allGifts = [...receivedGifts, ...sentGifts];
      const giftIds = allGifts.map(gift => gift.gift_id);
      
      const { data, error } = await supabase
        .from('gifts')
        .select('*')
        .in('id', giftIds);

      if (error) throw error;

      const details = {};
      data.forEach(gift => {
        details[gift.id] = gift;
      });
      setGiftDetails(details);
    } catch (error) {
      console.error('Error fetching gift details:', error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const handleSendThanks = async (giftId) => {
    try {
      const result = await sendThanks(giftId);
      if (!result.success) {
        console.error('Failed to send thanks:', result.error);
      }
    } catch (error) {
      console.error('Error sending thanks:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-gray-500">Loading...</div>
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
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">My Gifts</h1>

          {/* Tabs */}
          <div className="flex space-x-4 mb-8">
            <button
              onClick={() => setActiveTab('received')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'received'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-rose-50'
              }`}
            >
              Received
            </button>
            <button
              onClick={() => setActiveTab('sent')}
              className={`px-6 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'sent'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-rose-50'
              }`}
            >
              Sent
            </button>
          </div>

          {/* Gifts List */}
          <div className="bg-white rounded-2xl shadow-lg">
            {activeTab === 'received' && (
              <div className="divide-y divide-gray-100">
                {receivedGifts.map((gift) => {
                  const giftDetail = giftDetails[gift.gift_id];
                  return (
                    <div key={gift.id} className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-2xl">
                          🎁
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {giftDetail?.gift_name || 'Loading...'}
                            </h3>
                            <time className="text-sm text-gray-500">{formatDate(gift.created_at)}</time>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">From: {gift.sender_email}</p>
                          {giftDetail && (
                            <div className="mt-2 text-sm text-gray-600">
                              <p className="text-rose-600 font-medium">${giftDetail.Price}</p>
                              <p className="text-gray-500">{giftDetail.Description}</p>
                              <p className="text-xs text-gray-400">{giftDetail.Brand} • {giftDetail.Genre}</p>
                            </div>
                          )}
                          {gift.message && (
                            <p className="mt-2 text-gray-700 bg-gray-50 rounded-lg p-3">
                              "{gift.message}"
                            </p>
                          )}
                          <div className="mt-4 flex space-x-4">
                            {!gift.thanks_sent && (
                              <button 
                                onClick={() => handleSendThanks(gift.id)}
                                className="text-sm text-rose-600 hover:text-rose-700 font-medium"
                              >
                                Send Thanks
                              </button>
                            )}
                            <Link
                              to="/send-gifts"
                              className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                            >
                              Send Gift Back
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {receivedGifts.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-4">🎁</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No gifts yet</h3>
                    <p className="text-gray-600">When someone sends you a gift, it will appear here.</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'sent' && (
              <div className="divide-y divide-gray-100">
                {sentGifts.map((gift) => {
                  const giftDetail = giftDetails[gift.gift_id];
                  return (
                    <div key={gift.id} className="p-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 w-12 h-12 bg-rose-50 rounded-xl flex items-center justify-center text-2xl">
                          🎁
                        </div>
                        <div className="ml-4 flex-1">
                          <div className="flex items-center justify-between">
                            <h3 className="text-lg font-medium text-gray-900">
                              {giftDetail?.gift_name || 'Loading...'}
                            </h3>
                            <time className="text-sm text-gray-500">{formatDate(gift.created_at)}</time>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">To: {gift.recipient_email}</p>
                          {giftDetail && (
                            <div className="mt-2 text-sm text-gray-600">
                              <p className="text-rose-600 font-medium">${giftDetail.Price}</p>
                              <p className="text-gray-500">{giftDetail.Description}</p>
                              <p className="text-xs text-gray-400">{giftDetail.Brand} • {giftDetail.Genre}</p>
                            </div>
                          )}
                          {gift.message && (
                            <p className="mt-2 text-gray-700 bg-gray-50 rounded-lg p-3">
                              "{gift.message}"
                            </p>
                          )}
                          <div className="mt-4">
                            <span className={`text-sm font-medium ${
                              gift.thanks_sent ? 'text-green-600' : 'text-gray-500'
                            }`}>
                              {gift.thanks_sent ? 'Thanks received!' : 'Waiting for thanks...'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {sentGifts.length === 0 && (
                  <div className="p-8 text-center">
                    <div className="text-4xl mb-4">📤</div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No sent gifts</h3>
                    <p className="text-gray-600 mb-6">Start spreading joy by sending gifts to your friends!</p>
                    <Link
                      to="/send-gifts"
                      className="inline-flex items-center px-6 py-3 text-base font-medium text-white bg-rose-600 rounded-xl hover:bg-rose-700 transition-colors"
                    >
                      Send a Gift
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default MyGifts; 