# SubTracker — Frontend

Aplikacja do zarządzania subskrypcjami. Umożliwia śledzenie wydatków na subskrypcje z obsługą wielu walut, raportowaniem i trybem demo bez rejestracji.

**Backend:** [Subscription-backend](https://github.com/Spoki87/Subscription-backend) (Spring Boot, Java 17, PostgreSQL, Redis)

---

## Stack

- **React 19** + **Vite 8**
- **React Router v7**
- **Axios** — komunikacja z API
- **Recharts** — wykresy w raportach

---

## Uruchomienie

```bash
npm install
npm run dev
```

Zmienna środowiskowa (opcjonalna — jeśli frontend i backend są na tym samym hoście):

```env
VITE_API_URL=http://localhost:8080
```

Jeśli `VITE_API_URL` nie jest ustawiona, requesty trafiają na ten sam origin (proxy Vite).

---

## Funkcje

### Autoryzacja
- Rejestracja z potwierdzeniem emaila
- Logowanie / wylogowanie z JWT (access + refresh token)
- Automatyczne odświeżanie tokena
- Reset hasła przez email
- Ponowne wysłanie linku aktywacyjnego (gdy konto nieaktywne)
- Komunikaty błędów w języku polskim

### Dashboard
- Lista subskrypcji z podziałem na miesięczne i roczne
- Dodawanie, edytowanie, usuwanie subskrypcji
- Obsługa walut: PLN, USD, EUR z automatycznym przeliczaniem (NBP API po stronie backendu)
- Suma miesięcznych wydatków w nagłówku

### Raporty
- Wykresy wydatków (Recharts)

### Profil
- Zmiana hasła
- Zmiana preferowanej waluty wyświetlania

### Tryb demo (`/demo`)
- Dostępny bez rejestracji — przycisk „Wypróbuj bez rejestracji" na stronie logowania
- Dane tylko w pamięci przeglądarki (znikają po odświeżeniu)
- Obsługa wyłącznie PLN
- Pełne dodawanie / edytowanie / usuwanie w lokalnym stanie

---

## Struktura projektu

```
src/
├── api/
│   ├── axiosClient.js       # Axios + interceptory (refresh token, auth)
│   ├── authApi.js           # login, refresh, logout
│   ├── userApi.js           # register, confirm, changePassword, changeCurrency, resendConfirmation
│   └── subscriptionApi.js   # CRUD subskrypcji
├── context/
│   └── AuthContext.jsx      # Globalny stan użytkownika
├── components/
│   ├── Layout.jsx           # Nawigacja + wrapper strony
│   ├── ProtectedRoute.jsx   # Ochrona tras wymagających logowania
│   └── SubscriptionModal.jsx
├── pages/
│   ├── LoginPage.jsx
│   ├── RegisterPage.jsx
│   ├── ConfirmEmailPage.jsx
│   ├── ForgotPasswordPage.jsx
│   ├── DashboardPage.jsx
│   ├── ProfilePage.jsx
│   ├── ReportsPage.jsx
│   └── DemoPage.jsx         # Tryb demo (bez API)
└── App.jsx                  # Routing
```

---

## Trasy

| Ścieżka | Dostęp | Opis |
|---|---|---|
| `/login` | publiczna | Logowanie |
| `/register` | publiczna | Rejestracja |
| `/register/confirm` | publiczna | Potwierdzenie emaila |
| `/forgot-password` | publiczna | Reset hasła |
| `/demo` | publiczna | Tryb demo |
| `/dashboard` | zalogowany | Lista subskrypcji |
| `/profile` | zalogowany | Profil użytkownika |
| `/reports` | zalogowany | Raporty |
