import React, {useState, useContext} from 'react'
import {useNavigate } from "react-router-dom";
import BlockchainContext from "../../BlockchainContext";


function Navbar2() {
    const navigate = useNavigate();

    //button disabler states
    const [signoutDisable, setSignoutDisable] = useState(false);

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    
    const logoutSubmit = async () => {

        setSignoutDisable(true);
        try {
            await contract.methods.logout(accounts[0]).send({ from: accounts[0] });  
            setSignoutDisable(false);  
            navigate('/auth');          
                
        } catch (err){
            console.log(err)
            setSignoutDisable(false);
                
          }
    }

    return (
        <div className="nav-home">
            
            <div className="nav-home-left">
                <img className="nav-home-logo" src={`${process.env.PUBLIC_URL}/logo.png`}  /> 
                {/* <img className="nav-home-logo"src={process.env.PUBLIC_URL + 'logo.png'} />  */}
                <h2 className="nav-home-title">ArchStorage</h2>
                
            </div>
            <div className="nav-home-right">
                
                <h2 className="nav-home-account">Account: {accounts[0]}</h2>
                <button disabled={signoutDisable} className="logout-button" onClick={logoutSubmit}>Sign out</button>
            </div>
        </div>
    )
}

export default Navbar2
