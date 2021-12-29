import React, {useContext} from "react";
import BlockchainContext from "../BlockchainContext";
import { Link } from "react-router-dom";
import NavBar1 from "./components/Navbar1"


function AuthPage() {

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    console.log('context provider data ',web3, contract, accounts[0]);

    return (
        
        <div className="AuthPage">
            <NavBar1/>
            
            <div className="auth-container">
                <p className="auth-container-label">Login</p>
                <Link to="/login" style={{ 
            color: 'white', 
            backgroundColor: '#6b77e8',
            width: '100%',
            margin: '20px 0px',
            padding: '8px 40px',
            borderRadius: '8px' ,
            textDecoration: 'none',
            fontSize: '0.9rem'
            }}>Login with ethereum address
            </Link >
                <p className="auth-container-label" style={{ 
            
            marginTop: '25px'
            
            }}>Register</p>
                
                <Link to="/register" style={{ 
            color: 'white', 
            backgroundColor: '#6b77e8',
            width: '100%',
            margin: '20px 0px',
            padding: '8px 40px',
            borderRadius: '8px' ,
            textDecoration: 'none',
            fontSize: '0.9rem'
            }}>Register Account</Link>
            </div>
            
        </div>
        
    )

}

export default AuthPage;