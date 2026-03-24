import React, { useContext, useEffect, useRef, useState } from 'react'
import { AppContext } from '../context/AppContext';
import { motion } from 'motion/react';
import axios from 'axios';
import { toast } from 'react-toastify';
import OTPField from './OTPField';

const Login = () => {

    const { setShowLogin, backendUrl, setToken, setUser } = useContext(AppContext);

    const [state, setState] = useState('login');
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [auth, setAuth] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const [submitBtn, setSubmitBtn] = useState(false);
    const [sendBtn, setSendBtn] = useState(false);
    const [verifyBtn, setVerifyBtn] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [timer, setTimer] = useState(60);
    const [canResend, setCanResend] = useState(false);

    useEffect(() => {
        let interval;

        if (otpSent && timer > 0) {
            interval = setInterval(() => {
                setTimer(prev => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            setCanResend(true);
        }

        return () => clearInterval(interval);
    }, [otpSent, timer]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = 'unset';
        }
    }, [])

    const handleSendOtp = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setSendBtn(true);

        try {
            const { data } = await axios.post(backendUrl + '/api/user/send-otp', {
                email,
                name,
                state
            })

            if (data.success) {
                toast.success('OTP sent!');
                setOtpSent(true);
                setTimer(60);
                setCanResend(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to send OTP.');
        } finally {
            setSendBtn(false); // Always resets the btn
        }
    }

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setVerifyBtn(true);

        try {
            const { data } = await axios.post(backendUrl + '/api/user/verify-otp', {
                email,
                otp
            })

            if (data.success) {
                toast.success('OTP Verified!');
                setAuth(true);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to verify OTP.');
        } finally {
            setVerifyBtn(false); // Always resets the btn
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitBtn(true);
        if (state === 'register' && !auth) {
            toast.error('Please verify the OTP first!');
            setSubmitBtn(false);
            return;
        }

        try {
            if (state === 'login') {
                const { data } = await axios.post(backendUrl + '/api/user/login', {
                    email,
                    password
                })
                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                } else {
                    toast.error(data.message)
                }
            } else if (state === 'register') {
                const { data } = await axios.post(backendUrl + '/api/user/register', {
                    name,
                    email,
                    password
                })
                if (data.success) {
                    setToken(data.token);
                    setUser(data.user);
                    localStorage.setItem('token', data.token);
                    setShowLogin(false);
                } else {
                    toast.error(data.message);
                }
            }
        } catch (error) {
            toast.error(error.message);
        } finally {
            setSubmitBtn(false); // resets btn no matter what
        }
    }

    const handleResetPassword = async (e) => {
        e.preventDefault();

        if (!newPassword) {
            toast.error("Please enter a new password!");
            return;
        }

        try {
            const { data } = await axios.post(
                backendUrl + '/api/user/reset-password',
                {
                    email,
                    newPassword
                }
            );

            if (data.success) {
                toast.success("Password reset successful!");

                setState('login');

                // CLEAR EVERYTHING
                setPassword('');
                setNewPassword('');
                setOtp('');
                setOtpSent(false);
                setAuth(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("Something went wrong");
        }
    };

    return (
        <motion.div
            className='fixed left-0 right-0 top-0 bottom-0 z-10 backdrop-blur-sm bg-black/30 flex justify-center items-center'
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <form
                onSubmit={handleSubmit}
                className='relative bg-white/75 p-10 rounded-xl text-black'
            >
                <h1 className='text-center text-2xl font-medium text-[#5c4d38]'>
                    {
                        state === 'login'
                            ? 'Log In'
                            : state === 'register'
                                ? 'Register'
                                : 'Reset Password'
                    }
                </h1>
                <p className='text-xs text-center'>
                    {
                        state === 'login'
                            ? 'Ready to visualize again? Log in to start.'
                            : state === 'register'
                                ? 'New here? Let’s get you onboarded.'
                                : 'Reset your password securely'
                    }
                </p>
                {
                    state === 'register' && (
                        <div className='border-[1.5px] border-black/50 px-4 py-2 flex items-center rounded-full mt-5 gap-3'>
                            <img src="/name.png" alt="" width={20} />
                            <input
                                onChange={e => {
                                    setName(e.target.value)
                                }}
                                value={name}
                                type="text"
                                placeholder='Full Name'
                                required
                                className='outline-none placeholder-text text-sm'
                            />
                        </div>
                    )
                }
                <div className='border-[1.5px] border-black/50 px-4 py-2 flex items-center rounded-full mt-4 gap-3'>
                    <img src="/email.png" alt="" width={20} />
                    <input
                        onChange={e => {
                            setEmail(e.target.value);
                        }}
                        value={email}
                        type="email"
                        placeholder='Email Id'
                        required
                        className='outline-none placeholder-text text-sm'
                    />
                </div>
                {state !== 'forgot' && (
                    <div className='border-[1.5px] border-black/50 px-4 py-2 flex items-center rounded-full mt-4 gap-3'>
                        <img src="/password.png" alt="" width={20} />
                        <input
                            onChange={e => {
                                setPassword(e.target.value);
                            }}
                            value={password}
                            type="password"
                            placeholder='Password'
                            required
                            className='outline-none placeholder-text text-sm'
                        />
                    </div>
                )}
                {
                    state === 'login' && (
                        <>
                            <p
                                onClick={() => setState('forgot')}
                                className='text-xs text-blue-900 ml-1 mt-4 cursor-pointer'
                            >
                                Can't remember your password?
                            </p>
                            <button
                                type="submit"
                                disabled={submitBtn}
                                className={`${!submitBtn ? 'bg-[#5c4d38] hover:scale-[1.02] text-white' : 'bg-[#5c4d3884] hover:cursor-not-allowed text-black'} border-none text-sm w-full py-2 rounded-full mt-4 cursor-pointer transition-all duration-700`}
                            >
                                {submitBtn ? 'Loading...' : 'Log In'}
                            </button>
                        </>
                    )}
                {state === 'register' && (
                    <>
                        {
                            !otpSent && (
                                <button
                                    onClick={handleSendOtp}
                                    disabled={sendBtn}
                                    className={`${!sendBtn ? 'bg-[#5c4d38] hover:scale-[1.02] text-white' : 'bg-[#5c4d3884] hover:cursor-not-allowed text-black'} border-none text-sm w-full py-2 rounded-full mt-4 cursor-pointer transition-all duration-700`}
                                >
                                    {sendBtn ? 'Sending OTP...' : 'Send OTP'}
                                </button>
                            )
                        }
                        {
                            otpSent && !auth && (
                                <>
                                    <OTPField onChangeOtp={setOtp} />
                                    <button
                                        onClick={handleVerifyOtp}
                                        disabled={verifyBtn}
                                        className={`${!verifyBtn ? 'bg-[#5c4d38] hover:scale-[1.02] text-white' : 'bg-[#5c4d3884] hover:cursor-not-allowed text-black'} border-none text-sm w-full py-2 rounded-full mt-4 cursor-pointer transition-all duration-700`}
                                    >
                                        {verifyBtn ? 'Verifying OTP...' : 'Verify OTP'}
                                    </button>

                                    <button
                                        onClick={handleSendOtp}
                                        disabled={!canResend}
                                        className={`mt-3 px-6 py-2 rounded-full ${canResend
                                            ? 'bg-[#b49166] text-black'
                                            : 'bg-gray-400 cursor-not-allowed'
                                            }`}
                                    >
                                        {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                                    </button>
                                </>
                            )
                        }
                        {
                            auth && (
                                <button
                                    type="submit"
                                    disabled={submitBtn}
                                    className={`${!submitBtn ? 'bg-[#5c4d38] hover:scale-[1.02] text-white' : 'bg-[#5c4d389e] hover:cursor-not-allowed text-black'} border-none text-sm w-full py-2 rounded-full mt-4 cursor-pointer transition-all duration-700`}
                                >
                                    {submitBtn ? 'Loading...' : 'Register'}
                                </button>
                            )
                        }
                    </>
                )}
                {state === 'login' && (
                    <p className='mt-5 text-center text-xs'>
                        New here?{' '}
                        <span
                            onClick={() => setState('register')}
                            className='text-blue-900 cursor-pointer'
                        >
                            Register Now!
                        </span>
                    </p>
                )}

                {state === 'register' && (
                    <p className='mt-5 text-center text-xs'>
                        Existing user?{' '}
                        <span
                            onClick={() => setState('login')}
                            className='text-blue-900 cursor-pointer'
                        >
                            Log In!
                        </span>
                    </p>
                )}
                {
                    state === 'forgot' && (
                        <>
                            {/* <div className='border px-4 py-2 rounded-full mt-4'>
                                <input
                                    type="email"
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div> */}

                            {
                                !otpSent && (
                                    <button
                                        onClick={handleSendOtp}
                                        disabled={sendBtn}
                                        className={`${!sendBtn
                                            ? 'bg-[#5c4d38] hover:scale-[1.02] text-white'
                                            : 'bg-[#5c4d3884] hover:cursor-not-allowed text-black'} 
        border-none text-sm w-full py-2 rounded-full mt-4 cursor-pointer transition-all duration-700`}
                                    >
                                        {sendBtn ? 'Sending OTP...' : 'Send OTP'}
                                    </button>
                                )
                            }

                            {
                                otpSent && !auth && (
                                    <>
                                        <OTPField onChangeOtp={setOtp} />
                                        <button
                                            onClick={handleVerifyOtp}
                                            disabled={verifyBtn}
                                            className={`${!verifyBtn
                                                ? 'bg-[#5c4d38] hover:scale-[1.02] text-white'
                                                : 'bg-[#5c4d3884] hover:cursor-not-allowed text-black'} 
        border-none text-sm w-full py-2 rounded-full mt-4 cursor-pointer transition-all duration-700`}
                                        >
                                            {verifyBtn ? 'Verifying OTP...' : 'Verify OTP'}
                                        </button>
                                        <button
                                            onClick={handleSendOtp}
                                            disabled={!canResend}
                                            className={`mt-3 px-6 py-2 rounded-full ${canResend
                                                    ? 'bg-[#b49166] text-black'
                                                    : 'bg-gray-400 cursor-not-allowed'
                                                }`}
                                        >
                                            {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                                        </button>
                                    </>
                                )
                            }

                            {
                                auth && (
                                    <>
                                        <input
                                            type="password"
                                            placeholder="New Password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            required
                                            className='border-[1.5px] border-black/50 px-4 py-2 flex items-center rounded-full mt-4 gap-3 outline-none placeholder-text text-sm w-full'
                                        />
                                        <button
                                            onClick={handleResetPassword}
                                            disabled={submitBtn}
                                            className={`${!submitBtn
                                                ? 'bg-[#5c4d38] hover:scale-[1.02] text-white'
                                                : 'bg-[#5c4d389e] hover:cursor-not-allowed text-black'} 
        border-none text-sm w-full py-2 rounded-full mt-4 cursor-pointer transition-all duration-700`}
                                        >
                                            {submitBtn ? 'Loading...' : 'Reset Password'}
                                        </button>
                                    </>
                                )
                            }

                            <p
                                onClick={() => {
                                    setState('login');
                                    setOtp('');
                                    setOtpSent(false);
                                    setAuth(false);
                                    setNewPassword('');
                                }}
                                className='text-xs text-blue-900 cursor-pointer mt-4 text-center'
                            >
                                Back to Login
                            </p>
                        </>
                    )
                }
                <img src="/assets/close.svg" alt="" onClick={() => { setShowLogin(false); setSendBtn(false); setVerifyBtn(false); setSubmitBtn(false) }} className='absolute top-5 right-5 cursor-pointer' />
            </form>
        </motion.div>
    )
}

export default Login
