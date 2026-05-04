import React, { createContext, useContext, useState, useCallback } from 'react';
import { Post } from '@/types/post';

interface PostsContextType {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'createdAt' | 'voteCount'>) => void;
}

const PostsContext = createContext<PostsContextType | undefined>(undefined);

export function PostsProvider({ children }: { children: React.ReactNode }) {
  const [posts, setPosts] = useState<Post[]>([]);

  const addPost = useCallback((postData: Omit<Post, 'id' | 'createdAt' | 'voteCount'>) => {
    const newPost: Post = {
      ...postData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      voteCount: 0,
    };
    setPosts((prev) => [newPost, ...prev]);
  }, []);

  return (
    <PostsContext.Provider value={{ posts, addPost }}>
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
