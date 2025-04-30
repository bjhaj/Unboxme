he UnboxMe system follows a React + Vite architecture backed by Supabase (PostgreSQL) and integrated external services like Attio CRM API and Stripe.
Frontend: Built with React and styled with CSS, responsible for rendering customer dashboards, login/signup, gift selection, and profile views.
Backend/Data Layer: Supabase is used as a backend-as-a-service (BaaS) for authentication, database operations, and serverless functions.
Third-Party APIs: Attio (CRM), Stripe (payments).
Hosting: Can be deployed via Vercel, Netlify, or a static host with Supabase for backend.


File navigation information
Main folders are:
Unboxme/
├── public/                      # Static assets
│   └── vite.svg
├── src/
│   ├── App.jsx, App.css         # Root React component
│   ├── main.jsx, router.jsx     # Entry and routing logic
│   ├── index.css                # Global styles
│   ├── supabaseClient.js        # Supabase client instance
│   ├── assets/                  # Static images (e.g., react.svg)
│   ├── components/              # Reusable views/components
│   │   ├── dashboard.jsx
│   │   ├── GiftSelection.jsx
│   │   ├── MyGifts.jsx
│   │   ├── SendGift.jsx
│   │   ├── SendGifts.jsx
│   │   ├── privateRoute.jsx
│   │   ├── signin.jsx
│   │   └── signup.jsx
│   └── context/                 # React context for auth and state
│       ├── AuthContext.jsx
│       └── GiftContext.jsx
├── update_schema.sql           # SQL schema for Supabase
├── package.json, vite.config.js, eslint.config.js
└── README.md


Installation process

Step 1:
git clone https://github.com/Unboxme
cd Unboxme

Step 2:
npm install

Step 3:
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
ATTIO_API_KEY=your_attio_api_key
STRIPE_SECRET_KEY=your_stripe_secret

Step 4:
npm run dev
npm run build

Licenses

This project uses the MIT License (assumed, please confirm).

All third-party packages should be used under compatible open-source licenses (MIT, ISC, Apache 2.0).

Libraries - including source and version

react: 18.x (Frontend library)

vite: 4.x (Frontend build tool)

eslint: 8.x (Linting)

@supabase/supabase-js: 2.x (Backend service client)

react-router-dom: 6.x (Routing)

stripe: 12.x (Payment integration)

API / SDK - including source and version

Attio CRM API
Source: https://attio.com


Version: Unspecified (used via custom HTTP requests)


Stripe API
Source: https://stripe.com/docs/api


Version: 2022-08-01


Supabase SDK
Source: https://supabase.com/docs 


Version: 2.x via @supabase/supabase-js
