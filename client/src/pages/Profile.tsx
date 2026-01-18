import React, { useEffect, useState } from 'react';
import axios from 'axios';
import NavBar from '../components/NavBar';
import { Card, CardBody, Input, Button, Select, SelectItem, Checkbox } from "@heroui/react";

const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

const Profile = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [skills, setSkills] = useState<{ value: string; locked: boolean }[]>([]);
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


    const getProfile = async () => {
        try {
            const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/profile`, {
                headers: { jwt_token: localStorage.token }
            });

            setName(response.data.name);
            setEmail(response.data.email);

            // Handle skills (could be string or array from DB)
            const rawSkills = response.data.skills;
            let skillsData: string[] = [];
            if (Array.isArray(rawSkills)) {
                skillsData = rawSkills;
            } else if (typeof rawSkills === 'string') {
                skillsData = rawSkills.split(', ').filter(Boolean);
            }

            const parsedSkills = skillsData.map((s: string) => ({
                value: s,
                locked: true
            }));
            setSkills([...parsedSkills, { value: "", locked: false }]);

            // Handle experiences (could be string or array from DB)
            const rawExp = response.data.experience;
            let expData: string[] = [];
            if (Array.isArray(rawExp)) {
                expData = rawExp;
            } else if (typeof rawExp === 'string') {
                expData = rawExp.split(', ').filter(Boolean);
            }

            const parsedExp = expData.map((e: string) => ({
                value: e,
                locked: true
            }));
            setExperiences(parsedExp);

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

    const onSubmitForm = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const skillsArray = skills
                .filter(skill => skill.value.trim() !== "")
                .map(skill => skill.value.trim());

            const experiencesArray = experiences
                .map(exp => exp.value.trim())
                .filter(Boolean);

            await axios.put(
                `${import.meta.env.VITE_API_URL}/api/profile`,
                {
                    name,
                    email,
                    skills: skillsArray,
                    experience: experiencesArray
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
        <div className='min-h-screen flex flex-col pb-20 text-white'>
            <div className='p-8 rounded-lg text-center mb-4'>
                <h1 className='text-6xl font-bold text-white tracking-tight'>Insight</h1>
                <div className='text-center pt-8 text-emerald-400 font-medium italic opacity-80'>
                    Update your professional profile
                </div>
            </div>

            <div className='flex justify-center pb-12 relative z-50'>
                <NavBar isAuthenticated={true} />
            </div>

            <div className='px-4 md:px-8 w-full max-w-5xl mx-auto space-y-8 motion-scale-in-[0.95] motion-opacity-in-[0%] motion-duration-[0.8s]'>
                <Card className='bg-zinc-900/80 backdrop-blur-xl border border-white/5 hover:border-emerald-500/20 transition-all duration-500 shadow-2xl'>
                    <CardBody className="p-8 md:p-12">
                        <form onSubmit={onSubmitForm} className="space-y-12">
                            {/* Personal Information Section */}
                            <div className="space-y-6">
                                <h4 className='text-white font-bold text-xl border-b border-white/5 pb-2'>Personal Information</h4>
                                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                                    <Input
                                        placeholder="Full Name"
                                        value={name}
                                        onChange={handleNameChange}
                                        classNames={{
                                            input: "text-white focus:outline-none h-full",
                                            inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 items-center transition-all duration-300 shadow-lg"
                                        }}
                                        size="lg"
                                    />
                                    <Input
                                        placeholder="Email Address"
                                        value={email}
                                        onChange={handleEmailChange}
                                        classNames={{
                                            input: "text-white focus:outline-none h-full",
                                            inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 items-center transition-all duration-300 shadow-lg"
                                        }}
                                        size="lg"
                                    />
                                </div>
                            </div>

                            {/* Skills Section */}
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
                                            inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 group-data-[focus=true]:border-emerald-500/80 rounded-lg h-14 items-center transition-all duration-300 shadow-lg"
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

                            {/* Experience Section */}
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
                                                    trigger: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 rounded-lg h-14",
                                                    value: "text-white",
                                                    popoverContent: "bg-zinc-900 border border-white/10 text-white"
                                                }}
                                            >
                                                {months.map((month) => (
                                                    <SelectItem key={month} className="text-white">
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
                                                    input: "text-white h-full",
                                                    inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 rounded-lg h-14"
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
                                                            trigger: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 rounded-lg h-14",
                                                            value: "text-white",
                                                            popoverContent: "bg-zinc-900 border border-white/10 text-white"
                                                        }}
                                                    >
                                                        {months.map((month) => (
                                                            <SelectItem key={month} className="text-white">
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
                                                            input: "text-white h-full",
                                                            inputWrapper: "bg-zinc-800/50 border border-white/10 hover:border-emerald-500/50 rounded-lg h-14"
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
                                                        wrapper: "w-4 h-4 min-w-[16px] m-0 before:border-emerald-500/30 after:bg-emerald-600",
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

                            <div className="flex justify-center pt-8 border-t border-white/5">
                                <Button
                                    type="submit"
                                    className="px-16 bg-emerald-700 text-white hover:bg-emerald-600 font-bold rounded-lg h-14 transition-all duration-300 hover:shadow-emerald-500/20"
                                    size="lg"
                                >
                                    Save Profile Changes
                                </Button>
                            </div>
                        </form>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Profile
