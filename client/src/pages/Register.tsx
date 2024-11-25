import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: "",
        skills: "",
        experience: ""
    });

    const { email, password, name, skills, experience } = inputs;

    const onChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const body = { email, password, name, skills, experience };
            const response = await axios.post("http://localhost:5000/auth/register",
                body,
                {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });

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
            <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-emerald-800/30 hover:border-emerald-700/50 transition-all duration-300 w-full max-w-md">
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
                    <textarea
                        className="w-full px-4 py-3 rounded-md border border-emerald-800/30 bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                        name='skills'
                        placeholder='Your Skills (e.g., JavaScript, React, Node.js)'
                        value={skills}
                        onChange={onChange}
                    />
                    <textarea
                        className="w-full px-4 py-3 rounded-md border border-emerald-800/30 bg-slate-700/50 text-white focus:outline-none focus:ring-2 focus:ring-emerald-600 focus:border-transparent transition"
                        name='experience'
                        placeholder='Your Experience'
                        value={experience}
                        onChange={onChange}
                    />
                    <button
                        type="submit"
                        className="w-full bg-emerald-700 text-white py-3 rounded-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 font-medium"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register
