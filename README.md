# Ride24/7

Ride24/7 is a mobile app for **motorcyclists who ride in groups**. It helps riders **plan rides, organize the group, and navigate together**—without relying on messy chat threads and scattered location pins.

## Problem statement

Group rides usually break down because the coordination tools are fragmented:

- Plans live in WhatsApp/Instagram messages and get lost.
- Meeting points, intermediate stops, and the final destination aren’t structured.
- Riders join late and don’t know the latest plan.
- There’s no consistent place to see **upcoming rides**, **join**, and **start navigation**.

## How Ride24/7 solves it

Ride24/7 brings ride coordination into one structured flow:

- **Home** shows quick actions and your upcoming rides.
- **Rides** lets you create rides, browse public rides, and join them.
- **Create Ride** captures the key trip details (start time, start location, stops, final stop) and generates an **invite code** to share.
- **Map** is the place for ride/navigation UI (live riding features will be added step-by-step).
- **Garage** manages your motorcycles (basic UI now; persistence comes later).
- **Profile** shows rider identity, stats, and settings.

## Current features (MVP foundation)

### Authentication
- Firebase Auth with **Email/Password**
- Google Sign-In UI + flow scaffolding (Expo Go friendly)
- Phone OTP screen placeholder (full OTP needs an EAS/dev build later)

### Rides (Firestore-backed)
- Create a ride (stored in Firestore `rides` collection)
- Optional **stops** + **final stop**
- Generates an **invite code** (stored with the ride; join-by-code UI comes next)
- See:
  - **Upcoming** rides you created/joined
  - **Discover** public rides you can join

### Navigation structure
Bottom tabs in this order:

`Home` → `Rides` → `Map` → `Garage` → `Profile`

## Tech stack

- **Expo (React Native)** + TypeScript
- **Expo Router** for navigation
- **Zustand** for app state
- **Firebase**
  - Auth
  - Firestore
- **@react-native-community/datetimepicker** for date/time selection

## Environment setup (important)

Firebase config is loaded from environment variables (not committed).

1. Copy `.env.example` to `.env`
2. Fill values:
   - `EXPO_PUBLIC_FIREBASE_API_KEY`
   - `EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `EXPO_PUBLIC_FIREBASE_PROJECT_ID`
   - `EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `EXPO_PUBLIC_FIREBASE_APP_ID`
   - `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`

## Run locally

```bash
npm install
npm run start
```

Then scan the QR with Expo Go.

## Roadmap (next steps)

- Join ride by **invite code**
- Ride details screen (route preview, riders list)
- Firestore security rules + roles
- Map routing + navigation (MapLibre/OSM/OSRM)
- Live group ride tracking + safety features

