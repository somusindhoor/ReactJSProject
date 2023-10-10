import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Chart from 'chart.js/auto';

export default function Dashboard() {
    const apiKey = import.meta.env.VITE_API_KEY;

    const postsUrl = `https://demo.ghost.io/ghost/api/content/posts//?key=${apiKey}`;
    const authorsUrl = `https://demo.ghost.io/ghost/api/content/authors/?key=${apiKey}`;
    const pagesUrl = `https://demo.ghost.io/ghost/api/content/pages/?key=${apiKey}`;
    const tagsUrl = `https://demo.ghost.io/ghost/api/content/tags/?key=${apiKey}`;
    const [dataPosts, setdataPosts] = useState([]);
    const [posts, setposts] = useState(0);
    const [authors, setauthors] = useState(0);
    const [pages, setpages] = useState(0);
    const [tags, setTags] = useState(0);
    const [chartInstance, setChartInstance] = useState(null);

    useEffect(() => {
        fetchPosts();
        fetchAuthors();
        fetchPages();
        fetchTags();

    }, []);

    const barGraphData = () => {
        const postsByMonth = dataPosts.reduce((acc, post) => {
            const date = new Date(post.published_at);
            console.log("Date - " + date);
            const monthYear = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

            if (!acc[monthYear]) {
                acc[monthYear] = 0;
            }

            acc[monthYear]++;
            return acc;
        }, {});

        const labels = Object.keys(postsByMonth);
        const counts = Object.values(postsByMonth);
        if (chartInstance != null) {
            chartInstance.destroy();
        }

        const ctx = document.getElementById('barGraph').getContext('2d');
        
        const newChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: [1, 3, 1, 4, 2],
                datasets: [
                    {
                        label: 'Posts per Month',
                        data: [1, 3, 1, 4, 2],
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        borderColor: 'rgba(75, 192, 192, 1)',
                        borderWidth: 1,
                    },
                ],
            },
        });
        setChartInstance(newChartInstance);
    }

    const fetchPosts = () => {
        axios.get(postsUrl).then((res) => {
            setposts(res.data.posts.length);
            setdataPosts(res.data.posts);
            barGraphData();
        }
        ).catch((err) => { console.log(err); })
    }
    const fetchAuthors = () => {
        axios.get(authorsUrl).then((res) => {
            setauthors(res.data.authors.length);
        }
        ).catch((err) => { console.log(err); })
    }
    const fetchPages = () => {
        axios.get(pagesUrl).then((res) => {
            setpages(res.data.pages.length);
        }
        ).catch((err) => { console.log(err); })
    }
    const fetchTags = () => {
        axios.get(tagsUrl).then((res) => {
            setTags(res.data.tags.length);
        }
        ).catch((err) => { console.log(err); })
    }

    const sortedData = [...dataPosts].sort((a, b) => {
        const dateA = new Date(a.published_at);
        const dateB = new Date(b.published_at);
        return dateB - dateA;
    });

    const latestPosts = sortedData.slice(0, 5);

    return (
        <div>
            <div className='flex items-center justify-center mt-12 mb-30 text-6xl font-bold'>
                <h1><u>Dashboard</u></h1>
            </div>
            <div className='flex justify-center flex-col p-6'>

                <div className='flex items-center justify-center'>
                    <div className='w-2/4' >
                        <canvas id="barGraph" width="200" height="100"></canvas>
                    </div>
                </div>

                <div className='flex items-center justify-around'>
                    <div className='bg-slate-100 border-2 border-black p-3 w-1/6 flex items-center justify-around mb-6 rounded-md'>
                        <h2 className='font-bold text-4xl' >Authors </h2>
                        <h1 className='font-bold text-2xl'>{authors}</h1>
                    </div>
                    <div className='bg-slate-100 border-2 border-black p-3 w-1/6 flex items-center justify-around mb-6 rounded-md'>
                        <h2 className='font-bold text-4xl' >Posts </h2>
                        <h1 className='font-bold text-2xl'>{posts}</h1>
                    </div>
                    <div className='bg-slate-100 border-2 border-black p-3 w-1/6 flex items-center justify-around mb-6 rounded-md'>
                        <h2 className='font-bold text-4xl' >Pages </h2>
                        <h1 className='font-bold text-2xl'>{pages}</h1>
                    </div>
                    <div className='bg-slate-100 border-2 border-black p-3 w-1/6 flex items-center justify-around mb-6 rounded-md'>
                        <h2 className='font-bold text-4xl' >tags </h2>
                        <h1 className='font-bold text-2xl'>{tags}</h1>
                    </div>
                </div>

                <div className='flex items-end justify-evenly'>
                    <Link to="/posts" className='border-2 border-black p-2 rounded-md bg-blue-500 text-white w-20 text-2xl font-semibold hover:bg-blue-300 hover:border-orange-600 '>Posts</Link>
                    <Link to="/links" className='border-2 border-black p-2 rounded-md bg-blue-500 text-white w-20 text-2xl font-semibold hover:bg-blue-300 hover:border-orange-600  ml-4'>Link</Link>
                </div>

                <div className='flex flex-col items-center mt-10'>
                    <h2 className='underline decoration-red-400 text-4xl font-semibold pb-4'>Latest 5 Published posts List :-</h2>
                    {latestPosts.map((post, index) => {
                        return (
                            <div key={index} className='text-2xl text-blue-600 hover:text-blue-800 font-medium'>
                                <Link to={`/post/${post.id}`}>
                                    <h2>{post.title}</h2>
                                </Link>
                            </div>
                        )
                    })
                    }
                </div>

            </div>
        </div>
    );
}
