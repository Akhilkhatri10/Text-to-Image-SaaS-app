import React, { useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import { AppContext } from '../context/AppContext'

const TryNow = () => {

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
            className='flex flex-col items-center justify-center py-24 text-center'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <h2 className='text-3xl sm:text-4xl font-semibold mb-8 text-[#b49166]'>See the magic. Try now.</h2>

            <button onClick={handleOnClick} className='bg-[#b49166] w-auto border-none rounded-full px-12 py-3 mt-8 flex items-center justify-center text-center gap-2 hover:bg-[#a17f5c] transition-all duration-500 cursor-pointer hover:scale-105'>
                <p className='sm:text-lg text-black font-medium'>Generate Image</p>
                <img src="/star.png" alt="" className='h-6' />
            </button>
        </motion.div>
    )
}

export default TryNow
