import React from 'react'
import { motion } from 'motion/react';


const About = () => {
    return (
        <motion.div 
            className='flex flex-col items-center justify-center py-12 text-center'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h2 className='text-3xl sm:text-4xl font-semibold mb-2 text-[#b49166]'>Create AI Images</h2>
            <p className='text-[#ffffffaf] mb-8'>AI Images from Your Text.</p>
            <div className='flex justify-center items-between gap-16 my-8 max-w-5xl max-lg:flex-wrap'>
                <img src="/sample_img_1.png" alt="" width={400} />
                <div className='flex flex-col text-justify justify-center max-w-lg'>
                    <h3 className='text-[#b49166] text-left text-3xl font-medium mb-5'>Introducing AI-Powered Text to Image Generator</h3>
                    <p className='text-sm mb-5 text-[#ffffffaf] leading-6'>Bring your imagination to life with our intuitive, free AI image generator. Whether you're designing, storytelling, or just exploring creativity, our tool turns your words into stunning visuals in no time. Describe your vision in a simple prompt, and let AI handle the rest — it's fast, easy, and endlessly inspiring.</p>
                    <p className='text-sm mb-5 text-[#ffffffaf] leading-6'>From futuristic concepts to lifelike portraits and beyond, our advanced AI engine transforms even the wildest ideas into high-resolution images. Whether you're an artist, entrepreneur, or curious creator, you'll discover a whole new way to visualize what’s on your mind — instantly and effortlessly.</p>
                </div>
            </div>
        </motion.div>
    )
}

export default About
