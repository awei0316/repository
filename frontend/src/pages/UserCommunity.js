// src/pages/UserCommunity.js
import React, { useState, useEffect } from 'react';
import { FaComments, FaThumbsUp, FaComment } from 'react-icons/fa';

const UserCommunity = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // 模拟从后端获取帖子数据
    const fetchPosts = async () => {
        setIsLoading(true);
        try {
            // 这里可以替换为实际的 API 请求
            await new Promise(resolve => setTimeout(resolve, 500));
            const startIndex = (page - 1) * 10;
            const newPosts = Array.from({ length: 10 }, (_, i) => ({
                id: startIndex + i,
                content: `这是第 ${startIndex + i + 1} 条帖子内容`,
                date: new Date().toLocaleDateString(),
                likes: 0,
                comments: []
            }));
            if (newPosts.length < 10) {
                setHasMore(false);
            }
            setPosts(prevPosts => [...prevPosts, ...newPosts]);
        } catch (err) {
            setError('加载帖子时出现错误，请稍后重试。');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPost.trim()) {
            const newPostObj = {
                id: posts.length,
                content: newPost,
                date: new Date().toLocaleDateString(),
                likes: 0,
                comments: []
            };
            setPosts([newPostObj, ...posts]);
            setNewPost('');
        }
    };

    const handleLike = (postId) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            )
        );
    };

    const handleComment = (postId, comment) => {
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                   ? { ...post, comments: [...post.comments, comment] }
                    : post
            )
        );
    };

    const handleLoadMore = () => {
        if (hasMore && !isLoading) {
            setPage(prevPage => prevPage + 1);
            fetchPosts();
        }
    };

    return (
        <div className="container mx-auto p-8 bg-gradient-to-br from-teal-50 to-cyan-100 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-cyan-700 mb-6">
                <FaComments className="inline-block mr-3" /> 用户社区
            </h1>
            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl shadow-2xl mb-8 transition-transform hover:scale-105 duration-300">
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 mb-5 focus:ring-teal-500 focus:border-teal-500"
                    placeholder="分享您的贸易经验..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-gradient-to-r from-teal-700 to-cyan-700 text-white py-3 px-6 rounded-lg hover:from-teal-800 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2"
                >
                    发布
                </button>
            </form>

            <div className="posts space-y-6">
                {posts.map(post => (
                    <div
                        key={post.id}
                        className="bg-white p-8 rounded-3xl shadow-2xl hover:shadow-4xl transition-shadow duration-300 animate__animated animate__fadeIn"
                    >
                        <p className="text-gray-800 mb-3 text-lg leading-relaxed">{post.content}</p>
                        <small className="text-gray-600">{post.date}</small>
                        <div className="post-actions flex items-center mt-5">
                            <span
                                onClick={() => handleLike(post.id)}
                                className="flex items-center text-gray-600 hover:text-teal-700 cursor-pointer mr-6"
                            >
                                <FaThumbsUp className="mr-2 text-teal-500" /> {post.likes}
                            </span>
                            <span
                                onClick={() => handleComment(post.id, '示例评论')}
                                className="flex items-center text-gray-600 hover:text-teal-700 cursor-pointer"
                            >
                                <FaComment className="mr-2 text-teal-500" /> {post.comments.length}
                            </span>
                        </div>
                        {post.comments.length > 0 && (
                            <div className="post-comments mt-5">
                                {post.comments.map((comment, commentIndex) => (
                                    <p
                                        key={commentIndex}
                                        className="text-gray-700 border-t border-gray-300 pt-3"
                                    >
                                        {comment}
                                    </p>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <p className="text-center text-gray-600 animate__animated animate__fadeIn">正在加载更多帖子...</p>
                )}
                {error && (
                    <p className="text-center text-red-600 animate__animated animate__fadeIn">{error}</p>
                )}
            </div>
            {hasMore && (
                <button
                    onClick={handleLoadMore}
                    className="block mx-auto bg-gradient-to-r from-teal-700 to-cyan-700 text-white py-3 px-6 rounded-lg hover:from-teal-800 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 mt-8 animate__animated animate__fadeIn"
                >
                    加载更多
                </button>
            )}
        </div>
    );
};

export default UserCommunity;