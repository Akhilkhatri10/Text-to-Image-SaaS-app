import React from 'react'
import { motion } from 'motion/react';

const Testimonials = () => {
    const tests = [
        {
            image: "/cust1.png",
            name: "Jane Smith",
            role: "Graphic Designer",
            stars: 4,
            text: "I love how easy it is to create engaging content. The AI does a fantastic job understanding my needs."
        },
        {
            image: "/cust2.png",
            name: "Alice Johnson",
            role: "Freelancer",
            stars: 5,
            text: "As a freelancer, I need to produce high-quality content quickly. This service has been a game-changer for me!"
        },
        {
            image: "/cust1.png",
            name: "Bob Brown",
            role: "Content Creator",
            stars: 4,
            text: "The AI-generated content is impressive! It helps me maintain a consistent flow of ideas and saves me hours of work."
        }
    ]
    return (
        <motion.div 
            className='flex flex-col items-center justify-center py-16 text-center'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h2 className='text-3xl sm:text-4xl font-semibold mb-2 text-[#b49166]'>Customer Testimonials</h2>
            <p className='text-[#ffffffaf] mb-8'>Hear from Our Users.</p>
            <div className='flex items-center justify-center gap-20 mt-16 flex-wrap'>
                {
                    tests.map((test, index) => (
                        <div key={index} className='bg-[#1f1f1f] flex flex-col justify-center items-center p-6 rounded-lg w-full max-w-xs hover:scale-[1.03] transition-all duration-500'>
                            <div className='flex flex-col items-center mb-4'>
                                <img src={test.image} alt={test.name} className='w-12 h-12 rounded-full border-2 border-[#b49166]' />
                                <div>
                                    <h3 className='text-lg font-semibold text-[#b49166]'>{test.name}</h3>
                                    <p className='text-sm text-[#ffffffaf]'>{test.role}</p>
                                </div>
                            </div>
                            <div className='flex mb-5'>
                                {[...Array(test.stars)].map((_, i) => (
                                    <img key={i} src="/rating_star.svg" alt="" />
                                ))}
                                {[...Array(5 - test.stars)].map((_, i) => (
                                    <img key={i} src="/not_rated_star.svg" alt="" />
                                ))}
                            </div>
                            <p className='text-[#ffffffaf] mb-2'>{test.text}</p>
                        </div>
                    ))
                }
            </div>
        </motion.div>
    )
}

export default Testimonials
