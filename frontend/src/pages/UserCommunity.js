// src/pages/UserCommunity.js
import React, { useState } from 'react';
import { FaComments } from 'react-icons/fa';
import Card from '../components/Card';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { List } from 'react-virtualized';

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

    const rowRenderer = ({ index, key, style }) => {
        const post = posts[index];
        return (
            <div key={key} style={style}>
                <Card>
                    <p>{post.content}</p>
                    <small>{post.date}</small>
                </Card>
            </div>
        );
    };

    return (
        <div className="container">
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
                <List
                    width={1200}
                    height={400}
                    rowCount={posts.length}
                    rowHeight={100}
                    rowRenderer={rowRenderer}
                />
            </div>
        </div>
    );
};

export default UserCommunity;