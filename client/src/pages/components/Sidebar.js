import React from 'react'
import { Link, useNavigate } from "react-router-dom";

function Sidebar() {
    return (
        <div className="sidebar">
            <Link  to="/" className="sidebar-link">All Files</Link>
            <Link  to="/auth" className="sidebar-link">Transactions</Link>
            <p className="sidebar-end">Copyright @2021</p>
            
        </div>
    )
}

export default Sidebar
