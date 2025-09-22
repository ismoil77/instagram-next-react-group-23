import axiosRequest from "@/lib/axiosRequest";
import axios from "axios";
import { create } from "zustand";

const isBrowser = typeof window !== "undefined";

export const useData = create((set, get) => ({
  data: [],
  isLoading: false,
  isFetching: false,

  GetReels: async () => {
    const { isFetching } = get();
    if (isFetching) return;
    set({ isLoading: true, isFetching: true });
    try {
      const response = await axiosRequest.get("/Post/get-reels?PageSize=99999");
      const { data } = response;
      set({ data: data.data });
    } catch (error) {
      console.error("Error in GetReels:", error);
    } finally {
      set({ isLoading: false, isFetching: false });
    }
  },

  AddLike: async (id) => {
    set((state) => ({
      data: state.data.map((reel) => {
        if (reel.postId === id) {
          const liked = !reel.postLike;
          return {
            ...reel,
            postLike: liked,
            postLikeCount: liked ? reel.postLikeCount + 1 : reel.postLikeCount - 1,
          };
        }
        return reel;
      }),
    }));

    try {
      await axiosRequest.post(`/Post/like-post?postId=${id}`);
    } catch (error) {
      console.error(error);
    }
  },

  AddView: async (postId) => {
    try {
      await axiosRequest.post(`/Post/view-post?postId=${postId}`);
    } catch (error) {
      console.error(error);
    }
  },

  AddComment: async (comment) => {
    if (!isBrowser) return; // безопасно для SSR
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    const sid = payload?.sid;
    const userName = payload?.name;

    const newComment = {
      postCommentId: Date.now(),
      userId: sid,
      userName,
      userImage: "bfc78865-5de7-449c-8f06-a030a721dc3b.png",
      dateCommented: new Date().toISOString(),
      comment: comment.comment,
    };

    set((state) => ({
      data: (state.data || []).map((post) =>
        post.postId === comment.postId
          ? {
              ...post,
              comments: [...(post.comments || []), newComment],
              commentCount: (post.commentCount || 0) + 1,
            }
          : post
      ),
    }));

    try {
      await axiosRequest.post("/Post/add-comment", {
        postId: comment.postId,
        comment: comment.comment,
      });
    } catch (err) {
      console.error("Ошибка загрузки комментария:", err);
    }
  },

  DeleteCommet: async (Id, reelsId) => {
    set((state) => ({
      data: (state.data || []).map((post) =>
        post.postId === reelsId
          ? {
              ...post,
              comments: post.comments.filter((er) => er.postCommentId !== Id),
              commentCount: (post.commentCount || 0) - 1,
            }
          : post
      ),
    }));
    try {
      await axiosRequest.delete(`/Post/delete-comment?commentId=${Id}`);
    } catch (error) {
      console.error(error);
    }
  },

  FollowToUser: async (userId, isSubscriber) => {
    set((state) => ({
      data: state.data.map((post) =>
        post.userId === userId ? { ...post, isSubscriber: !isSubscriber } : post
      ),
    }));

    if (!isBrowser) return;

    try {
      const token = localStorage.getItem("access_token");
      if (!token) throw new Error("Нет токена авторизации");

      if (isSubscriber) {
        await axiosRequest.delete(
          `/FollowingRelationShip/delete-following-relation-ship?followingUserId=${userId}`
        );
      } else {
        await axiosRequest.post(
          `/FollowingRelationShip/add-following-relation-ship?followingUserId=${userId}`
        );
      }
    } catch (err) {
      console.error("Ошибка обновления подписки:", err);
      set((state) => ({
        data: state.data.map((post) =>
          post.userId === userId ? { ...post, isSubscriber } : post
        ),
      }));
    }
  },

  ToggleFavorite: async (postId) => {
    set((state) => ({
      data: state.data.map((post) =>
        post.postId === postId ? { ...post, postFavorite: !post.postFavorite } : post
      ),
    }));

    if (!isBrowser) return;

    try {
      await axiosRequest.post(`/Post/add-post-favorite`, { postId });
    } catch (err) {
      console.error("Ошибка сохранения поста в избранное:", err);
    }
  },
}));
