import React from 'react';
import Navbar from '../Layouts/Navbar';
import Footer from '../Layouts/Footer';
import { Outlet } from 'react-router-dom';

const Layout = () => {
    return (
        <>
        <Navbar />

        <main>

            <Outlet />

        </main>

        <Footer />
        </>
        
    )
}
export default Layout
