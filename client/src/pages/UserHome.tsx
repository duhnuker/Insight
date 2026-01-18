import { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { Card, CardHeader, CardBody, CardFooter, Button, Chip, Skeleton, Input, Tabs, Tab } from "@heroui/react";
import { Sparkles, Globe } from 'lucide-react';

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
    const [allJobs, setAllJobs] = useState<RecommendedJob[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<string>("matches");
    const [searchTerm, setSearchTerm] = useState("");

    const getProfile = async () => {
        try {
            const [profileRes, landingRes] = await Promise.all([
                axios.get(`${import.meta.env.VITE_API_URL}/api/userhome`, {
                    headers: { jwt_token: localStorage.token }
                }),
                axios.get(`${import.meta.env.VITE_API_URL}/api/landing`)
            ]);

            setName(profileRes.data.name);
            setRecommendedJobs(profileRes.data.recommendedJobs);
            setAllJobs(Array.isArray(landingRes.data) ? landingRes.data : []);
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
        <div className='min-h-screen relative overflow-hidden text-white pb-24 font-sans'>

            <div className="relative z-10">
                {/* Stunning Hero Section */}
                <div className='pt-12 pb-8 px-4 text-center'>
                    <h1 className='text-6xl md:text-7xl font-black tracking-tighter text-white/90 mb-4 select-none motion-safe:animate-in motion-opacity-in-0 motion-translate-y-in-4'>
                        Insight
                    </h1>
                    <div className="flex flex-col items-center gap-2">
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                            Welcome, {name}
                        </h2>
                        <div className="flex items-center gap-2 text-emerald-400 font-semibold tracking-widest uppercase text-[10px]">
                            <span className="w-6 h-[1px] bg-emerald-400/30" />
                            AI-Powered Career Intelligence
                            <span className="w-6 h-[1px] bg-emerald-400/30" />
                        </div>
                    </div>
                </div>

                {/* Floating Navigation & Mode Switch */}
                <div className='flex flex-col items-center gap-6 pb-12 sticky top-0 z-50 transition-all duration-300 backdrop-blur-sm bg-black/5 py-4'>
                    <NavBar isAuthenticated={true} />

                    <div className="w-full max-w-md px-4 flex justify-center">
                        <Tabs
                            aria-label="Job Feed Options"
                            color="success"
                            variant="underlined"
                            selectedKey={activeTab}
                            onSelectionChange={(key) => setActiveTab(key as string)}
                            classNames={{
                                tabList: "gap-8 w-full relative rounded-none p-0 border-b border-white/5 justify-center",
                                cursor: "w-full bg-emerald-500",
                                tab: "max-w-fit px-4 h-12",
                                tabContent: "group-data-[selected=true]:text-emerald-500 font-bold"
                            }}
                        >
                            <Tab
                                key="matches"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <Sparkles size={18} />
                                        <span>Match Feed</span>
                                    </div>
                                }
                            />
                            <Tab
                                key="discover"
                                title={
                                    <div className="flex items-center space-x-2">
                                        <Globe size={18} />
                                        <span>Discover</span>
                                    </div>
                                }
                            />
                        </Tabs>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className='allListings px-6 md:px-12 max-w-4xl mx-auto'>
                    {isLoading ? (
                        <div className="space-y-10">
                            <div className="flex flex-col items-center gap-6 py-12">
                                <div className="relative">
                                    <div className="w-16 h-16 border-2 border-emerald-500/20 rounded-full" />
                                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-emerald-500 rounded-full animate-spin" />
                                </div>
                                <h3 className='text-2xl font-medium text-emerald-400/80 tracking-wide'>
                                    Matching your profile with thousands of roles...
                                </h3>
                            </div>
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
                        <div className="space-y-8">
                            {/* Content based on Tab */}
                            {activeTab === 'matches' ? (
                                <>
                                    {/* Match Feed Header */}
                                    <div className="flex flex-col md:flex-row md:items-end justify-between items-center gap-4 mb-8 border-b border-white/5 pb-6">
                                        <div className="text-center md:text-left">
                                            <h3 className='text-3xl font-bold text-white mb-1'>Match Feed</h3>
                                            <p className="text-zinc-500 text-base font-medium">Curated opportunities based on your skills</p>
                                        </div>
                                        <Chip
                                            variant="flat"
                                            className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-4 py-3 text-sm font-bold"
                                        >
                                            {recommendedJobs.length} Live Matches
                                        </Chip>
                                    </div>

                                    {/* Job Cards Grid - Matches */}
                                    <div className="grid grid-cols-1 gap-6">
                                        {recommendedJobs.map((job, index) => (
                                            <Card
                                                key={index}
                                                className='group bg-zinc-900/30 backdrop-blur-xl border border-white/5 hover:border-emerald-500/30 transition-all duration-500'
                                            >
                                                <CardHeader className="flex-col items-start gap-4 p-6 pb-2">
                                                    <div className="flex flex-col md:flex-row justify-between items-start w-full gap-4">
                                                        <div className="space-y-1">
                                                            <h2 className='text-2xl font-black text-white group-hover:text-emerald-400 transition-colors duration-300 tracking-tight text-left'>
                                                                {job.title}
                                                            </h2>
                                                            <div className="flex items-center gap-3 text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2">
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
                                                        {job.salary_min && (
                                                            <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-xl p-3 text-center min-w-[120px]">
                                                                <p className="text-[8px] uppercase tracking-tighter text-emerald-500 font-black mb-1">Estimated Annual</p>
                                                                <p className="text-xl font-black text-white">${job.salary_min.toLocaleString()}</p>
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className="flex gap-2 flex-wrap">
                                                        <Chip
                                                            size="sm"
                                                            variant="dot"
                                                            color="success"
                                                            className="border-white/5 text-zinc-300 font-medium px-3"
                                                        >
                                                            Top Match
                                                        </Chip>
                                                        <Chip
                                                            size="sm"
                                                            variant="flat"
                                                            className="bg-white/5 text-zinc-400 border border-white/5 px-3"
                                                        >
                                                            Remote Friendly
                                                        </Chip>
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
                                                        className='w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg h-14 rounded-xl shadow-2xl shadow-emerald-900/20 hover:shadow-emerald-500/40 transition-all duration-300 transform active:scale-[0.99] group'
                                                        size="lg"
                                                    >
                                                        Apply With Insight
                                                        <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                                    </Button>
                                                </CardFooter>
                                            </Card>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <>
                                    {/* Discover Header & Search */}
                                    <div className="space-y-8 mb-12">
                                        <div className="flex flex-col md:flex-row md:items-end justify-between items-center gap-4 border-b border-white/5 pb-6">
                                            <div className="text-center md:text-left">
                                                <h3 className='text-3xl font-bold text-white mb-1'>Discovery Feed</h3>
                                                <p className="text-zinc-500 text-base font-medium">Explore all available opportunities</p>
                                            </div>
                                        </div>

                                        <div className="relative w-full group">
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

                                    {/* Job Cards Grid - Discover */}
                                    <div className="grid grid-cols-1 gap-6">
                                        {allJobs
                                            .filter(job =>
                                                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                job.company.display_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                                job.description.toLowerCase().includes(searchTerm.toLowerCase())
                                            )
                                            .map((job, index) => (
                                                <Card
                                                    key={index}
                                                    className='group bg-zinc-900/30 backdrop-blur-xl border border-white/5 hover:border-emerald-500/30 transition-all duration-500'
                                                >
                                                    <CardHeader className="flex-col items-start gap-4 p-6 pb-2">
                                                        <div className="flex flex-col md:flex-row justify-between items-start w-full gap-4">
                                                            <div className="space-y-1">
                                                                <h2 className='text-2xl font-black text-white group-hover:text-emerald-400 transition-colors duration-300 tracking-tight text-left'>
                                                                    {job.title}
                                                                </h2>
                                                                <div className="flex items-center gap-3 text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-2">
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
                                                            className='w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-black text-lg h-14 rounded-xl shadow-2xl shadow-emerald-900/20 hover:shadow-emerald-500/40 transition-all duration-300 transform active:scale-[0.99] group'
                                                            size="lg"
                                                        >
                                                            Apply Now
                                                            <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                                                        </Button>
                                                    </CardFooter>
                                                </Card>
                                            ))}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserHome;
