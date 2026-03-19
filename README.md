# SubTracker — Frontend

A subscription management app for tracking recurring expenses with multi-currency support, reporting, and a no-registration demo mode.

**Backend:** [Subscription-backend](https://github.com/Spoki87/Subscription-backend) (Spring Boot, Java 21, PostgreSQL, Redis)

---

## Stack

- **React 19** + **Vite 8**
- **React Router v7**
- **Axios** — API communication
- **Recharts** — charts in reports

---

## Getting Started

```bash
npm install
npm run dev
```

Optional environment variable (if frontend and backend run on different hosts):

```env
VITE_API_URL=http://localhost:8080
```

If `VITE_API_URL` is not set, requests go to the same origin (Vite proxy).

---

## Features

### Authentication
- Registration with email confirmation
- Login / logout with JWT (access + refresh token)
- Automatic token refresh
- Password reset via email
- Resend activation link (when account is inactive)
- Error messages in Polish

### Dashboard
- Subscription list split into monthly and yearly
- Add, edit, delete subscriptions
- Multi-currency support: PLN, USD, EUR with automatic conversion (NBP API on the backend)
- Monthly total displayed in the header

### Reports
- Spending charts (Recharts)

### Profile
- Change password
- Change preferred display currency

### Demo mode (`/demo`)
- Available without registration — "Try without registering" button on the login page
- Data lives only in browser memory (lost on page refresh)
- PLN only
- Full add / edit / delete in local state

---

## Project Structure

```
src/
├── api/
│   ├── axiosClient.js       # Axios instance + interceptors (refresh token, auth)
│   ├── authApi.js           # login, refresh, logout
│   ├── userApi.js           # register, confirm, changePassword, changeCurrency, resendConfirmation
│   └── subscriptionApi.js   # subscription CRUD
├── context/
│   └── AuthContext.jsx      # Global user state
├── components/
│   ├── Layout.jsx           # Navigation + page wrapper
│   ├── ProtectedRoute.jsx   # Guards for authenticated routes
│   └── SubscriptionModal.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ConfirmEmailPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── DashboardPage.jsx
│   ├── ProfilePage.jsx
│   ├── ReportsPage.jsx
│   └── DemoPage.jsx         # Demo mode (no API calls)
└── App.jsx                  # Routing
```

---

## Routes

| Path | Access | Description |
|---|---|---|
| `/login` | public | Login |
| `/register` | public | Registration |
| `/register/confirm` | public | Email confirmation |
| `/forgot-password` | public | Password reset |
| `/demo` | public | Demo mode |
| `/dashboard` | authenticated | Subscription list |
| `/profile` | authenticated | User profile |
| `/reports` | authenticated | Reports |
