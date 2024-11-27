import React, { useEffect, useState } from 'react'
import axios from 'axios';
import NavBar from '../components/NavBar';

const Profile = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [skills, setSkills] = useState("");
    const [experience, setExperience] = useState("");

    const getProfile = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/profile", {
                headers: { jwt_token: localStorage.token }
            });

            setName(response.data.name);
            setEmail(response.data.email);
            setSkills(response.data.skills);
            setExperience(response.data.experience);

        } catch (error: unknown) {
            console.error("An unknown error occurred");
        }
    };

    useEffect(() => {
        getProfile();
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
                <NavBar isAuthenticated={true} />
            </div>
            <div className='px-4 md:px-8 max-w-2xl mx-auto space-y-4'>
                <h3 className='text-3xl font-semibold my-10 text-center text-emerald-100'>Your Profile</h3>
                <div className='bg-slate-800/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-emerald-800/30 hover:border-emerald-700/50 transition-all duration-300'>
                    <div className='space-y-4'>
                        <h4 className='text-white font-bold'>Full Name</h4>
                        <input
                            placeholder="Name"
                            value={name}
                            className="w-full p-3 rounded border border-emerald-700 bg-slate-700/50 text-white"
                        />
                        <h4 className='text-white font-bold'>Email</h4>
                        <input
                            placeholder="Email"
                            value={email}
                            className="w-full p-3 rounded border border-emerald-700 bg-slate-700/50 text-white"
                        />
                        <h4 className='text-white font-bold'>Skills</h4>
                        <input
                            placeholder="Skills"
                            value={skills}
                            className="w-full p-3 rounded border border-emerald-700 bg-slate-700/50 text-white"
                        />
                        <h4 className='text-white font-bold'>Experience</h4>
                        <input
                            placeholder="Experience"
                            value={experience}
                            className="w-full p-3 rounded border border-emerald-700 bg-slate-700/50 text-white"
                        />
                        <div className='flex justify-center space-x-4 mt-6'>
                            <button className='bg-emerald-700 text-white py-3 px-6 rounded-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 font-medium'>
                                Save Changes
                            </button>
                            <button className='bg-red-700 text-white py-3 px-6 rounded-md hover:bg-red-800 hover:shadow-lg transition duration-300 font-medium'>
                                Delete Profile
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile
