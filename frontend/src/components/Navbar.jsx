import { React, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { motion } from 'motion/react'

const Navbar = () => {
    // const [user, setUser] = useState(true);
    const { user, setShowLogin, logout, credits } = useContext(AppContext);

    const navigate = useNavigate();

    return (
        <motion.div 
            className='flex items-center justify-between py-8'
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 2, delay: 0.5 }}
            viewport={{ once: true }}
        >
            <Link to={"/"}>
                <img src="/logo.png" alt="" className='w-28 sm:w-32 lg:w-40 cursor-pointer' />
            </Link>
            {
                user ?
                <div className='flex items-center gap-3 sm:gap-5'>
                    <button onClick={() => navigate("/buy-credits")} className='bg-[#b49166] text-black rounded-full px-4 py-2 sm:py-2.5 sm:px-4 flex items-center gap-2 border-none hover:scale-105 transition-all duration-500 cursor-pointer'>
                        <img src="/credit.png" alt="" className='w-5' />
                        <p className='text-xs sm:text-sm font-medium'>Credits left: {credits}</p>
                    </button>
                    <div className='flex items-center gap-1.5 sm:gap-2.5'>
                        <p className='max-sm:hidden'>Hi, {user.name}!</p>
                        <div className='relative group cursor-pointer'>
                            <img src="/profile.png" alt="" className='w-10' />
                            <div className='absolute hidden group-hover:block top-0 -right-1.5 z-10 rounded pt-12'>
                                <ul className='flex justify-center items-center gap-1 list-none m-0 py-2 px-4 bg-[#b49166] text-black text-sm rounded-lg'>
                                    <li 
                                        onClick={logout} 
                                        className='px-1 py-1 cursor-pointer'
                                    >Logout</li>
                                    <img src="/logout.png" alt="" width={18} />
                                </ul>
                            </div>
                        </div>
                    </div>
                    <img src="/sm-logout.png" alt="" onClick={logout} width={30} className='cursor-pointer hidden max-lg:block' />
                </div>
                :
                <div className='flex items-center gap-3 sm:gap-8'>
                    <p onClick={() => navigate("/buy-credits")} className='cursor-pointer text-[#b49166]'>Pricing</p>
                    <button onClick={() => (setShowLogin(true))} className='bg-[#b49166] border-none text-black px-5 py-2.5 sm:px-8 rounded-full text-sm cursor-pointer hover:bg-[#a17f5c] transition-all duration-300'>Login</button>
                </div>
            }
        </motion.div>
    )
}

export default Navbar
