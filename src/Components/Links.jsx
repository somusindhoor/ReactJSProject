import axios from 'axios';
import React, { useEffect, useState } from 'react';

export default function Links() {
  const apiKey = import.meta.env.VITE_API_KEY;
  const postsUrl = `https://demo.ghost.io/ghost/api/content/posts//?key=${apiKey}`;
  const [links, setLinks] = useState([]);
  const [internallinks, setinternallinks] = useState([]);
  const [externallinks, setexternallinks] = useState([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = () => {
    axios.get(postsUrl).then((res) => {
      let urls = [];
      var internalLinks = [];
      var externalLinks = [];
      const internalBaseUrl = 'https://demo.ghost.io/';

      for (let i = 0; i < res.data.posts.length; i++) {
        urls.unshift(res.data.posts[i].url);
        if (res.data.posts[i].url.startsWith(internalBaseUrl)) {
          internalLinks.unshift(res.data.posts[i].url);
        } else {
          externalLinks.unshift(res.data.posts[i].url);
        }
      }
      
      setLinks(urls);
      setinternallinks(internalLinks);
      setexternallinks(externalLinks);
      // chekLinks();
    }
    ).catch((err) => { console.log(err); })
  }

  return (
    <div> 
      <div className='flex items-center pl-4 pt-4 text-3xl font-bold'>
        <h1>Links</h1>
      </div>
      
      <div className='custom-grid p-4'>
        <div className='bg-gray-200  p-4'>
          <h1 className='font-bold text-red-800 text-xl'>Internal Links</h1>
          {internallinks.length == 0 ?
          <div className='flex justify-center'>
            <h1>No internal Links</h1>
          </div> :
          internallinks.map((link, index) => {
            return (
              <div key={index} className='flex pl-6 pt-4'>
                <h1 className='font-bold pr-6'>{index+1}</h1>
                <a href={`${link}`} target='_blank' className=' text-blue-400 font-semibold hover:text-blue-600'> {link} </a>
              </div>
            )
          })}
        </div>

        <div className='bg-gray-200 p-4'>
          <h1 className='font-bold text-red-800 text-xl'>External Links</h1>
          {externallinks.length == 0 ?
          <div className='flex justify-center'>
            <h1>No External Links</h1>
          </div> :
          externallinks.map((link, index) => {
            return (
              <div key={index}>
                <h1 className=' font-semibold'> {link} </h1>
                
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
