import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

interface Job {
  id: string;
  title: string;
  company: { display_name: string };
  location: { display_name: string };
  description: string;
  redirect_url: string;
}

const Landing = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/landing');
        setJobs(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className='min-h-screen bg-gray-600 flex-col justify-center pb-4'>
      <div className='p-8 rounded-lg shadow-lg text-center mb-4'>
        <h1 className='text-3xl font-bold text-white mb-8'>Insight</h1>
        <div className='text-center py-6 text-white font-medium italic'>
          Giving you the insight into your next career
        </div>
      </div>
      <div className='flex justify-center pb-4'>
        <NavBar />
      </div>
      <div className='allListings px-4 md:px-8 max-w-2xl mx-auto space-y-4'>
        {Array.isArray(jobs) && jobs.map((job) => (
          <div key={job.id} className='bg-gray-500 p-8 rounded-lg shadow-lg'>
            <h2 className='text-xl font-bold text-white mb-2'>{job.title}</h2>
            <p className='text-white mb-2'>{job.company.display_name}</p>
            <p className='text-white mb-2'>{job.location.display_name}</p>
            <p className='text-white mb-4'>{job.description.slice(0, 150)}...</p>
            <a
              href={job.redirect_url}
              target='_blank'
              rel='noopener noreferrer'
              className='w-full bg-lime-600 text-white py-3 rounded-md hover:bg-lime-600 transition duration-200 font-medium inline-block text-center'
            >
              Apply Now
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Landing;
