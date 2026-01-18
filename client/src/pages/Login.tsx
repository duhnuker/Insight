import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardBody, CardHeader, Input, Button } from "@heroui/react";

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
                `${import.meta.env.VITE_API_URL}/auth/login`,
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
        <div className="min-h-screen flex justify-center items-center p-4 relative overflow-hidden">

            <div className="relative z-10 w-full max-w-md group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Card className="bg-zinc-900/80 backdrop-blur-xl border border-white/5 group-hover:border-emerald-500/30 transition-all duration-500 group-hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] w-full max-w-md motion-scale-in-[0.5] motion-translate-x-in-[-1%] motion-translate-y-in-[42%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[1.00s]">
                    <CardHeader className="flex-col gap-4 p-8 pb-4">
                        <h1 className="text-6xl font-bold text-white text-center">Insight</h1>
                        <div className="text-center text-emerald-400 font-medium italic">
                            Welcome back
                        </div>
                    </CardHeader>
                    <CardBody className="p-8 pt-4">
                        <form onSubmit={onSubmitForm} className="space-y-8">
                            <Input
                                type='text'
                                name='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={onChange}
                                classNames={{
                                    input: "text-white focus:outline-none h-full",
                                    inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 items-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/5"
                                }}
                                size="lg"
                            />
                            <Input
                                type='password'
                                name='password'
                                placeholder='Enter your password'
                                value={password}
                                onChange={onChange}
                                classNames={{
                                    input: "text-white focus:outline-none h-full",
                                    inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 items-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/5"
                                }}
                                size="lg"
                            />
                            <div className="space-y-4 pt-4">
                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-700 text-white hover:bg-emerald-600 font-medium rounded-lg py-2 mb-4 transition-all duration-300 hover:shadow-emerald-500/20"
                                    size="lg"
                                >
                                    Login
                                </Button>
                                <Link to="/">
                                    <Button
                                        className='w-full bg-red-700 text-white hover:bg-red-800 font-medium rounded-lg py-2 transition-all duration-300 hover:shadow-red-500/20'
                                        size="lg"
                                    >
                                        Go Back
                                    </Button>
                                </Link>
                                <div className="text-center space-y-4 pt-4 border-t border-white/5">
                                    <p className="text-zinc-500 text-sm">
                                        Don't have an account?
                                    </p>
                                    <Link to="/register" className="block">
                                        <Button
                                            className='w-full bg-zinc-800 text-white hover:bg-zinc-700 font-medium rounded-lg py-2 transition-all duration-300 border border-white/10'
                                            size="lg"
                                        >
                                            Create Account
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Login
