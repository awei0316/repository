// src/pages/UserCommunity.js
import React, { useState, useEffect } from 'react';
import { FaComments, FaThumbsUp, FaComment } from 'react-icons/fa';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';

const UserCommunity = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    // 模拟从后端获取帖子数据
    const fetchPosts = () => {
        // 这里可以替换为实际的 API 请求
        setTimeout(() => {
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
        }, 500);
    };

    useEffect(() => {
        if (page === 1) {
            // 首次加载时清空原有帖子
            setPosts([]);
        }
        fetchPosts();
    }, [page]);

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
        if (hasMore) {
            setPage(prevPage => prevPage + 1);
        }
    };

    return (
        <div className="container user-community-container">
            <h1><FaComments /> 用户社区</h1>
            <form onSubmit={handleSubmit}>
                <InputField
                    type="textarea"
                    placeholder="分享您的贸易经验..."
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                />
                <Button type="submit">发布</Button>
            </form>

            <div className="posts">
                {posts.map(post => (
                    <div key={post.id}>
                        <Card>
                            <p>{post.content}</p>
                            <small>{post.date}</small>
                            <div className="post-actions">
                                <span onClick={() => handleLike(post.id)}>
                                    <FaThumbsUp /> {post.likes}
                                </span>
                                <span onClick={() => handleComment(post.id, '示例评论')}>
                                    <FaComment /> {post.comments.length}
                                </span>
                            </div>
                            {post.comments.length > 0 && (
                                <div className="post-comments">
                                    {post.comments.map((comment, commentIndex) => (
                                        <p key={commentIndex}>{comment}</p>
                                    ))}
                                </div>
                            )}
                        </Card>
                    </div>
                ))}
            </div>
            {hasMore && (
                <Button onClick={handleLoadMore}>加载更多</Button>
            )}
        </div>
    );
};

export default UserCommunity;