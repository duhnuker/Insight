import React, { useState } from 'react'

const Login = () => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
    });

    const { email, password } = inputs;

    const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gray-600 flex justify-center items-center">
            <div className="bg-gray-500 p-8 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-3xl font-bold text-white mb-8 text-center">Login</h1>
                <form className="space-y-6">
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
                        Login
                    </button>
                </form>
            </div>
        </div>
    )
}

export default Login