import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import SignUp from './components/signup';
import SignIn from './components/signin';
import Dashboard from './components/dashboard';
import SendGifts from './components/SendGifts';
import GiftSelection from './components/GiftSelection';
import SendGift from './components/SendGift';
import MyGifts from './components/MyGifts';
import PrivateRoute from './components/privateRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '/',
        element: <SignIn />,
      },
      {
        path: '/signup',
        element: <SignUp />,
      },
      {
        path: '/signin',
        element: <SignIn />,
      },
      {
        path: "/dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "/send-gifts",
        element: (
          <PrivateRoute>
            <SendGifts />
          </PrivateRoute>
        ),
      },
      {
        path: "/gift-selection/:genreId",
        element: (
          <PrivateRoute>
            <GiftSelection />
          </PrivateRoute>
        ),
      },
      {
        path: "/send-gift/:giftId",
        element: (
          <PrivateRoute>
            <SendGift />
          </PrivateRoute>
        ),
      },
      {
        path: "/my-gifts",
        element: (
          <PrivateRoute>
            <MyGifts />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
