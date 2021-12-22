import React, {useContext} from "react";
import BlockchainContext from "../BlockchainContext";
import { Link } from "react-router-dom";

function AuthPage() {

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    console.log('context provider data ',web3, contract, accounts[0]);

    return (
        <div className="AuthPage">
            <h1>Login</h1>
            <Link to="/login">To Login Button </Link>
            <h1>Register</h1>
            <Link to="/register">To Register Button </Link>
        </div>
        
    )

}

export default AuthPage;