import { useEffect, useState } from 'react'
import axios from 'axios';
import NavBar from '../components/NavBar';

const Profile = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [skills, setSkills] = useState([{ value: "" }]);
    const [experiences, setExperiences] = useState([{ value: "" }]);


    const getProfile = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/profile", {
                headers: { jwt_token: localStorage.token }
            });

            setName(response.data.name);
            setEmail(response.data.email);
            setSkills([{ value: response.data.skills }]);
            setExperiences([{ value: response.data.experience }]);

        } catch (error: unknown) {
            console.error("An unknown error occurred");
        }
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handleSkillChange = (index: number, value: string) => {
        const newSkills = [...skills];
        newSkills[index].value = value;
        setSkills(newSkills);
    };

    const addSkillField = () => {
        setSkills([...skills, { value: "" }]);
    };

    const removeSkillField = (index: number) => {
        const newSkills = skills.filter((_, i) => i !== index);
        setSkills(newSkills);
    };

    const handleExperienceChange = (index: number, value: string) => {
        const newExperiences = [...experiences];
        newExperiences[index].value = value;
        setExperiences(newExperiences);
    };

    const addExperienceField = () => {
        setExperiences([...experiences, { value: "" }]);
    };

    const removeExperienceField = (index: number) => {
        const newExperiences = experiences.filter((_, i) => i !== index);
        setExperiences(newExperiences);
    };

    const onSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const skillsString = skills.map(skill => skill.value).join(', ');
            const experiencesString = experiences.map(exp => exp.value).join(', ');

            await axios.put(
                "http://localhost:5000/api/profile",
                {
                    name,
                    email,
                    skills: skillsString,
                    experience: experiencesString
                },
                {
                    headers: {
                        jwt_token: localStorage.token,
                        "Content-Type": "application/json"
                    }
                }
            );

            await getProfile();

        } catch (error) {
            console.error("Error updating profile:", error);
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
            <div className='px-4 md:px-8 max-w-2xl mx-auto space-y-4 motion-scale-in-[0.5] motion-translate-x-in-[-1%] motion-translate-y-in-[42%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[1.00s] motion-duration-[1.50s]/scale motion-duration-[1.50s]/translate'>
                <h3 className='text-3xl font-semibold mt-10 text-center text-emerald-100'>Your Profile</h3>
                <div className='bg-slate-800/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-emerald-800/30 hover:border-emerald-700/50 transition-all duration-300'>
                    <form onSubmit={onSubmitForm}>
                        <div className='space-y-4'>
                            <h4 className='text-white font-bold'>Full Name</h4>
                            <input
                                placeholder="Name"
                                value={name}
                                onChange={handleNameChange}
                                className="w-full p-3 rounded border border-emerald-700 bg-slate-700/50 text-white"
                            />
                            <h4 className='text-white font-bold'>Email</h4>
                            <input
                                placeholder="Email"
                                value={email}
                                onChange={handleEmailChange}
                                className="w-full p-3 rounded border border-emerald-700 bg-slate-700/50 text-white"
                            />
                            <h4 className='text-white font-bold'>Skills</h4>
                            {skills.map((skill, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        placeholder="Skill"
                                        value={skill.value}
                                        onChange={(e) => handleSkillChange(index, e.target.value)}
                                        className="w-full p-3 rounded border border-emerald-700 bg-slate-700/50 text-white align-top"
                                    />
                                    {skills.length > 1 && (
                                        <button
                                            onClick={() => removeSkillField(index)}
                                            className="h-12 px-4 bg-red-700 text-white rounded-md hover:bg-red-800 transition duration-300"
                                        >
                                            X
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addSkillField}
                                className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition duration-300"
                            >
                                + Add Skill
                            </button>
                            <h4 className='text-white font-bold'>Experience</h4>
                            {experiences.map((exp, index) => (
                                <div key={index} className="flex gap-2">
                                    <input
                                        placeholder="Experience"
                                        value={exp.value}
                                        onChange={(e) => handleExperienceChange(index, e.target.value)}
                                        className="w-full p-3 rounded border border-emerald-700 bg-slate-700/50 text-white align-top"
                                    />
                                    {experiences.length > 1 && (
                                        <button
                                            onClick={() => removeExperienceField(index)}
                                            className="h-12 px-4 bg-red-700 text-white rounded-md hover:bg-red-800 transition duration-300"
                                        >
                                            X
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                onClick={addExperienceField}
                                className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition duration-300"
                            >
                                + Add Experience
                            </button>
                        </div>
                        <div className="flex justify-center mt-4">
                            <button
                                type="submit"
                                className="px-6 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition duration-300"
                            >
                                Save Changes
                            </button>
                        </div>

                    </form>
                </div>
            </div>
        </div>
    )
}

export default Profile
