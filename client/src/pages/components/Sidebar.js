import React from 'react'
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
    return (
        <div className="sidebar">
            <Link  to="/" className="sidebar-link">All Files</Link>
            <Link  to="/transactions" className="sidebar-link">Transactions</Link>
            <Link  to="/guide" className="sidebar-link">Guide </Link>
            <p className="sidebar-end">Copyright @2021</p>
            
        </div>
    )
}

export default Sidebar
