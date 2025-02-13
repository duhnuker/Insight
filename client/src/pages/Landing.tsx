import { useEffect, useState } from 'react';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [isAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/landing`);
        setJobs(Array.isArray(response.data) ? response.data : []);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-tr from-slate-900 via-emerald-900 to-green-700 flex-col justify-center pb-4'>
      <div className='p-8 rounded-lg shadow-lg text-center mb-4'>
        <h1 className='text-6xl font-bold text-white'>Insight</h1>
        <div className='text-center pt-8 text-emerald-100 font-medium italic'>
          Giving you the insight into your next career
        </div>
      </div>
      <div className='flex justify-center pb-4'>
        <NavBar isAuthenticated={isAuthenticated} />
      </div>
      <div className='flex justify-center mt-1 mb-3'>
        <input
          type="text"
          placeholder="Search jobs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-md px-4 py-2 rounded-lg bg-slate-800/80 border border-emerald-800/30 text-white focus:outline-none focus:border-emerald-700/50"
        />
      </div>
      <div className='allListings px-4 md:px-8 max-w-2xl mx-auto space-y-4'>
        {isLoading ? (
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold text-white">Please wait, jobs are loading...</h2>
          </div>
        ) : (
          Array.isArray(jobs) && jobs
            .filter(job =>
              job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.company.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              job.description.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((job) => (
              <div key={job.id} className='bg-slate-800/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-emerald-800/30 hover:border-emerald-700/50 transition-all duration-300 motion-scale-in-[0.5] motion-translate-x-in-[-1%] motion-translate-y-in-[42%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[1.00s] motion-duration-[1.50s]/scale motion-duration-[1.50s]/translate'>
                <h2 className='text-xl font-bold text-white mb-2'>{job.title}</h2>
                <p className='text-emerald-200 mb-2'>{job.company.display_name}</p>
                <p className='text-emerald-200 mb-2'>{job.location.display_name}</p>
                <p className='text-slate-300 mb-4'>{job.description.slice(0, 150)}...</p>
                <a
                  href={job.redirect_url}
                  target='_blank'
                  rel='noopener noreferrer'
                  className='w-full bg-emerald-700 text-white py-3 rounded-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 font-medium inline-block text-center'
                >
                  Apply Now
                </a>
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default Landing;
