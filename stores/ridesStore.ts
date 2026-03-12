import { create } from 'zustand';
import {
  addDoc,
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  Timestamp,
  updateDoc,
  where,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';
import type { User } from '@/stores/authStore';

export interface Ride {
  id: string;
  title: string;
  creatorId: string;
  creatorName: string;
  startTime: Date | null;
  startLocationName: string;
  distanceKm?: number;
  maxRiders?: number;
  riderIds: string[];
  isPublic: boolean;
  stops?: string[];
  finalStop?: string;
  inviteCode?: string;
}

interface RidesState {
  upcoming: Ride[];
  discover: Ride[];
  isLoading: boolean;
  error: string | null;
  refreshForUser: (user: User) => Promise<void>;
  createRide: (
    user: User,
    data: {
      title: string;
      startTime: Date | null;
      startLocationName: string;
      isPublic: boolean;
      stops: string[];
      finalStop: string;
      inviteCode: string;
    },
  ) => Promise<void>;
  joinRide: (rideId: string, user: User) => Promise<void>;
}

function mapRideDoc(snap: any): Ride {
  const data = snap.data();

  const ts: Timestamp | undefined = data.startTime;
  return {
    id: snap.id,
    title: data.title ?? 'Ride',
    creatorId: data.creatorId,
    creatorName: data.creatorName ?? 'Rider',
    startTime: ts ? ts.toDate() : null,
    startLocationName: data.startLocationName ?? '',
    distanceKm: typeof data.distanceKm === 'number' ? data.distanceKm : undefined,
    maxRiders: typeof data.maxRiders === 'number' ? data.maxRiders : undefined,
    riderIds: Array.isArray(data.riderIds) ? data.riderIds : [],
    isPublic: Boolean(data.isPublic),
    stops: Array.isArray(data.stops) ? data.stops : undefined,
    finalStop: typeof data.finalStop === 'string' ? data.finalStop : undefined,
    inviteCode: typeof data.inviteCode === 'string' ? data.inviteCode : undefined,
  };
}

export const useRidesStore = create<RidesState>((set, get) => ({
  upcoming: [],
  discover: [],
  isLoading: false,
  error: null,

  refreshForUser: async (user) => {
    set({ isLoading: true, error: null });
    try {
      const ridesCol = collection(db, 'rides');

      // Rides created by the user
      const createdQ = query(ridesCol, where('creatorId', '==', user.id));

      // Rides the user has joined
      const joinedQ = query(
        ridesCol,
        where('riderIds', 'array-contains', user.id),
      );

      const [createdSnap, joinedSnap] = await Promise.all([
        getDocs(createdQ),
        getDocs(joinedQ),
      ]);

      const upcomingMap = new Map<string, Ride>();
      createdSnap.forEach((docSnap) => {
        upcomingMap.set(docSnap.id, mapRideDoc(docSnap));
      });
      joinedSnap.forEach((docSnap) => {
        if (!upcomingMap.has(docSnap.id)) {
          upcomingMap.set(docSnap.id, mapRideDoc(docSnap));
        }
      });

      const upcoming = Array.from(upcomingMap.values()).sort((a, b) => {
        if (!a.startTime || !b.startTime) return 0;
        return a.startTime.getTime() - b.startTime.getTime();
      });

      // Discover: public rides user is not in
      const discoverQ = query(ridesCol, where('isPublic', '==', true));
      const discoverSnap = await getDocs(discoverQ);
      const discover: Ride[] = [];
      discoverSnap.forEach((docSnap) => {
        const ride = mapRideDoc(docSnap);
        if (ride.creatorId !== user.id && !ride.riderIds.includes(user.id)) {
          discover.push(ride);
        }
      });

      set({ upcoming, discover, isLoading: false, error: null });
    } catch (e: any) {
      set({
        isLoading: false,
        error: 'Could not load rides. Please try again.',
      });
    }
  },

  createRide: async (user, data) => {
    set({ isLoading: true, error: null });
    try {
      const ridesCol = collection(db, 'rides');

      await addDoc(ridesCol, {
        title: data.title.trim(),
        creatorId: user.id,
        creatorName: user.name,
        startTime: data.startTime ? Timestamp.fromDate(data.startTime) : null,
        startLocationName: data.startLocationName.trim(),
        isPublic: data.isPublic,
        riderIds: [user.id],
        stops: data.stops,
        finalStop: data.finalStop.trim(),
        inviteCode: data.inviteCode,
        createdAt: serverTimestamp(),
      });

      await get().refreshForUser(user);
    } catch (e: any) {
      set({
        isLoading: false,
        error: 'Could not create ride. Please try again.',
      });
    }
  },

  joinRide: async (rideId, user) => {
    set({ isLoading: true, error: null });
    try {
      const ref = doc(db, 'rides', rideId);
      await updateDoc(ref, {
        riderIds: arrayUnion(user.id),
      });
      await get().refreshForUser(user);
    } catch (e: any) {
      set({
        isLoading: false,
        error: 'Could not join ride. Please try again.',
      });
    }
  },
}));

