import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { Card, CardHeader, CardBody, CardFooter, Button, Input, Skeleton, Chip } from "@heroui/react";

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

  const filteredJobs = Array.isArray(jobs) ? jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className='min-h-screen relative overflow-hidden text-white pb-24 font-sans'>

      <div className="relative z-10">
        {/* Hero Section */}
        <div className='pt-16 pb-12 px-4 text-center'>
          <h1 className='text-6xl md:text-7xl font-black tracking-tighter text-white/90 mb-4 select-none motion-safe:animate-in motion-opacity-in-0 motion-translate-y-in-4'>
            Insight
          </h1>
          <div className='flex flex-col items-center gap-2'>
            <div className='text-xl md:text-2xl font-bold bg-gradient-to-r from-emerald-400 via-emerald-200 to-teal-400 bg-clip-text text-transparent italic'>
              Giving you the insight into your next career
            </div>
            <div className="flex items-center gap-2 text-zinc-500 font-semibold tracking-widest uppercase text-[10px] mt-1">
              <span className="w-6 h-[1px] bg-zinc-800" />
              Premium Job Discovery
              <span className="w-6 h-[1px] bg-zinc-800" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className='flex justify-center pb-12'>
          <NavBar isAuthenticated={isAuthenticated} />
        </div>

        {/* Search Section */}
        <div className='flex justify-center mb-16 px-4'>
          <div className="relative w-full max-w-2xl group">
            <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <Input
              type="text"
              placeholder="Find your future: title, company, or keywords 🔍"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="relative w-full"
              classNames={{
                input: "text-lg py-4 focus:outline-none",
                inputWrapper: "h-16 bg-zinc-900/60 backdrop-blur-xl border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500 transition-all duration-300 rounded-xl shadow-2xl"
              }}
              size="lg"
            />
          </div>
        </div>

        {/* Job Listings Area */}
        <div className='allListings px-6 md:px-12 max-w-4xl mx-auto space-y-8'>
          {isLoading ? (
            <div className="space-y-10">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="bg-zinc-900/40 backdrop-blur-2xl border border-white/5 p-2">
                  <CardBody className="space-y-6 p-8">
                    <Skeleton className="w-1/2 h-10 rounded-xl bg-white/5" />
                    <div className="flex gap-4">
                      <Skeleton className="w-40 h-8 rounded-full bg-white/5" />
                      <Skeleton className="w-40 h-8 rounded-full bg-white/5" />
                    </div>
                    <Skeleton className="w-full h-32 rounded-xl bg-white/5" />
                    <Skeleton className="w-full h-16 rounded-xl bg-white/5 mt-4" />
                  </CardBody>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 gap-6">
                {filteredJobs.map((job) => (
                  <Card
                    key={job.id}
                    className='group bg-zinc-900/30 backdrop-blur-xl border border-white/5 hover:border-emerald-500/30 transition-all duration-500 hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.1)]'
                    isPressable
                  >
                    <CardHeader className="flex-col items-start gap-4 p-6 pb-2">
                      <div className="flex flex-col md:flex-row justify-between items-start w-full gap-4">
                        <div className="space-y-1">
                          <h2 className='text-2xl font-black text-white group-hover:text-emerald-400 transition-colors duration-300 tracking-tight text-left'>
                            {job.title}
                          </h2>
                          <div className="flex items-center gap-3 text-emerald-500/60 font-bold uppercase text-[10px] tracking-widest mt-2">
                            <Chip
                              size="sm"
                              variant="flat"
                              className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 px-3"
                            >
                              🏢 {job.company.display_name}
                            </Chip>
                            <Chip
                              size="sm"
                              variant="flat"
                              className="bg-blue-500/10 text-blue-400 border border-blue-500/10 px-3"
                            >
                              📍 {job.location.display_name}
                            </Chip>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardBody className="px-6 py-4">
                      <p className='text-zinc-400 line-clamp-3 text-base leading-relaxed group-hover:text-zinc-200 transition-colors duration-500'>
                        {job.description}
                      </p>
                    </CardBody>
                    <CardFooter className="p-6 pt-2">
                      <Button
                        as="a"
                        href={job.redirect_url}
                        target='_blank'
                        rel='noopener noreferrer'
                        className='w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg h-14 rounded-xl shadow-2xl transition-all duration-300 flex items-center justify-center'
                        size="lg"
                      >
                        Apply Now
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
              {!isLoading && filteredJobs.length === 0 && (
                <div className="text-center py-24 bg-zinc-900/20 rounded-3xl border border-white/5 backdrop-blur-sm">
                  <p className="text-3xl font-bold text-zinc-500">No jobs found matching your search.</p>
                  <Button
                    variant="light"
                    className="mt-4 text-emerald-400 font-bold"
                    onClick={() => setSearchTerm('')}
                  >
                    Clear Search
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Landing;
