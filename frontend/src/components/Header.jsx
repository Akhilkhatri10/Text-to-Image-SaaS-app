import React, { useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from "motion/react"
import { AppContext } from '../context/AppContext'

const Header = () => {

    const { user, setShowLogin } = useContext(AppContext)

    const navigate = useNavigate();

    const handleOnClick = () => {
        if(!user) {
            setShowLogin(true);
        } else {
            navigate('/result');
        }
    }

    return (
        <motion.div 
            className='flex flex-col items-center justify-center my-12 text-center'
            initial={{opacity: 0.2, y: 100}} // This will set the initial state of the component
            transition={{duration: 1}} // This will animate the component when it first loads
            whileInView={{opacity: 1, y: 0}} // This will animate the component when it comes into view
            viewport={{once: true}} // This ensures the animation runs only once when the component comes into view
        >
            <motion.div 
                className='inline-flex items-center justify-center text-center bg-transparent text-[#ffffffaf] rounded-full px-10 py-1 gap-1.5 border border-[#ffffffaf]'
                initial={{opacity: 0, y: -20}}
                animate={{opacity: 1, y: 0}} // This will animate the component when it first loads
                transition={{duration: 0.8, delay: 0.2}}
            >
                <p className='text-xs sm:text-sm font-light'>From words to wonder</p>
                <img src="/shooting_star.svg" alt="" />
            </motion.div>

            <motion.h1 
                className='text-4xl max-w-[300px] text-[#b49166] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center'
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                transition={{delay: 0.4, duration: 2}}
            >Turn Ideas Into <span className='text-white'>Images.</span> Instantly.</motion.h1>

            <motion.p 
                className='text-center max-w-xl sm:max-w-[590px] mx-auto mt-5'
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{delay: 0.6, duration: 0.8}}
            >From simple descriptions to complex ideas, turn your thoughts into visual reality with advanced AI image generation. <span className='text-[#b49166]'>No design experience needed.</span></motion.p>

            <motion.button
                onClick={handleOnClick}
                className='bg-[#b49166] w-auto border-none rounded-full px-12 py-3 mt-8 flex items-center justify-center text-center gap-2 hover:bg-[#a17f5c] transition-all duration-500 cursor-pointer hover:scale-105'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ default: { duration: 0.5 }, opacity: { delay: 0.8, duration: 1 } }}
            >
                <p className='sm:text-lg text-black font-medium'>Generate Image</p>
                <img src="/star.png" alt="" className='h-6' />
            </motion.button>

            <motion.div 
                className='flex flex-wrap items-center justify-center gap-3 mt-16'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
            >
                {Array(6).fill('').map((item, index) => (
                    <img className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10' src={index % 2 === 0 ? "/sample_img_2.png" : "/sample_img_1.png"} alt="" key={index} width={70} />
                ))}
            </motion.div>
            <motion.p 
                className='mt-2 text-[#ffffffaf]'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
            >Generated images from <span onClick={() => navigate('/')} className='text-[#967a56] cursor-pointer'>ImaginAI</span>
            </motion.p>
        </motion.div>
    )
}

export default Header
