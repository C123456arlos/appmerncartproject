import { Outlet } from "react-router-dom"
import Banner from "../components/Banner"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"
import CartSidebar from "../components/CartSidebar"

const AppLayout = () => {
    return (
        <>
            <Banner></Banner>
            <Navbar></Navbar>
            <main className="min-h-screen">
                <Outlet></Outlet>
            </main>
            <Footer></Footer>
            <CartSidebar></CartSidebar>
        </>
    )
}

export default AppLayout