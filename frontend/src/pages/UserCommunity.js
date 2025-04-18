// src/pages/UserCommunity.js
import React, { useState, useEffect } from 'react';
import { FaComments, FaThumbsUp, FaComment } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const UserCommunity = () => {
    // 保持原有的状态和函数定义不变
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // 模拟从后端获取帖子数据
    const fetchPosts = async () => {
        // 保持原有逻辑不变
        setIsLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 500));
            const startIndex = (page - 1) * 10;
            const newPosts = Array.from({ length: 10 }, (_, i) => ({
                id: startIndex + i,
                content: `这是第 ${startIndex + i + 1} 条帖子内容`,
                date: new Date().toLocaleDateString(),
                likes: 0,
                comments: [],
                // 模拟用户头像和用户 ID
                avatar: localStorage.getItem('userAvatar') || 'https://via.placeholder.com/50',
                userId: localStorage.getItem('userId') || '1'
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
        // 保持原有逻辑不变
        e.preventDefault();
        if (newPost.trim()) {
            const newPostObj = {
                id: posts.length,
                content: newPost,
                date: new Date().toLocaleDateString(),
                likes: 0,
                comments: [],
                // 获取用户头像和用户 ID
                avatar: localStorage.getItem('userAvatar') || 'https://via.placeholder.com/50',
                userId: localStorage.getItem('userId') || '1'
            };
            setPosts([newPostObj, ...posts]);
            setNewPost('');
        }
    };

    const handleLike = (postId) => {
        // 保持原有逻辑不变
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId ? { ...post, likes: post.likes + 1 } : post
            )
        );
    };

    const handleComment = (postId, comment) => {
        // 保持原有逻辑不变
        setPosts(prevPosts =>
            prevPosts.map(post =>
                post.id === postId
                   ? { ...post, comments: [...post.comments, comment] }
                    : post
            )
        );
    };

    const handleLoadMore = () => {
        // 保持原有逻辑不变
        if (hasMore && !isLoading) {
            setPage(prevPage => prevPage + 1);
            fetchPosts();
        }
    };

    const handleAvatarClick = (userId) => {
        // 保持原有逻辑不变
        navigate(`/profile/${userId}`);
    };

    return (
        <div className="container mx-auto p-8 bg-gradient-to-br from-teal-50 to-cyan-100 min-h-screen">
            <h1 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-700 to-cyan-700 mb-6">
                <FaComments className="inline-block mr-3" /> 用户社区
            </h1>
            <form onSubmit={handleSubmit} className="bg-white p-12 rounded-3xl shadow-2xl mb-8 transition-transform hover:scale-105 duration-300">
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-5 mb-5 focus:ring-teal-500 focus:border-teal-500 text-lg"
                    placeholder="分享您的贸易经验..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-gradient-to-r from-teal-700 to-cyan-700 text-white py-4 px-8 rounded-lg hover:from-teal-800 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 text-lg"
                >
                    发布
                </button>
            </form>

            <div className="posts space-y-6">
                {posts.map(post => (
                    <div
                        key={post.id}
                        className="bg-white p-8 rounded-3xl shadow-2xl hover:shadow-4xl transition-shadow duration-300"
                    >
                        <div className="flex items-center mb-3">
                            <img
                                src={post.avatar}
                                alt="User Avatar"
                                className="w-10 h-10 rounded-full mr-3 cursor-pointer avatar-hover"
                                onClick={() => handleAvatarClick(post.userId)}
                            />
                            <span
                                className="text-gray-800 text-lg leading-relaxed cursor-pointer name-hover"
                                onClick={() => handleAvatarClick(post.userId)}
                            >
                                用户 {post.userId}
                            </span>
                        </div>
                        <p className="text-gray-800 text-lg leading-relaxed mt-2">{post.content}</p>
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
                    <p className="text-center text-gray-600">正在加载更多帖子...</p>
                )}
                {error && (
                    <p className="text-center text-red-600">{error}</p>
                )}
            </div>
            {hasMore && (
                <button
                    onClick={handleLoadMore}
                    className="block mx-auto bg-gradient-to-r from-teal-700 to-cyan-700 text-white py-3 px-6 rounded-lg hover:from-teal-800 hover:to-cyan-800 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 mt-8"
                >
                    加载更多
                </button>
            )}
        </div>
    );
};

export default UserCommunity;