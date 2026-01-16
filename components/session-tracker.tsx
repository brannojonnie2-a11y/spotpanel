'use client';

import { useSession } from "@/hooks/use-session";

export function SessionTracker() {
  useSession();
  return null;
}
