import React, {useContext} from 'react'
import {useNavigate } from "react-router-dom";
import BlockchainContext from "../../BlockchainContext";


function Navbar2() {
    const navigate = useNavigate();


    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    console.log('context provider data ',web3, contract, accounts[0]);

    const logoutSubmit = async () => {
        try {
          // const loginCAll = await contract.methods.login(accounts[0], password).call();
          await contract.methods.logout(accounts[0]).send({ from: accounts[0] });
                
            
                
            navigate('/auth');
                
                
        } catch (err){
            console.log(err)
            
                
          }
    }
    return (
        <div className="nav-home">
            
            <div className="nav-home-left">
                <img className="nav-home-logo"src={process.env.PUBLIC_URL + 'logo.png'} /> 
                <h2 className="nav-home-title">ArchStorage</h2>
                
            </div>
            <div className="nav-home-right">
                
                <h2 className="nav-home-account">Account: {accounts[0]}</h2>
                <button className="logout-button" onClick={logoutSubmit}>Sign out</button>
            </div>
        </div>
    )
}

export default Navbar2
