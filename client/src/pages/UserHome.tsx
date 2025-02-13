import { useEffect, useState } from 'react';
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
  const [recommendedJobs, setRecommendedJobs] = useState<RecommendedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const getProfile = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/userhome`, {
        headers: { jwt_token: localStorage.token }
      });

      setName(response.data.name);
      setRecommendedJobs(response.data.recommendedJobs);
      setIsLoading(false);

    } catch (error: unknown) {
      console.error("An unknown error occurred");
      localStorage.removeItem("token");
      window.location.href = '/';
    }
  };

  useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className='min-h-screen bg-gradient-to-tr from-slate-900 via-emerald-900 to-green-700 flex-col justify-center pb-4'>
      <div className='p-8 rounded-lg shadow-lg text-center mb-4'>
        <h1 className='text-6xl font-bold text-white'>Insight</h1>
        <h2 className="text-xl mt-4 text-emerald-100">Welcome {name}!</h2>
        <div className='text-center pt-8 text-emerald-100 font-medium italic'>
          Giving you the insight into your next career
        </div>
      </div>
      <div className='flex justify-center pb-4'>
        <NavBar isAuthenticated={true} />
      </div>
      <div className='allListings px-4 md:px-8 max-w-2xl mx-auto space-y-4'>
        {isLoading ? (
          <h3 className='text-3xl font-semibold my-10 text-center text-emerald-100'>Please wait, finding your perfect job matches...</h3>
        ) : (
          <>
            <h3 className='text-3xl font-semibold my-10 text-center text-emerald-100'>Your AI-Matched Job Opportunities</h3>
            {recommendedJobs.map((job, index) => (
              <div key={index} className='bg-slate-800/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-emerald-800/30 hover:border-emerald-700/50 transition-all duration-300 motion-preset-expand mb-4'>
                <h2 className='text-xl font-bold text-white mb-2'>{job.title}</h2>
                <p className='text-emerald-200 mb-2'>{job.company.display_name}</p>
                <p className='text-emerald-200 mb-2'>{job.location.display_name}</p>
                {job.salary_min && (
                  <p className='text-emerald-200 mb-2'>Salary: ${job.salary_min.toLocaleString()}</p>
                )}
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
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default UserHome;
