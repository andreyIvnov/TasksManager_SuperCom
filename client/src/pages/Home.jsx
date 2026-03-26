import { useEffect } from "react"
import { Link, Outlet, useNavigate } from "react-router-dom"
import "../styles/Home.css"
import "../styles/nav-responsive.css"

function Home() {
    const navigateTo = useNavigate();

    useEffect(() => {
        navigateTo('tasks');
    }, [])
    

    const navItems = [
        { label: 'Tasks', path: 'tasks' },
        { label: 'Tags', path: 'tags' },
        { label: 'Users', path: 'users' },
    ]

    return (
        <div className="home-layout">
            <div className="home-nav-container">
                <nav className="home-nav">
                    <div className="home-nav-brand">
                        <span className="home-nav-greeting">Hi, User</span>
                    </div>
                    <div className="home-nav-items">
                        {navItems.map((item, idex) => {
                            return (
                                <Link 
                                    key={idex} 
                                    to={item.path}
                                    className="home-nav-link"
                                >
                                    {item.label}
                                </Link>
                            )
                        })}
                    </div>
                </nav>
            </div>
            <div className="home-content">
                <Outlet />
            </div>
        </div>
    )
}
export default Home