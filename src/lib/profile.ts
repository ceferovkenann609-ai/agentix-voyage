import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Profile = {
  id: string;
  full_name: string | null;
  company: string | null;
  phone: string | null;
  avatar_url: string | null;
};

export function useProfile(userId: string | undefined) {
  return useQuery({
    queryKey: ["profile", userId],
    enabled: !!userId,
    queryFn: async (): Promise<Profile | null> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, company, phone, avatar_url")
        .eq("id", userId!)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useUpdateProfile(userId: string | undefined) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (patch: Partial<Omit<Profile, "id">>) => {
      if (!userId) throw new Error("Sessiya tapılmadı — yenidən daxil olun.");
      const { error } = await supabase
        .from("profiles")
        .upsert({ id: userId, ...patch }, { onConflict: "id" });
      if (error) throw error;
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["profile", userId] });
    },
  });
}
