import React, { useState } from 'react'
import axios from 'axios';

const Login = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const { email, password } = inputs;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const body = { email, password };
            const response = await axios.post(
                "http://localhost:5000/auth/login",
                body,
                {
                    headers: { "Content-Type": "application/json" }
                }
            );
            const parseRes = response.data;

            if (parseRes.jwtToken) {
                localStorage.setItem("token", parseRes.jwtToken);
                setAuth(true);
            } else {
                setAuth(false);
            }
        } catch (err) {
            console.error(err instanceof Error ? err.message : "An error occurred");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-tr from-slate-900 via-emerald-900 to-green-700 flex justify-center items-center">
            <div className="bg-slate-800/80 backdrop-blur-sm p-8 rounded-lg shadow-lg border border-emerald-800/30 hover:border-emerald-700/50 transition-all duration-300 w-full max-w-md motion-scale-in-[0.5] motion-translate-x-in-[-1%] motion-translate-y-in-[42%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[1.00s] motion-duration-[1.50s]/scale motion-duration-[1.50s]/translate">
                <h1 className="text-6xl font-bold text-white mb-8 text-center">Insight</h1>
                <div className="text-center pb-8 text-emerald-100 font-medium italic">
                    Welcome back
                </div>
                <form onSubmit={onSubmitForm} className="space-y-6">
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
                    <button
                        type="submit"
                        className="w-full bg-emerald-700 text-white py-3 rounded-md hover:bg-emerald-600 hover:shadow-lg transition duration-300 font-medium"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login
