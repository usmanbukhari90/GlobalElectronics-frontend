"use client";

import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { supabaseClient } from "./supabaseClient";

export function useCustomerAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabaseClient.auth.signOut();
  }

  return { user, loading, signOut };
}