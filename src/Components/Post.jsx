import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

export default function Post() {
    
    let {id} = useParams();
    const [post, setpost] = useState({});
    const apiKey = import.meta.env.VITE_API_KEY;
    const postsUrl = `https://demo.ghost.io/ghost/api/content/posts/${id}/?key=${apiKey}`;

    useEffect(() => {
        fetchPosts();
      }, []); 

    const fetchPosts = () => {
        axios.get(postsUrl).then((res) => {
          console.log(res.data.posts);
          setpost(res.data.posts[0]);
        }
        ).catch((err) => { console.log(err); })
      }

  return (
    <div>
      <div className='p-6' dangerouslySetInnerHTML={{ __html: post.html }} /> 
    </div>
  );
}
