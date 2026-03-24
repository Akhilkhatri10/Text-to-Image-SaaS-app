import React, { useRef, useState } from 'react'

const OTPField = ({ onChangeOtp }) => {
    const [otp, setOtp] = useState(new Array(6).fill(''))
    const inputRefs = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;

        if(!/^\d*$/.test(value)) {
            return;
        }

        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        onChangeOtp(newOtp.join(''));

        if(value && index < 5) {
            inputRefs.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if(e.key === 'backspace') {
            if(!otp[index] && index > 0) {
                inputRefs.current[index - 1].focus();
            }
        }
    }

    const handlePaste = (e) => {
        const paste = e.clipboardData.getData('text');
        if(/^\d{6}$/.test(paste)) {
            const newOtp = paste.split('');
            setOtp(newOtp);
            onChangeOtp(paste);
            inputRefs.current[5].focus();
        }
    }

    return (
        <div className='flex gap-2 mt-4 justify-center' onPaste={handlePaste}>
            {
                otp.map((digit, index) => (
                    <input 
                        key={index}
                        type='text'
                        inputMode='numeric'
                        maxLength={1}
                        value={digit}
                        onChange={(e) => {handleChange(e, index)}}
                        onKeyDown={(e) => {handleKeyDown(e, index)}}
                        ref={(element) => {inputRefs.current[index] = element}}
                        className='w-10 h-12 text-center text-xl border border-gray-400 rounded-md focus:outline-none'
                    />
                ))
            }
        </div>
    )
}

export default OTPField
