
# 🎁 UnboxMe – Personalized Gifting Platform

UnboxMe is a web application that allows users to send customized gifts with AI-generated visual enhancements and messages. It follows a modern React + Vite architecture and uses Supabase as the backend. Stripe handles payments, and Attio CRM integration was used in earlier development stages.

---

## 🧱 System Architecture

- **Frontend:** Built with React and styled using CSS. Handles customer dashboards, login/signup, gift selection, and profile views.
- **Backend/Data Layer:** Powered by Supabase (PostgreSQL) for authentication, database operations, and serverless functions.
- **Third-Party APIs:**
  - Attio CRM API – for customer management
  - Stripe API – for secure payments
- **Hosting:** Can be deployed on [Vercel](https://vercel.com), [Netlify](https://www.netlify.com), or other static hosts. Supabase handles the backend services.

---

## ⚙️ Installation

### Step 1: Clone the repository
```bash
git clone https://github.com/Unboxme
cd Unboxme
```

### Step 2: Install dependencies
```bash
npm install
```

### Step 3: Set environment variables
Create a `.env.local` file and add the following:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
ATTIO_API_KEY=your_attio_api_key
STRIPE_SECRET_KEY=your_stripe_secret
```

### Step 4: Run the app
```bash
npm run dev      # Start development server
npm run build    # Build for production
```

---

## 📜 License

This project uses the **MIT License** (please confirm).

All third-party packages are used under compatible open-source licenses (MIT, ISC, Apache 2.0).

---

## 📚 Libraries Used

| Library                  | Version | Purpose                |
|--------------------------|---------|------------------------|
| react                    | 18.x    | Frontend library       |
| vite                     | 4.x     | Frontend build tool    |
| eslint                   | 8.x     | Linting                |
| @supabase/supabase-js    | 2.x     | Supabase client        |
| react-router-dom         | 6.x     | Routing                |
| stripe                   | 12.x    | Payment integration    |

---

## 🔌 APIs / SDKs

### Attio CRM API
- **Source:** [https://attio.com](https://attio.com)  
- **Version:** Unspecified (used via custom HTTP requests)

### Stripe API
- **Source:** [https://stripe.com/docs/api](https://stripe.com/docs/api)  
- **Version:** 2022-08-01

### Supabase SDK
- **Source:** [https://supabase.com/docs](https://supabase.com/docs)  
- **Version:** 2.x (`@supabase/supabase-js`)

---

## 📬 Contact

For deployment or handoff questions, please reach out to:

**Sponsor:** Moshe Scheiner  
📧 moshe@unboxme.com
