import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';

interface RecommendedJob {
  title: string;
  description: string;
  company: { display_name: string };
  location: { display_name: string };
  salary_min: number;
  redirect_url: string;
}

const UserHome = () => {
  const [name, setName] = useState("");
  const [recommendedJob, setRecommendedJob] = useState<RecommendedJob | null>(null);

  const getProfile = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/userhome", {
        headers: { jwt_token: localStorage.token }
      });

      setName(response.data.name);
      setRecommendedJob(response.data.recommendedJob);

    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error details:", error.message);
      } else {
        console.error("An unknown error occurred");
      }
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className='min-h-screen bg-gray-600 flex-col justify-center pb-4'>
      <div className='p-8 rounded-lg shadow-lg text-center mb-4'>
        <h1 className='text-3xl font-bold text-white mb-8'>Insight</h1>
        <h2 className="text-xl mb-4 text-white">Welcome {name}!</h2>
        <div className='text-center py-6 text-white font-medium italic'>
          Giving you the insight into your next career
        </div>
      </div>
      <div className='flex justify-center pb-4'>
        <NavBar />
      </div>
      <div className='allListings px-4 md:px-8 max-w-2xl mx-auto space-y-4'>
      <h3 className='text-xl font-semibold mb-4 text-center text-white'>AI-Matched Job Opportunity</h3>
        {recommendedJob && (
          <div className='bg-gray-500 p-8 rounded-lg shadow-lg'>
            <h2 className='text-xl font-bold text-white mb-2'>{recommendedJob.title}</h2>
            <p className='text-white mb-2'>{recommendedJob.company.display_name}</p>
            <p className='text-white mb-2'>{recommendedJob.location.display_name}</p>
            {recommendedJob.salary_min && (
              <p className='text-white mb-2'>Salary: ${recommendedJob.salary_min.toLocaleString()}</p>
            )}
            <p className='text-white mb-4'>{recommendedJob.description.slice(0, 150)}...</p>
            <a
              href={recommendedJob.redirect_url}
              target='_blank'
              rel='noopener noreferrer'
              className='w-full bg-lime-600 text-white py-3 rounded-md hover:bg-lime-600 transition duration-200 font-medium inline-block text-center'
            >
              Apply Now
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserHome;
