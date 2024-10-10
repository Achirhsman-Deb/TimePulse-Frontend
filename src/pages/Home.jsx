import React, { useEffect } from 'react'
import Layout from '../components/layout'
import Welcome from '../components/welcome'
import Items from '../components/Items'

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])
    return (
        <Layout>
            <Welcome/>
            <Items/>
        </Layout>
    )
}

export default Home