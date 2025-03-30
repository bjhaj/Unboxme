import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [userInfo, setUserInfo] = useState(null);
  const { session, signOut } = UserAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      navigate('/signin');
      return;
    }
    
    setUserInfo(session.user);
    setLoading(false);
  }, [session, navigate]);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Error signing out:', error);
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
            <h1 className="text-2xl font-bold text-gray-900">UnboxMe</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">{userInfo?.email}</span>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Welcome to UnboxMe!</h2>
          <p className="text-xl text-gray-600">Send joy, receive smiles. Start your gifting journey today.</p>
        </div>

        {/* Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Send Gifts Card */}
          <Link to="/send-gifts" 
            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-rose-500 to-pink-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="p-8">
              <div className="h-12 w-12 bg-rose-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">Send Gifts</h3>
              <p className="text-gray-600">Choose from our curated collection of gifts and brighten someone's day.</p>
            </div>
          </Link>

          {/* Received Gifts Card */}
          <Link to="/my-gifts" 
            className="group relative bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-indigo-500 opacity-0 group-hover:opacity-10 transition-opacity"></div>
            <div className="p-8">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 6h-2.18c.11-.31.18-.65.18-1a2.996 2.996 0 00-5.5-1.65l-.5.67-.5-.68C10.96 2.54 10.05 2 9 2 7.34 2 6 3.34 6 5c0 .35.07.69.18 1H4c-1.11 0-1.99.89-1.99 2L2 19c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V8c0-1.11-.89-2-2-2zm-5-2c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM9 4c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm11 15H4v-2h16v2zm0-5H4V8h5.08L7 10.83 8.62 12 12 7.4l3.38 4.6L17 10.83 14.92 8H20v6z"/>
                </svg>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">My Gifts</h3>
              <p className="text-gray-600">View gifts you've received and spread the joy forward.</p>
            </div>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-rose-600">0</div>
              <div className="text-gray-600 mt-1">Gifts Sent</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">0</div>
              <div className="text-gray-600 mt-1">Gifts Received</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">0</div>
              <div className="text-gray-600 mt-1">Joy Spread</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;

