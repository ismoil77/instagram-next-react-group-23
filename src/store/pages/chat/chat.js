import { create } from "zustand";

export const useChatStore = create((set, get) => ({
  chats: [],
  profile: null,
  users: [],
  loading: false,
  error: null,

  getChats: async () => {
    set({ loading: true, error: null });
    try {
      let token = null;
      if (typeof window !== "undefined") {
        try {
          token = localStorage.getItem("access_token");
        } catch (e) {
          console.error("Ошибка чтения токена:", e);
        }
      }

      const res = await fetch("http://37.27.29.18:8003/Chat/get-chats", {
        method: "GET",
        headers: { accept: "*/*", Authorization: token ? `Bearer ${token}` : "" },
      });

      if (!res.ok) throw new Error("Failed to fetch chats");

      const result = await res.json();
      set({ chats: result.data || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  getProfile: async () => {
    set({ loading: true, error: null });
    try {
      let token = null;
      if (typeof window !== "undefined") {
        try {
          token = localStorage.getItem("access_token");
        } catch (e) {
          console.error("Ошибка чтения токена:", e);
        }
      }

      const res = await fetch("http://37.27.29.18:8003/UserProfile/get-my-profile", {
        method: "GET",
        headers: { accept: "*/*", Authorization: token ? `Bearer ${token}` : "" },
      });

      if (!res.ok) throw new Error("Failed to fetch profile");

      const result = await res.json();
      set({ profile: result.data, loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  getUsers: async () => {
    set({ loading: true, error: null });
    try {
      let token = null;
      if (typeof window !== "undefined") {
        try {
          token = localStorage.getItem("access_token");
        } catch (e) {
          console.error("Ошибка чтения токена:", e);
        }
      }

      const res = await fetch("http://37.27.29.18:8003/User/get-users?PageSize=500", {
        method: "GET",
        headers: { accept: "*/*", Authorization: token ? `Bearer ${token}` : "" },
      });

      if (!res.ok) throw new Error("Failed to fetch users");

      const result = await res.json();
      set({ users: result.data || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  deleteChat: async (chatId) => {
    set({ loading: true, error: null });
    try {
      let token = null;
      if (typeof window !== "undefined") {
        try {
          token = localStorage.getItem("access_token");
        } catch (e) {
          console.error("Ошибка чтения токена:", e);
        }
      }

      const res = await fetch(
        `http://37.27.29.18:8003/Chat/delete-chat?chatId=${chatId}`,
        {
          method: "DELETE",
          headers: { accept: "*/*", Authorization: token ? `Bearer ${token}` : "" },
        }
      );

      if (!res.ok) throw new Error("Failed to delete chat");

      set({
        chats: get().chats.filter((c) => c.id !== chatId),
        loading: false,
      });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createChat: async (receiverUserId) => {
    set({ loading: true, error: null });
    try {
      let token = null;
      if (typeof window !== "undefined") {
        try {
          token = localStorage.getItem("access_token");
        } catch (e) {
          console.error("Ошибка чтения токена:", e);
        }
      }

      const res = await fetch(
        `http://37.27.29.18:8003/Chat/create-chat?receiverUserId=${receiverUserId}`,
        {
          method: "POST",
          headers: { accept: "*/*", Authorization: token ? `Bearer ${token}` : "" },
        }
      );

      if (!res.ok) throw new Error("Failed to create chat");

      const result = await res.json();

      await get().getChats();

      return result.data;
    } catch (err) {
      set({ error: err.message, loading: false });
      throw err;
    } finally {
      set({ loading: false });
    }
  },
}));
