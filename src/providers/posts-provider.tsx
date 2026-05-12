import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Post } from '@/types/post';
import { supabase } from '@/lib/supabase';

interface PostsContextType {
  posts: Post[];
  bookmarkedPosts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'voteCount'>) => Promise<void>;
  upvotePost: (postId: string) => void;
  downvotePost: (postId: string) => void;
  deletePost: (postId: string) => Promise<void>;
  loadPosts: () => Promise<void>;
  toggleBookmark: (post: Post) => void;
  isBookmarked: (postId: string) => boolean;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 9);
};

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [bookmarkedPosts, setBookmarkedPosts] = useState<Post[]>([]);

  const loadBookmarks = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('bookmarked_posts');
      if (stored) {
        setBookmarkedPosts(JSON.parse(stored));
      }
    } catch (error) {
      console.warn('Failed to load bookmarks:', error);
    }
  }, []);

  const loadPosts = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('report')
        .select('*')
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        const cached = await AsyncStorage.getItem('cached_posts');
        if (cached) {
          setPosts(JSON.parse(cached));
        }
        return;
      }

      const formattedPosts = data.map((p: any) => ({
        id: p.id,
        title: p.title,
        description: p.description,
        imageUri: p.image_uri || undefined,
        latitude: p.latitude,
        longitude: p.longitude,
        locationLabel: p.location_label,
        severity: p.severity,
        voteCount: p.vote_count || 0,
        createdAt: p.created_at,
        authorId: p.author_id,
      }));
      setPosts(formattedPosts);
      await AsyncStorage.setItem('cached_posts', JSON.stringify(formattedPosts));
    } catch (error) {
      const cached = await AsyncStorage.getItem('cached_posts');
      if (cached) {
        setPosts(JSON.parse(cached));
      }
    }
  }, []);

  const addPost = useCallback(async (postData: Omit<Post, 'id' | 'createdAt' | 'voteCount'>) => {
    const newPost: Post = {
      ...postData,
      id: generateId(),
      createdAt: new Date().toISOString(),
      voteCount: 0,
    };

    setPosts((prev) => {
      const updated = [newPost, ...prev];
      AsyncStorage.setItem('cached_posts', JSON.stringify(updated));
      return updated;
    });

    try {
      const { error } = await supabase.from('report').insert({
        id: newPost.id,
        title: newPost.title,
        description: newPost.description,
        image_uri: newPost.imageUri || null,
        latitude: newPost.latitude,
        longitude: newPost.longitude,
        location_label: newPost.locationLabel,
        severity: newPost.severity,
        vote_count: newPost.voteCount,
        author_id: newPost.authorId,
      });

      if (error) {
        console.warn('Supabase save error:', error);
      }
    } catch (error) {
      console.warn('Failed to save to Supabase:', error);
    }
  }, []);

  const upvotePost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, voteCount: post.voteCount + 1 } : post
      )
    );
  }, []);

  const downvotePost = useCallback((postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId ? { ...post, voteCount: post.voteCount - 1 } : post
      )
    );
  }, []);

  const deletePost = useCallback(async (postId: string) => {
    setPosts((prev) => {
      const updated = prev.filter((p) => p.id !== postId);
      AsyncStorage.setItem('cached_posts', JSON.stringify(updated));
      return updated;
    });
    setBookmarkedPosts((prev) => {
      const updated = prev.filter((p) => p.id !== postId);
      AsyncStorage.setItem('bookmarked_posts', JSON.stringify(updated));
      return updated;
    });

    try {
      await supabase.from('report').delete().eq('id', postId);
    } catch (error) {
      console.warn('Failed to delete from Supabase:', error);
    }
  }, []);

  const toggleBookmark = useCallback((post: Post) => {
    setBookmarkedPosts((prev) => {
      const isAlreadyBookmarked = prev.some((p) => p.id === post.id);
      const updated = isAlreadyBookmarked
        ? prev.filter((p) => p.id !== post.id)
        : [...prev, post];
      AsyncStorage.setItem('bookmarked_posts', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const isBookmarked = useCallback((postId: string) => {
    return bookmarkedPosts.some((p) => p.id === postId);
  }, [bookmarkedPosts]);

  useEffect(() => {
    loadPosts();
    loadBookmarks();
  }, []);

  return (
    <PostsContext.Provider
      value={{
        posts,
        bookmarkedPosts,
        addPost,
        upvotePost,
        downvotePost,
        deletePost,
        loadPosts,
        toggleBookmark,
        isBookmarked,
      }}
    >
      {children}
    </PostsContext.Provider>
  );
}

export function usePosts() {
  const context = useContext(PostsContext);
  if (!context) {
    throw new Error('usePosts must be used within a PostsProvider');
  }
  return context;
}