import React, { useContext } from 'react'
import { AppContext } from '../context/AppContext'
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';

const BuyCredits = () => {

    const { user, backendUrl, loadCredits, token, setShowLogin } = useContext(AppContext);

    const navigate = useNavigate();

    const initPayment = async ({ amount, currency, orderId, key, receipt }) => {
        const options = {
            key,
            amount,
            currency,
            name: "imaginAI",
            description: `Payment for credits`,
            order_id: orderId,
            receipt: receipt,
            handler: async (response) => {
                try {
                    const { data } = await axios.post(backendUrl + '/api/user/verify-payment', { response }, {
                        headers: { token }
                    })

                    if(data.success) {
                        loadCredits();
                        navigate('/');
                        toast.success('Successfully added credits to your account!');
                    }
                } catch (error) {
                    toast.error(error.message)
                }
            },
            prefill: {
                name: user?.name,
                email: user?.email,
            },
            theme: {
                color: "#b49166",
            }
        }

        const rzpy = new window.Razorpay(options);
        rzpy.open();
    }

    const handlePayment = async (planId) => {
        try {
            if(!user) {
                setShowLogin(true);
                return;
            }

            const { data } = await axios.post(backendUrl + '/api/user/pay', { planId }, {
                headers: { token }
            })

            if(data.success) {
                initPayment(data);
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const plans = [
        {
            icon: "/basic.png",
            id: "Basic",
            desc: "For individuals and hobbyists",
            price: "$9.99",
            credits: "50 Credits",
            costpercredit: "$0.20",
        },
        {
            icon: "/advanced.png",
            id: "Advanced",
            desc: "Built for creators and pros",
            price: "$29.99",
            credits: "250 Credits",
            costpercredit: "$0.12",
        },
        {
            icon: "/business.png",
            id: "Business",
            desc: "Designed for teams and enterprises",
            price: "$79.99",
            credits: "1000 Credits",
            costpercredit: "$0.08",
        }
    ]

    return (
        <motion.div 
            className='flex flex-col items-center justify-center my-12 text-center'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div className='inline-flex items-center justify-center text-center bg-transparent text-white rounded-full px-10 py-1 gap-1.5 border border-white'>
                <p className='text-xs sm:text-sm font-light'>FIND YOUR PLAN</p>
            </div>
            <h2 className='text-3xl sm:text-4xl font-semibold my-7 text-[#b49166]'>Fuel Your Imagination</h2>
            <div className='flex items-center gap-20 w-full mt-16 flex-wrap justify-center'>
                {
                    plans.map((plan, index) => (
                        <div key={index} className='bg-[#1f1f1f] flex flex-col justify-center items-center p-6 rounded-lg w-full max-w-xs'>
                            <div className='flex items-center ml-4 mb-3 w-full'>
                                <img src={plan.icon} alt={plan.name} width={40} />
                                <h3 className='text-left mx-3 text-2xl font-semibold text-[#b49166]'>{plan.id}</h3>
                            </div>
                            <p className='text-sm text-[#ffffffaf] text-left w-full ml-4'>{plan.desc}</p>
                            <p className='text-[#ffffffaf] mt-4 mb-2 w-full text-left ml-4 font-light text-sm'><span className='text-2xl font-medium'>{plan.price}</span> / {plan.credits}</p>
                            <p className='text-[#ffffffaf] text-sm w-full text-left ml-4'>{plan.costpercredit} per credit</p>
                            <button onClick={() => {handlePayment(plan.id)}} className='border-none bg-[#b49166] text-black text-xs sm:text-sm py-3 font-medium w-full rounded-lg mt-10 cursor-pointer hover:scale-[1.03] transition-all duration-500 hover:bg-[#a17f5c]'>{!user ? 'Activate Plan!' : 'Purchase'}</button>
                        </div>
                    ))
                }
            </div>
        </motion.div>
    )
}

export default BuyCredits
