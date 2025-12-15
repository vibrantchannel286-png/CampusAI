# CampusAI.ng

**Your Campus, Smarter** - A Next.js 14 website that automatically collects, summarizes, and displays the latest updates from all Nigerian universities and JAMB using Gemini AI.

## 🌟 Features

- 🏠 **Homepage** with category tabs (Federal, State, Private, JAMB Updates) and search functionality
- 🎓 **University Pages** - Dynamic pages for all 200+ Nigerian universities
- 🧾 **JAMB Updates Page** - Official JAMB updates with countdown timers
- 💬 **AI Chatbot** - Powered by Gemini AI to answer questions about universities and JAMB
- 📱 **Fully Responsive** - Beautiful, modern UI with TailwindCSS
- 🔔 **Email Subscriptions** - Users can subscribe for university update alerts
- 🤖 **AI Summaries** - All updates are summarized using Gemini AI

## 🚀 Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **AI**: Google Gemini AI (Free tier)
- **Database**: Firebase Firestore (Free tier)
- **Styling**: TailwindCSS
- **Deployment**: Vercel (Free tier)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd CampusAI-1
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `env.example.txt` to `.env.local`:
   ```bash
   cp env.example.txt .env.local
   ```
   Or manually create `.env.local` and copy the contents from `env.example.txt`
   
   Fill in your API keys:
   - **Gemini API Key**: Get a free API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
   - **Firebase Config**: Get your Firebase config from [Firebase Console](https://console.firebase.google.com)

4. **Set up Firebase**
   
   - Create a new Firebase project
   - Enable Firestore Database
   - Copy your Firebase config to `.env.local`
   - Create a `subscribers` collection in Firestore (it will be created automatically on first subscription)

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
CampusAI-1/
├── components/          # React components
│   ├── CategoryTabs.tsx
│   ├── NewsCard.tsx
│   ├── SearchBar.tsx
│   └── Chatbot.tsx
├── lib/                # Utilities and data
│   ├── firebase.ts     # Firebase configuration
│   ├── gemini.ts       # Gemini AI functions
│   ├── fetchUpdates.ts # Data fetching functions
│   ├── universities.json
│   └── jamb.json
├── pages/              # Next.js pages
│   ├── api/
│   │   └── chat.ts     # Chatbot API endpoint
│   ├── school/
│   │   └── [slug].tsx  # Dynamic university pages
│   ├── _app.tsx
│   ├── index.tsx       # Homepage
│   └── jamb.tsx        # JAMB updates page
├── styles/
│   └── globals.css     # Global styles with Tailwind
└── package.json
```

## 🎨 Design

- **Primary Color**: Green (#008751)
- **Accent Color**: Gold (#FFD700)
- **Background**: White (#FFFFFF)
- Fully responsive design with mobile optimization

## 🌍 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository
   - Add environment variables from `.env.local`
   - Click "Deploy"

3. **Your site will be live!**

### Firebase Hosting (Alternative)

```bash
npm run build
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 💡 Key Features Explained

### AI Summarization
All university and JAMB updates are automatically summarized using Gemini AI to provide concise, readable summaries (2-3 sentences).

### Chatbot
The floating chatbot (bottom-right corner) can answer questions about:
- University information
- JAMB registration dates
- Exam schedules
- Admission processes
- And more!

### Email Subscriptions
Users can subscribe to receive email alerts when their chosen university posts new updates. Subscriptions are stored in Firebase Firestore.

### Search & Filter
- Search across all updates by keywords
- Filter by category (Federal, State, Private, JAMB)
- Real-time filtering without page reloads

## 🔧 Configuration

### Adding More Universities
Edit `lib/universities.json` to add more universities:
```json
{
  "name": "University Name",
  "slug": "university-slug",
  "category": "Federal|State|Private",
  "url": "https://university-website.com"
}
```

### Updating JAMB Data
Edit `lib/jamb.json` to add new JAMB updates:
```json
{
  "id": "unique-id",
  "title": "Update Title",
  "date": "2026-01-15",
  "summary": "Brief summary",
  "fullText": "Full text content",
  "category": "Registration|Examination|Results|Admission",
  "sourceUrl": "https://jamb.gov.ng",
  "deadline": "2026-03-01"
}
```

## 💸 Monetization Hooks

The platform includes placeholders for:
- Google AdSense ads
- Featured school slots
- Premium alerts (₦500/month) - ready for implementation

## 🆓 Free Tier Services

All services used are on free tiers:
- **Gemini AI**: Free tier includes generous API limits
- **Firebase Firestore**: Free tier includes 1GB storage, 50K reads/day
- **Vercel**: Free tier includes unlimited deployments, 100GB bandwidth
- **TailwindCSS**: Open source, completely free

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions, please open an issue on GitHub.

---

**© 2026 CampusAI.ng - Your Campus, Smarter.**

