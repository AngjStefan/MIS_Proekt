# SafeParking

A community-driven parking safety intelligence platform built with **React Native (Expo)**. Report, discover, and vote on parking-related safety issues in your area — displayed on an interactive map with AI-powered duplicate detection.

## Tech Stack

- **Framework:** React Native (Expo SDK 55) with Expo Router
- **Language:** TypeScript
- **Backend:** Supabase (PostgreSQL + Auth)
- **Map:** Leaflet.js / OpenStreetMap via WebView
- **AI:** Google Gemini 2.5 Flash (duplicate report detection)
- **Forms:** react-hook-form + Zod validation
- **Persistence:** AsyncStorage (offline cache, bookmarks)
- **Navigation:** Expo Router (file-based, tabs + stacks)

## Features

- **Explore Map** — Leaflet map with severity-colored markers and automatic clustering (300m radius)
- **Feed** — Scrollable list of reports sorted newest-first
- **Create Report** — Upload photos, set severity (Low/Medium/High/Critical), pick location on map
- **AI Duplicate Detection** — Gemini checks nearby reports for duplicates before submission
- **Voting** — Upvote/downvote reports to surface important issues
- **Bookmarks** — Save reports locally via AsyncStorage
- **User Profile** — Avatar, name editing, password change, report count
- **Authentication** — Email/password via Supabase Auth

## Getting Started

### Prerequisites

- Node.js >= 22.11.0
- Expo CLI (`npx expo`)
- Android Studio or Xcode (for emulators)

### Setup

```sh
git clone https://github.com/AngjStefan/MIS_Proekt
cd MIS_Proekt
npm install
```

### Environment Variables

Copy `.env.example` to `.env` and fill in the values:

| Variable | Description |
|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key |
| `EXPO_PUBLIC_GOOGLE_GEMINI_API_KEY` | Google Gemini API key (for duplicate detection) |

### Running

```sh
npm start        # Start Expo dev server
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run in browser
```

### Lint & Test

```sh
npm run lint
npm run test
```

## Project Structure

```
src/
├── app/              # Expo Router screens
│   ├── (app)/        # Main app tabs (explore, feed, create, profile, bookmark)
│   │   └── post/[id] # Post detail screen
│   └── (auth)/       # Auth screens (login, register, forgot-password)
├── components/       # Reusable UI
│   ├── ui/           # Primitives (button, input, modal, etc.)
│   ├── map/          # Map overlay components
│   ├── feed/         # PostCard component
│   └── navigation/   # CustomTabBar
├── features/         # Feature-level components
│   └── map/          # MapScreen (Leaflet WebView)
├── providers/        # React Context (AuthProvider, PostsProvider)
├── hooks/            # Custom hooks
├── lib/              # Supabase client, Gemini client, utilities
├── types/            # TypeScript types
├── validation/       # Zod schemas
├── constants/        # Map config, icon mappings
└── theme/            # Design tokens (colors, spacing, typography)
```

## Database

Uses a Supabase `report` table with columns: `id`, `title`, `description`, `image_uri`, `latitude`, `longitude`, `location_label`, `severity`, `vote_count`, `created_at`, `author_id`.

## License

See [LICENSE](./LICENSE).
