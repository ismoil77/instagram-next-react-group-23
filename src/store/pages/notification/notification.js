import axiosRequest from "@/lib/axiosRequest";
import { create } from "zustand";

export const useSubscribers = create((set, get) => ({
  data: [],
  loading: false,
  error: null,

  getSubscribers: async () => {
    set({ loading: true, error: null });

    try {
      let userId = null;
      if (typeof window !== "undefined") {
        userId = localStorage.getItem("userID");
      }
      if (!userId) {
        set({ loading: false });
        return;
      }

      const { data } = await axiosRequest.get(
        `/FollowingRelationShip/get-subscribers?UserId=${userId}`
      );

      const followedCheckData = await Promise.all(
        data.data.map(async (element) => {
          const resFollow = await axiosRequest.get(
            `/UserProfile/get-is-follow-user-profile-by-id?followingUserId=${element.userShortInfo.userId}`
          );

          return {
            ...element,
            userShortInfo: {
              ...element.userShortInfo,
              isSubscriber: !!resFollow.data.data.isSubscriber,
            },
          };
        })
      );

      set({ data: followedCheckData, loading: false });
    } catch (err) {
      console.error("Ошибка загрузки подписчиков:", err);
      set({ error: "Ошибка загрузки подписчиков", loading: false });
    }
  },

  followToUser: async (userId, isSubscriber) => {
    set((state) => ({
      data: state.data.map((user) =>
        user.userShortInfo.id === userId
          ? {
              ...user,
              userShortInfo: {
                ...user.userShortInfo,
                isSubscriber: !isSubscriber,
              },
            }
          : user
      ),
    }));
    console.log(userId, isSubscriber);

    try {
      if (isSubscriber) {
        // отписка
        await axiosRequest.delete(
          `/FollowingRelationShip/delete-following-relation-ship?followingUserId=${userId}`
        );
        get().getSubscribers();
      } else {
        // подписка
        await axiosRequest.post(
          `/FollowingRelationShip/add-following-relation-ship?followingUserId=${userId}`
        );
        get().getSubscribers();
      }
    } catch (err) {
      console.error("Ошибка обновления подписки:", err);

      // откат если ошибка
      set((state) => ({
        data: state.data.map((user) =>
          user.userShortInfo.id === userId
            ? {
                ...user,
                userShortInfo: {
                  ...user.userShortInfo,
                  isSubscriber, // возвращаем старое значение
                },
              }
            : user
        ),
      }));
    }
  },
}));

export const usePosts = create((set) => ({
  data: [],
  loading: false,
  error: null,

  getPosts: async () => {
    set({ loading: true, error: null });

    try {
      let userId = null;
      if (typeof window !== "undefined") {
        userId = localStorage.getItem("userID");
      }
      if (!userId) {
        set({ loading: false });
        return;
      }

      const { data } = await axiosRequest.get(
        `/Post/get-post-by-id?id=${userId}`
      );
      set({ data: data.data, loading: false });
    } catch (err) {
      console.error("Ошибка загрузки постов:", err);
      set({ error: "Ошибка загрузки постов", loading: false });
    }
  },
}));
