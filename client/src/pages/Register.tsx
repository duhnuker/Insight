import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Card, CardBody, CardHeader, Input, Button, Select, SelectItem, Checkbox } from "@heroui/react";

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const Register = ({ setAuth }: { setAuth: (auth: boolean) => void }) => {
    const [inputs, setInputs] = useState({
        email: "",
        password: "",
        name: "",
    });
    const [skills, setSkills] = useState([{ value: "", locked: false }]);
    const [experiences, setExperiences] = useState<{ value: string; locked: boolean }[]>([]);
    const [activeExp, setActiveExp] = useState({
        title: "",
        company: "",
        startMonth: "",
        startYear: "",
        endMonth: "",
        endYear: "",
        isCurrent: false
    });

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
        if (skills.length === 0 || skills[skills.length - 1].value.trim() !== "") {
            const newSkills = [...skills];
            if (newSkills.length > 0) {
                newSkills[newSkills.length - 1].locked = true;
            }
            setSkills([...newSkills, { value: "", locked: false }]);
        }
    };

    const removeSkillField = (index: number) => {
        const newSkills = skills.filter((_, i) => i !== index);
        setSkills(newSkills);
    };


    const addExperienceField = () => {
        if (activeExp.title.trim() && activeExp.company.trim() && activeExp.startMonth && activeExp.startYear) {
            const startStr = `${activeExp.startMonth} ${activeExp.startYear}`;
            const endStr = activeExp.isCurrent ? "Present" :
                (activeExp.endMonth && activeExp.endYear ? `${activeExp.endMonth} ${activeExp.endYear}` : "");

            if (endStr) {
                const combinedValue = `${activeExp.title.trim()} at ${activeExp.company.trim()} (${startStr} - ${endStr})`;
                setExperiences([...experiences, { value: combinedValue, locked: true }]);
                setActiveExp({
                    title: "",
                    company: "",
                    startMonth: "",
                    startYear: "",
                    endMonth: "",
                    endYear: "",
                    isCurrent: false
                });
            }
        }
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
                `${import.meta.env.VITE_API_URL}/auth/register`,
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
        <div className="min-h-screen flex justify-center items-center p-4 relative overflow-y-auto scrollbar-hide py-12">

            <div className="relative z-10 w-full max-w-3xl group">
                <div className="absolute -inset-1 bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                <Card className="bg-zinc-900/80 backdrop-blur-xl border border-white/5 group-hover:border-emerald-500/30 transition-all duration-500 group-hover:shadow-[0_0_50px_-12px_rgba(16,185,129,0.2)] w-full max-w-3xl motion-scale-in-[0.5] motion-translate-x-in-[-1%] motion-translate-y-in-[42%] motion-opacity-in-[0%] motion-blur-in-[5px] motion-duration-[1.00s]">
                    <CardHeader className="flex-col gap-4 p-8 pb-4">
                        <h1 className="text-6xl font-bold text-white text-center">Insight</h1>
                        <div className="text-center text-emerald-400 font-medium italic">
                            Start your journey with us
                        </div>
                    </CardHeader>
                    <CardBody className="p-6 md:p-10 pt-4">
                        <form onSubmit={onSubmitForm} className="space-y-12">
                            <div className="space-y-6">
                                <h4 className='text-white font-bold text-xl border-b border-white/5 pb-2'>Your information</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="md:col-span-2">
                                        <Input
                                            type='text'
                                            name='name'
                                            placeholder='Enter your full name'
                                            value={name}
                                            onChange={onChange}
                                            classNames={{
                                                input: "text-white focus:outline-none h-full",
                                                inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 items-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/5"
                                            }}
                                            size="lg"
                                        />
                                    </div>
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
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className='text-white font-bold text-xl border-b border-white/5 pb-2'>Skills</h4>

                                {/* Skills Display Area - Chips */}
                                <div className="flex flex-wrap gap-3">
                                    {skills.filter(s => s.locked).map((skill, index) => (
                                        <div key={index} className="flex gap-2 items-center bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium rounded-full py-1.5 px-4 shadow-sm group/chip hover:bg-emerald-500/20 transition-all duration-300">
                                            <span>{skill.value}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeSkillField(skills.indexOf(skill))}
                                                className="text-emerald-500/50 hover:text-red-400 transition-colors"
                                            >
                                                ✕
                                            </button>
                                        </div>
                                    ))}
                                </div>

                                {/* Skills Input Area */}
                                <div className="flex gap-3">
                                    <Input
                                        placeholder="Add a skill (e.g., React, Node.js)"
                                        value={skills.find(s => !s.locked)?.value || ""}
                                        onChange={(e) => {
                                            const activeIndex = skills.findIndex(s => !s.locked);
                                            if (activeIndex !== -1) handleSkillChange(activeIndex, e.target.value);
                                        }}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addSkillField();
                                            }
                                        }}
                                        classNames={{
                                            input: "text-white focus:outline-none h-full",
                                            inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 items-center transition-all duration-300 shadow-lg hover:shadow-emerald-500/5"
                                        }}
                                        size="lg"
                                        className="flex-1"
                                    />
                                    <Button
                                        type="button"
                                        onClick={addSkillField}
                                        className="h-14 bg-emerald-700 text-white hover:bg-emerald-600 rounded-lg px-8 transition-all duration-300 font-bold"
                                    >
                                        Add
                                    </Button>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <h4 className='text-white font-bold text-xl border-b border-white/5 pb-2'>Experience</h4>

                                {/* Experience Display Area */}
                                <div className="space-y-4">
                                    {experiences.map((exp, index) => (
                                        <div key={index} className="flex gap-4 items-center group">
                                            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-medium rounded-lg h-14 flex items-center justify-between w-full shadow-lg shadow-emerald-500/5 px-6">
                                                <span>{exp.value}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => removeExperienceField(index)}
                                                    className="opacity-50 hover:opacity-100 hover:text-red-400 transition-all text-xl"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Experience Input Area - Structured Fields */}
                                <div className="space-y-6 bg-zinc-800/20 p-6 rounded-xl border border-white/5">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <Input
                                            placeholder="Job Title (e.g. Senior Developer)"
                                            value={activeExp.title}
                                            onChange={(e) => setActiveExp({ ...activeExp, title: e.target.value })}
                                            classNames={{
                                                input: "text-white focus:outline-none h-full",
                                                inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 items-center transition-all duration-300 shadow-lg"
                                            }}
                                            size="lg"
                                        />
                                        <Input
                                            placeholder="Company (e.g. Google)"
                                            value={activeExp.company}
                                            onChange={(e) => setActiveExp({ ...activeExp, company: e.target.value })}
                                            classNames={{
                                                input: "text-white focus:outline-none h-full",
                                                inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 items-center transition-all duration-300 shadow-lg"
                                            }}
                                            size="lg"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            <Select
                                                placeholder="Start Month"
                                                size="lg"
                                                className="text-white"
                                                selectedKeys={activeExp.startMonth ? [activeExp.startMonth] : []}
                                                onSelectionChange={(keys) => setActiveExp({ ...activeExp, startMonth: Array.from(keys)[0] as string })}
                                                classNames={{
                                                    trigger: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 transition-all duration-300 shadow-lg",
                                                    value: "text-white",
                                                    popoverContent: "bg-zinc-900 border border-white/10 text-white",
                                                    listbox: "p-2 max-h-[250px] overflow-y-auto"
                                                }}
                                            >
                                                {months.map((month) => (
                                                    <SelectItem key={month} className="text-white data-[hover=true]:bg-emerald-500/20 transition-colors cursor-pointer pl-6">
                                                        {month}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                            <Input
                                                placeholder="Start Year"
                                                value={activeExp.startYear}
                                                onChange={(e) => setActiveExp({ ...activeExp, startYear: e.target.value })}
                                                maxLength={4}
                                                classNames={{
                                                    input: "text-white focus:outline-none h-full",
                                                    inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 transition-all duration-300 shadow-lg"
                                                }}
                                                size="lg"
                                            />
                                            {!activeExp.isCurrent && (
                                                <>
                                                    <Select
                                                        placeholder="End Month"
                                                        size="lg"
                                                        className="text-white"
                                                        selectedKeys={activeExp.endMonth ? [activeExp.endMonth] : []}
                                                        onSelectionChange={(keys) => setActiveExp({ ...activeExp, endMonth: Array.from(keys)[0] as string })}
                                                        classNames={{
                                                            trigger: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 transition-all duration-300 shadow-lg",
                                                            value: "text-white",
                                                            popoverContent: "bg-zinc-900 border border-white/10 text-white",
                                                            listbox: "p-2 max-h-[250px] overflow-y-auto"
                                                        }}
                                                    >
                                                        {months.map((month) => (
                                                            <SelectItem key={month} className="text-white data-[hover=true]:bg-emerald-500/20 transition-colors cursor-pointer pl-6">
                                                                {month}
                                                            </SelectItem>
                                                        ))}
                                                    </Select>
                                                    <Input
                                                        placeholder="End Year"
                                                        value={activeExp.endYear}
                                                        onChange={(e) => setActiveExp({ ...activeExp, endYear: e.target.value })}
                                                        maxLength={4}
                                                        classNames={{
                                                            input: "text-white focus:outline-none h-full",
                                                            inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 transition-all duration-300 shadow-lg"
                                                        }}
                                                        size="lg"
                                                    />
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2 cursor-pointer group" onClick={() => setActiveExp({ ...activeExp, isCurrent: !activeExp.isCurrent })}>
                                                <Checkbox
                                                    isSelected={activeExp.isCurrent}
                                                    onValueChange={(val) => setActiveExp({ ...activeExp, isCurrent: val })}
                                                    color="success"
                                                    size="sm"
                                                    classNames={{
                                                        wrapper: "w-4 h-4 min-w-[16px] m-0 before:border-emerald-500/30 after:bg-emerald-600"
                                                    }}
                                                />
                                                <span className="text-white/50 text-xs select-none group-hover:text-emerald-400/80 transition-colors pl-2">
                                                    I currently work here
                                                </span>
                                            </div>

                                            <Button
                                                type="button"
                                                onClick={addExperienceField}
                                                className="h-14 bg-emerald-700 text-white hover:bg-emerald-600 rounded-lg px-12 transition-all duration-300 font-bold"
                                            >
                                                Add Experience
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                                <Button
                                    type="submit"
                                    className="w-full bg-emerald-700 text-white hover:bg-emerald-600 font-medium rounded-lg py-2 transition-all duration-300 hover:shadow-emerald-500/20 order-1 md:order-2"
                                    size="lg"
                                >
                                    Register
                                </Button>
                                <Link to="/" className="order-2 md:order-1">
                                    <Button
                                        className='w-full bg-red-700 text-white hover:bg-red-800 font-medium rounded-lg py-2 transition-all duration-300 hover:shadow-red-500/20'
                                        size="lg"
                                    >
                                        Go Back
                                    </Button>
                                </Link>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    );
};

export default Register;
