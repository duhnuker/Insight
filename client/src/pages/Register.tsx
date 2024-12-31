import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: "",
    });
    const [skills, setSkills] = useState([{ value: "" }]);
    const [experiences, setExperiences] = useState([{ value: "" }]);

    const { email, password, name } = inputs;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
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

    const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const skillsArray = skills.map(skill => skill.value.trim()).filter(Boolean);
            const experiencesArray = experiences.map(exp => exp.value.trim()).filter(Boolean);

            const body = {
                email,
                password,
                name,
                skills: skillsArray,
                experience: experiencesArray
            };

            const response = await axios.post(
                "http://localhost:5000/auth/register",
                body,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }
            );

            const parseRes = response.data;
            localStorage.setItem("token", parseRes.jwtToken);
            setAuth(true);

        } catch (err: unknown) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error('An unknown error occurred');
            }
        }
    };


    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-emerald-900 to-green-700 flex justify-center items-center">
            <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-emerald-800/30 hover:border-emerald-700/50 transition-all duration-300 w-full max-w-md motion-scale-in-[0.5] motion-translate-x-in-[-1%] motion-translate-y-in-[42%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[1.00s] motion-duration-[1.50s]/scale motion-duration-[1.50s]/translate">
                <h1 className="text-6xl font-bold text-white mb-8 text-center">Insight</h1>
                <div className="text-center pb-8 text-emerald-100 font-medium italic">
                    Start your journey with us
                </div>
                <form onSubmit={onSubmitForm} className="space-y-6">
                    <input
                        className="w-full px-4 py-3 rounded-md border border-emerald-800/30 bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                        type='text'
                        name='name'
                        placeholder='Full Name'
                        value={name}
                        onChange={onChange}
                    />
                    <input
                        className="w-full px-4 py-3 rounded-md border border-emerald-800/30 bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                        type='text'
                        name='email'
                        placeholder='Email'
                        value={email}
                        onChange={onChange}
                    />
                    <input
                        className="w-full px-4 py-3 rounded-md border border-emerald-800/30 bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={password}
                        onChange={onChange}
                    />

                    <h4 className='text-white font-bold'>Skills</h4>
                    {skills.map((skill, index) => (
                        <div key={index} className="flex gap-2">
                            <input
                                placeholder="Skill"
                                value={skill.value}
                                onChange={(e) => handleSkillChange(index, e.target.value)}
                                className="w-full p-3 rounded border border-emerald-700 bg-slate-700/50 text-white"
                            />
                            {skills.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeSkillField(index)}
                                    className="h-12 px-4 bg-red-700 text-white rounded-md hover:bg-red-800 transition duration-300"
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
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
                                className="w-full p-3 rounded border border-emerald-700 bg-slate-700/50 text-white"
                            />
                            {experiences.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => removeExperienceField(index)}
                                    className="h-12 px-4 bg-red-700 text-white rounded-md hover:bg-red-800 transition duration-300"
                                >
                                    X
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={addExperienceField}
                        className="mt-2 px-4 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600 transition duration-300"
                    >
                        + Add Experience
                    </button>
                    <div>
                        <button
                            type="submit"
                            className="w-full mb-6 bg-emerald-700 text-white py-3 rounded-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 font-medium"
                        >
                            Register
                        </button>
                        <Link to="/"><button className='w-full bg-red-700 text-white py-3 rounded-md hover:bg-red-800 hover:shadow-lg transition duration-300 font-medium'>
                            Go Back
                            </button>
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Register;
