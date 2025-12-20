# 📈 StockTrail - Real-Time Stock Market Tracking Platform

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![MongoDB](https://img.shields.io/badge/MongoDB-6.0-green?style=for-the-badge&logo=mongodb)
![TailwindCSS](https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwindcss)

**A modern, full-stack stock market tracking application with real-time data, personalized watchlists, and AI-powered email insights.**


</div>

---

## 🌟 Overview

**StockTrail** is a comprehensive stock market tracking platform that empowers users to monitor their favorite stocks, analyze market trends, and receive personalized market insights. Built with cutting-edge technologies, it combines real-time financial data with intelligent automation to deliver a seamless user experience.


---

## ✨ Features

### 📊 **Market Insights**
- **Real-time Market Overview**: Live market data with interactive TradingView widgets
- **Stock Heatmap**: Visual representation of market performance
- **Top Stories Timeline**: Latest financial news and market updates
- **Market Quotes**: Real-time pricing data for major indices

### 🔍 **Stock Analysis**
- **Detailed Stock Pages**: Comprehensive analysis for individual stocks
  - Candlestick & baseline charts
  - Technical analysis indicators
  - Company financials & profile
  - Real-time price movements
- **Advanced Search**: Smart search with autocomplete for stocks (⌘K / Ctrl+K)
- **Symbol Information**: Live ticker data and price changes

### ⭐ **Personalized Watchlist**
- Add/remove stocks from your personal watchlist
- Real-time price tracking for watched stocks
- Performance metrics (P/E ratio, market cap, % change)
- Sortable table view with comprehensive data

### 🔐 **Authentication & User Management**
- Secure email & password authentication via **Better Auth**
- User profiles with investment preferences
- Protected routes and session management

### 🤖 **AI-Powered Email Automation**
- **Welcome Emails**: Personalized onboarding messages using AI (Gemini)
- **Daily News Summaries**: Automated daily email with curated news
  - Personalized based on your watchlist
  - AI-generated summaries of relevant market news
  - Scheduled via cron jobs (12 PM daily)

### 🎨 **Modern UI/UX**
- Dark mode interface
- Responsive design (mobile, tablet, desktop)
- Smooth animations and transitions
- Intuitive navigation with keyboard shortcuts

---

## 🛠 Tech Stack

### **Frontend**
- **[Next.js 15.5](https://nextjs.org/)** - React framework with App Router
- **[React 19](https://react.dev/)** - UI library
- **[TypeScript](https://www.typescriptlang.org/)** - Type safety
- **[Tailwind CSS 4.0](https://tailwindcss.com/)** - Utility-first CSS
- **[Radix UI](https://www.radix-ui.com/)** - Accessible component primitives
- **[TradingView Widgets](https://www.tradingview.com/widget/)** - Financial charts
- **[React Hook Form](https://react-hook-form.com/)** - Form management
- **[Sonner](https://sonner.emilkowal.ski/)** - Toast notifications

### **Backend**
- **[Next.js API Routes](https://nextjs.org/docs/api-routes/introduction)** - Serverless API
- **[MongoDB](https://www.mongodb.com/)** - NoSQL database
- **[Mongoose](https://mongoosejs.com/)** - MongoDB ODM
- **[Better Auth](https://www.better-auth.com/)** - Authentication solution

### **External APIs & Services**
- **[Finnhub API](https://finnhub.io/)** - Real-time stock market data
- **[Inngest](https://www.inngest.com/)** - Background job scheduling & workflow automation
- **[Google Gemini AI](https://ai.google.dev/)** - AI content generation
- **[Nodemailer](https://nodemailer.com/)** - Email delivery

### **Development Tools**
- **[ESLint](https://eslint.org/)** - Code linting
- **[Turbopack](https://turbo.build/pack)** - Fast bundler (Next.js)
- **Git** - Version control

---

## 🏗 Project Structure

```
stock_market_app/
├── app/                          # Next.js App Router
│   ├── (auth)/                   # Authentication routes
│   │   ├── sign-in/             # Sign in page
│   │   └── sign-up/             # Sign up page
│   ├── (root)/                   # Protected routes
│   │   ├── page.tsx             # Home dashboard
│   │   ├── stocks/[symbol]/     # Dynamic stock detail pages
│   │   └── watchlist/           # User watchlist
│   ├── api/                      # API routes
│   │   └── inngest/             # Inngest webhook handler
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── forms/                   # Form components
│   ├── shared/                  # Shared components (Header, Nav)
│   ├── ui/                      # Reusable UI components (Radix)
│   ├── SearchCommand.tsx        # Stock search modal
│   ├── TradingViewWidget.tsx    # Chart widget wrapper
│   ├── WatchlistButton.tsx      # Add/remove from watchlist
│   └── WatchlistTable.tsx       # Watchlist data table
├── lib/                          # Utility functions & services
│   ├── actions/                 # Server actions
│   │   ├── auth.actions.ts      # Authentication logic
│   │   ├── finnhub.actions.ts   # Stock data fetching
│   │   ├── user.actions.ts      # User operations
│   │   └── watchlist.actions.ts # Watchlist CRUD
│   ├── better-auth/             # Auth configuration
│   ├── inngest/                 # Background jobs & AI prompts
│   ├── nodemailer/              # Email templates & sending
│   ├── constants.ts             # App constants
│   └── utils.ts                 # Helper functions
├── database/                     # Database layer
│   ├── models/                  # Mongoose models
│   │   └── watchlist.model.ts
│   └── mongoose.ts              # DB connection
├── types/                        # TypeScript type definitions
├── hooks/                        # Custom React hooks
├── middleware/                   # Next.js middleware
├── public/                       # Static assets
├── .env.example                 # Environment variables template
└── package.json                 # Dependencies & scripts
```

---

## 🚀 Getting Started

### **Prerequisites**
- **Node.js** (v20 or higher)
- **npm** or **yarn** or **pnpm**
- **MongoDB** instance (local or cloud)
- **Finnhub API Key** ([Get one here](https://finnhub.io/))
- **Gemini API Key** ([Get one here](https://ai.google.dev/))

### **Installation**

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/stock_market_app.git
   cd stock_market_app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Create a `.env` file in the root directory:
   ```bash
   cp .env.example .env
   ```
   
   Fill in the required values:
   ```env
   # App Environment
   NODE_ENV=development

   # Next.js
   NEXT_PUBLIC_BASE_URL=http://localhost:3000

   # MongoDB
   MONGODB_URI=your_mongodb_connection_string

   # Better Auth
   BETTER_AUTH_SECRET=your_secret_key_here
   BETTER_AUTH_URL=http://localhost:3000

   # Gemini AI
   GEMINI_API_KEY=your_gemini_api_key

   # Nodemailer (Gmail example)
   NODEMAILER_EMAIL=your_email@gmail.com
   NODEMAILER_PASSWORD=your_app_password

   # Finnhub
   FINNHUB_BASE_URL=https://finnhub.io/api/v1
   NEXT_PUBLIC_FINNHUB_API_KEY=your_finnhub_api_key
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:3000]

---

## 📜 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run test:db` | Test MongoDB connection |

---

## 🔑 Key Features Implementation

### **Real-Time Stock Data**
Uses Finnhub API with intelligent caching strategies:
- Market data: revalidated every 5 minutes
- Stock profiles: cached for 1 hour
- Company financials: cached for 30 minutes

### **AI-Powered Emails**
Leverages Google Gemini AI for:
- Personalized welcome messages based on user profile
- Daily news summaries tailored to watchlist stocks
- Contextual investment insights

### **Background Jobs**
Inngest handles:
- **Sign-up emails**: Triggered on user registration
- **Daily news digest**: Cron job at 12 PM daily
- **Graceful error handling** and retry logic

### **Optimized Performance**
- Server-side rendering (SSR) for SEO
- React Server Components for reduced client bundle
- Image optimization with Next.js Image
- Code splitting and lazy loading

---

## 🔐 Authentication Flow

1. **Sign Up**: Users create account with email, password, and investment preferences
2. **Welcome Email**: AI-generated personalized email sent via Inngest
3. **Sign In**: Secure session management via Better Auth
4. **Protected Routes**: Middleware guards authenticated pages

---

## 📧 Email Automation

### **Welcome Email**
- Triggered on user sign-up
- Personalized intro based on user profile (country, risk tolerance, investment goals)
- Generated by Gemini AI

### **Daily News Summary**
- Scheduled via cron (12 PM daily)
- Fetches news for user's watchlist symbols
- AI summarizes top 6 relevant articles
- Sent to all registered users

---

## 🎨 UI Components

Built with **Radix UI** and **Tailwind CSS** for:
- **Accessibility**: ARIA-compliant components
- **Customization**: Fully themeable
- **Consistency**: Design system with reusable primitives

Key components:
- `SearchCommand`: Keyboard-accessible stock search (⌘K)
- `TradingViewWidget`: Embeddable financial charts
- `WatchlistTable`: Sortable, responsive data table
- `WatchlistButton`: Toggle star icon with optimistic updates

---

## 🌐 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/inngest` | POST | Inngest webhook handler |
| `/api/better-auth/*` | * | Authentication endpoints (handled by Better Auth) |

*Most data fetching uses Next.js Server Actions for type-safe, server-side operations.*

---

## 🧪 Testing

Run database connection test:
```bash
npm run test:db
```

---

## 📈 Future Enhancements

- [ ] Portfolio tracking with buy/sell transactions
- [ ] Price alerts via email/SMS
- [ ] Social features (share watchlists)
- [ ] Advanced charting tools
- [ ] Options and crypto support
- [ ] Mobile app (React Native)
- [ ] Multi-language support

---

## 👨‍💻 Author

**Your Name**
- LinkedIn: TBA
- Portfolio: TBA

---

## 🙏 Acknowledgments

- [TradingView](https://www.tradingview.com/) for financial widgets
- [Finnhub](https://finnhub.io/) for market data API
- [Vercel](https://vercel.com/) for Next.js and deployment
- [Better Auth](https://www.better-auth.com/) for authentication
- [Inngest](https://www.inngest.com/) for workflow automation

---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ and ☕

</div>
