import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserAuth } from '../context/AuthContext';

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { signInUser } = UserAuth();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { success, error, data } = await signInUser(formData.email, formData.password);
      
      if (success) {
        console.log('Sign in successful:', data);
        navigate('/dashboard');
      } else {
        console.error('Sign in failed:', error);
        setError(error?.message || 'Failed to sign in');
      }
    } catch (err) {
      console.error('Unexpected error during sign in:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="h-screen w-full flex items-center justify-center bg-white">
      <div className="flex w-full h-full">
        {/* Left Panel - Image/Brand */}
        <div className="hidden md:flex md:w-1/2 bg-[#4F46E5] flex-col items-center justify-center text-center px-16">
          <div>
            <h1 className="text-6xl font-bold mb-6 text-white">Welcome Back!</h1>
            <p className="text-xl text-white/90 mb-12">Sign in to access your schedule and manage your appointments.</p>
            <div className="mt-8">
              <p className="text-base text-white/80 mb-4">Don't have an account?</p>
              <Link to="/signup" className="inline-block text-white border border-white/30 px-8 py-3 rounded-lg hover:bg-white/10 transition-colors text-lg">
                Create Account
              </Link>
            </div>
          </div>
        </div>

        {/* Right Panel - Sign In Form */}
        <div className="w-full md:w-1/2 bg-white p-8 md:p-16 flex items-center">
          <div className="w-full max-w-md mx-auto space-y-8">
            <h2 className="text-4xl font-bold text-gray-900">Sign In</h2>

            {error && (
              <div className="mb-6 bg-red-50 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <span className="block text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleSignIn} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-900 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-900"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-900 mb-2">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-200 text-gray-900"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-black focus:ring-gray-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-[#4F46E5] hover:text-[#4338CA]">
                    Forgot password?
                  </a>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-3 px-4 rounded-lg text-white font-medium ${
                  loading ? 'bg-gray-700' : 'bg-black hover:bg-gray-900'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </form>

            <div className="mt-6 text-center md:hidden">
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-[#4F46E5] hover:text-[#4338CA]">
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;

