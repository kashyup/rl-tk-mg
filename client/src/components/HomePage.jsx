import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './HomePage.css';

const HomePage = () => {
  const { createDocument } = useAuth();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const handleCreateDocument = async () => {
    try {
      const document = await createDocument(title, content);
      console.log('Document created:', document);
      alert('Document created successfully!');
      setTitle(''); // Clear the title field after creation
      setContent(''); // Clear the content field after creation
    } catch (error) {
      console.error('Error creating document:', error);
      alert('Failed to create document');
    }
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>
      <div>
        <input
          type="text"
          placeholder="Document Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      <div>
        <textarea
          placeholder="Document Content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>
      <button onClick={handleCreateDocument}>Create Document</button>
    </div>
  );
};

export default HomePage;
