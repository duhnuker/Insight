import React, { useState } from 'react';
import axios from 'axios';

const Register = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: ""
    });

    const { email, password, name } = inputs;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const body = { email, password, name };
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
        <div className="min-h-screen bg-gray-600 flex justify-center items-center">
            <div className="bg-gray-500 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Register</h1>
                <form onSubmit={onSubmitForm} className="space-y-6">
                    <input
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent transition"
                        type='text'
                        name='name'
                        placeholder='Full Name'
                        value={name}
                        onChange={onChange}
                    />
                    <input
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent transition"
                        type='text'
                        name='email'
                        placeholder='Email'
                        value={email}
                        onChange={onChange}
                    />
                    <input
                        className="w-full px-4 py-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-lime-600 focus:border-transparent transition"
                        type='password'
                        name='password'
                        placeholder='Password'
                        value={password}
                        onChange={onChange}
                    />
                    <button
                        type="submit"
                        className="w-full bg-lime-600 text-white py-3 rounded-md hover:bg-lime-600 transition duration-200 font-medium"
                    >
                        Register
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Register
