# Go-to-Fitness

A personalised fitness web app for gyms — workout plans, diet guidance, weekly milestones, and a full gym admin panel. Built with React + Vite + Tailwind CSS. Currently runs entirely on localStorage (no backend required to run locally).

---

## Features

### Member App
- **Onboarding** — collects age, weight, height, experience, goals, diet preference, health conditions
- **Dashboard** — tabbed layout with Overview, Workout Plan, Diet Plan, Milestones, Protein Tracker, Records, Profile
- **Workout Plan** — auto-generated based on age, experience level, and goal (muscle gain, weight loss, lean, bulk)
- **Diet Plan** — veg/non-veg meal plans with macros (calories, protein, carbs, fat), whey protein toggle
- **Protein Tracker** — daily protein log with food search
- **Milestones** — 5 weekly milestones auto-generated, mark done/undo
- **Records** — weight progress log and BMI tracking
- **Profile** — full user stats, BMI, subscription status, activity summary

### Gym Admin Panel
- **Admin Login** — `/admin` route, hardcoded credentials (see below)
- **Admin Dashboard** — member list, stats (total members, active plans, expired, revenue), search, add user
- **Per-User Management** (`/admin/user/:email`) — 5 tabs:
  - Overview — user info + goals + subscription status
  - Subscription — activate/renew/revoke plan (Monthly/Quarterly/Half Yearly/Yearly)
  - Edit Plan — edit profile + goals, regenerate workout + diet + milestones
  - Workout Editor — inline edit sets/reps/rest per exercise per day
  - Diet Editor — inline edit macros per meal

### Pricing Page
- Public page at `/pricing`
- 4 tiers: Monthly ₹100 · Quarterly ₹200 · Half Yearly ₹400 · Yearly ₹600
- No payment integration — admin activates subscriptions manually

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 (custom `surface` + `brand` color scales) |
| Routing | React Router DOM v6 |
| Icons | Lucide React |
| State | React Context API (`AppContext`) |
| Storage | localStorage (current) |

---

## Project Structure

```
src/
├── App.jsx                        # Routes + guards (RequireAuth, RequireProfile, RequireAdmin)
├── main.jsx
├── index.css                      # Global styles, mobile fixes, utility classes
├── context/
│   └── AppContext.jsx             # Global state: user, profile, goals, plan, milestones, tracking
├── pages/
│   ├── Login.jsx
│   ├── Signup.jsx
│   ├── Onboarding.jsx             # Multi-step form → generates plans on completion
│   ├── Dashboard.jsx              # Shell: Sidebar (desktop) + BottomNav (mobile) + nested routes
│   ├── Profile.jsx                # User profile page
│   ├── Pricing.jsx                # Public pricing page
│   ├── ProteinTracker.jsx
│   └── Records.jsx
│   └── admin/
│       ├── AdminLogin.jsx         # Admin auth + isAdminLoggedIn() + adminLogout() helpers
│       ├── AdminDashboard.jsx     # Member management
│       └── AdminUserEdit.jsx      # Per-user 5-tab editor
├── components/
│   ├── WorkoutPlan.jsx
│   ├── DietPlan.jsx
│   ├── Milestones.jsx
│   ├── BottomNav.jsx
│   ├── Sidebar.jsx
│   └── AppTour.jsx
└── utils/
    ├── workoutGenerator.js        # Generates 7-day workout plan from profile + goals
    ├── dietGenerator.js           # Generates meal plan with macros
    ├── milestoneGenerator.js      # Generates 5 weekly milestones
    ├── targetCalculator.js        # BMI, calorie targets
    ├── proteinData.js             # Food protein database
    ├── exerciseInfo.js            # Exercise descriptions
    └── inspiration.js             # Motivational quotes
```

---

## localStorage Schema

All data is stored in the browser. Keys used:

| Key | Contents |
|-----|----------|
| `gtf_session` | `{ name, email }` — logged-in user session |
| `gtf_users` | `[{ name, email, password }]` — all registered accounts |
| `gtf_user_data` | `{ [email]: { profile, goals, plan, milestones, completedExercises, completedMeals, proteinLog, weightLog, subscription } }` |
| `gtf_admin_session` | `"1"` — admin logged in flag |

---

## Admin Credentials

```
Email:    admin@gotofitness.com
Password: Admin@123
```

> These are hardcoded in `src/pages/admin/AdminLogin.jsx`. Remove the credential hint from the login page before giving to a real gym.

---

## Routes

| Path | Access | Page |
|------|--------|------|
| `/login` | Public | Login |
| `/signup` | Public | Signup |
| `/pricing` | Public | Pricing page |
| `/onboarding` | Auth required | Onboarding form |
| `/dashboard/*` | Auth + Profile required | Main app |
| `/admin` | Public | Admin login |
| `/admin/dashboard` | Admin session required | Admin dashboard |
| `/admin/user/:email` | Admin session required | Per-user editor |

---

## Running Locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173`

```bash
npm run build    # production build → /dist
npm run preview  # preview production build
```

---

## Deployment (Current — Static)

The app is a static React SPA. Deploy the `/dist` folder to any static host:

- **Vercel** — connect GitHub repo, auto-deploys on push
- **Netlify** — same as Vercel
- Add `/* /index.html 200` rewrite rule so React Router works on direct URL access

---

## Planned: Backend Migration

The app is designed to be migrated to a real backend without UI changes. Planned stack:

| Layer | Service |
|-------|---------|
| Frontend | Vercel (same) |
| Backend API | Node.js + Express on Railway |
| Database | Supabase (PostgreSQL) |
| Auth | JWT tokens (replacing localStorage session) |

### Migration path
1. **1–15 gyms** — Railway + Supabase free tier (~$5/month)
2. **15–50 gyms** — Supabase Pro ($25/month) + Railway Pro ($20/month) → ~$45/month
3. **50+ gyms** — Move to AWS (EC2 + RDS) → ~$80/month, zero downtime migration

### Database tables (planned)
```
gyms, users, profiles, goals, workout_plans, diet_plans,
subscriptions, milestones, completed_exercises, completed_meals
```

All tables include `gym_id` for multi-tenant data isolation. Each gym admin sees only their members.

---

## Mobile Support

Full iOS + Android support:
- `viewport-fit=cover` + `user-scalable=no` — prevents zoom, enables safe areas
- `font-size: 16px` on inputs — prevents iOS auto-zoom
- `overflow-x: clip` on html — prevents horizontal scroll without breaking Android fixed positioning
- `env(safe-area-inset-bottom)` — iPhone home indicator + Android gesture nav
- `min-height: 44px` on tap targets — Google's minimum touch target spec
- `.tap-compact` class — overrides min-height for toggle switches

---

## License

MIT
