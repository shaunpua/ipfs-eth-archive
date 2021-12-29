import React from 'react'

function Navbar1() {
    return (
        <div className="nav-auth">
            <img className="nav-auth-logo"src={process.env.PUBLIC_URL + 'logo.png'} />
            <h1 className="nav-auth-title">ArchStorage</h1>
        </div>
    )
}

export default Navbar1
