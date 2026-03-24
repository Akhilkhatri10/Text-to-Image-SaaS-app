import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import About from '../components/About'
import Testimonials from '../components/Testimonials'
import TryNow from '../components/TryNow'

const Home = () => {
    return (
        <div>
            <Header />
            <Steps />
            <About />
            <Testimonials />
            <TryNow />
        </div>
    )
}

export default Home
