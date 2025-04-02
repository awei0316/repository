import React, { useState } from 'react';
import { FaComments } from 'react-icons/fa';

const UserCommunity = () => {
    const [posts, setPosts] = useState([]);
    const [newPost, setNewPost] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (newPost.trim()) {
            setPosts([...posts, { content: newPost, date: new Date().toLocaleDateString() }]);
            setNewPost('');
        }
    };

    return (
        <div className="container">
            <h1><FaComments /> 用户社区</h1>
            <form onSubmit={handleSubmit}>
                <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="分享您的贸易经验..."
                    required
                />
                <button type="submit" className="btn">发布</button>
            </form>

            <div className="posts">
                {posts.map((post, index) => (
                    <div key={index} className="post">
                        <p>{post.content}</p>
                        <small>{post.date}</small>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default UserCommunity;    