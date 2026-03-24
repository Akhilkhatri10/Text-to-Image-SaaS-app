import React from 'react'
import { motion } from 'motion/react';

const Steps = () => {
    const steps = [
        {
            title: "Type What You Imagine",
            description: "Describe any idea, scene, or concept using simple words — your imagination is the only limit.",
            icon: "/step1.svg"
        },
        {
            title: "Let AI Visualize It",
            description: "Our intelligent AI-powered engine brings your prompt to life — generating a unique image in just seconds.",
            icon: "/step2.svg"
        },
        {
            title: "Download. Share. Repeat.",
            description: "Save your artwork instantly or share it directly with friends, clients, or the world.",
            icon: "/step3.svg"
        }
    ];
    return (
        <motion.div 
            className='flex flex-col items-center justify-center py-20 text-center'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h2 className='text-3xl sm:text-4xl font-semibold mb-2 text-[#b49166]'>How it works?</h2>
            <p className='mb-8 text-[#ffffffaf]'>Create Images with Just Words.</p>
            <div className='flex flex-col items-center justify-center gap-5 mt-8'>
                {
                    steps.map((step, index) => (
                        <div key={index} className={`flex justify-center gap-8 items-center mb-8 ${index != 2 ? "border-b border-gray-700 pb-8" : ""}`}>
                            <img src={step.icon} alt={`Step ${index + 1}`} className='w-16 h-16 mb-4' />
                            <div className='text-left'>
                                <h2 className='text-xl font-semibold mb-2'>{step.title}</h2>
                                <p className='max-w-[600px] text-[#ffffffaf]'>"{step.description}"</p>
                            </div>
                        </div>
                    ))
                }
            </div>
        </motion.div>
    )
}

export default Steps
