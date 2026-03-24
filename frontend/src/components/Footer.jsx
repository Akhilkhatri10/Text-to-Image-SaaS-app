import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from "motion/react"

const Footer = () => {
    return (
        <motion.div 
            className='flex items-center justify-between pt-20 pb-12 max-md:flex-wrap max-md:justify-center max-md:gap-10'
            initial={{opacity: 0}}
            transition={{duration: 1.5, delay: 0.3}} 
            whileInView={{opacity: 1}}
            viewport={{once: true}}
        >
            <div className='flex items-center justify-center gap-10 max-sm:flex-wrap'>
                <Link to={"/"}>
                    <img src="/logo.png" alt="" className='w-28 sm:w-32 lg:w-40 cursor-pointer' />
                </Link>
                <p className='text-4xl font-extralight text-[#ffffffaf] relative -top-0.5 hidden sm:block'>|</p>
                <p className='text-sm text-[#ffffffaf]'>All rights reserved. Copyright &copy; <span className='text-[#b49166] font-bold'>imaginAI</span></p>
            </div>
            <div className='flex items-center justify-center gap-4'>
                <img src="/facebook.svg" alt="" width={40} className='hover:scale-105 transition-all duration-500 cursor-pointer' />
                <img src="/instagram.svg" alt="" width={40} className='hover:scale-105 transition-all duration-500 cursor-pointer' />
                <img src="/twitter.svg" alt="" width={40} className='hover:scale-105 transition-all duration-500 cursor-pointer' />
            </div>
        </motion.div>
    )
}

export default Footer
