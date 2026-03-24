import React, { useContext, useState } from 'react'
import { motion } from 'motion/react'
import { AppContext } from '../context/AppContext';
import sample_img_1 from '../../public/sample_img_1.png';
const Result = () => {

    const [image, setImage] = useState();
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [loading, setLoading] = useState(false);
    const [prompt, setPrompt] = useState('');

    const { generateImage } = useContext(AppContext);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (prompt) {
            const image = await generateImage(prompt);
            if (image) {
                setIsImageLoaded(true);
                setImage(image);
            }
        }
        setLoading(false);
    }

    return (
        <motion.div
            className='flex flex-col items-center justify-center min-h-[80vh] gap-5'
            initial={{ opacity: 0.2, y: 100 }}
            transition={{ duration: 1 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
        >
            <div className='relative'>
                <div className='w-full sm:w-sm aspect-square border-2 border-[#ffffffaf] rounded-lg flex justify-center items-center px-4 py-6'>

                    <img
                        src={isImageLoaded ? image : sample_img_1}
                        alt=""
                        className={`w-full h-full object-contain ${loading && 'opacity-50 blur-sm'}`}
                    />

                </div>
                <span className={`absolute left-0 bottom-0 h-1 rounded-lg ${loading ? 'w-full transition-all duration-[10s]' : 'w-0'} bg-[#b49166] `} />
            </div>
            {
                !isImageLoaded ? (
                    <form
                        onSubmit={handleSubmit}
                        className='flex sm:flex-row flex-col w-full max-w-2xl font-light p-0.5 mt-10 gap-5 sm:rounded-full sm:border sm:border-[#ffffffaf]'>
                        <input
                            type="text"
                            disabled={loading}
                            placeholder='Imagine something... then type it in words'
                            onChange={e => { setPrompt(e.target.value) }}
                            value={prompt}
                            className={`flex-1 bg-transparent outline-none sm:ml-8 text-sm 
  max-sm:border max-sm:border-[#ffffffaf] max-sm:w-auto max-sm:px-8 
  max-sm:rounded-full max-sm:py-3
  ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        />
                        <button
                            type='submit'
                            disabled={loading}
                            className={`bg-[#b49166] w-auto border-none rounded-full px-10 sm:px-16 py-3 
    transition-all duration-500 text-black font-medium
    ${loading
                                    ? 'opacity-50 cursor-not-allowed'
                                    : 'hover:bg-[#a17f5c] hover:scale-[1.01] cursor-pointer'
                                }`}
                        >
                            {loading ? 'Generating...' : 'Generate'}
                        </button>
                    </form>
                ) : (
                    <div className='flex gap-5 flex-wrap justify-center items-center text-sm p-0.5 mt-10 rounded-full'>
                        <p
                            onClick={() => {
                                setIsImageLoaded(false);
                                setPrompt('');       // clear input
                                setImage(null);      // optional (good practice)
                                setLoading(false);   // reset loading
                            }}
                            className='bg-transparent border border-[#ffffffaf] px-8 py-3 rounded-full cursor-pointer hover:scale-[1.03] transition-all duration-500'>
                            Reload the Vision
                        </p>
                        <a
                            href={image}
                            download
                            className='bg-[#b49166] border-none px-14 py-3 rounded-full cursor-pointer hover:scale-[1.03] transition-all duration-500 text-black'>
                            Download
                        </a>
                    </div>
                )
            }
        </motion.div>
    )
}

export default Result
