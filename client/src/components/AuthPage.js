import React, {useContext} from "react";
import BlockchainContext from "../BlockchainContext";

function AuthPage() {

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    console.log('context provider data ',web3, contract, accounts[0]);

    return (
        <div className="AuthPage">
            <h1>Login</h1>
            <h1>Register</h1>
        </div>
        
    )

}

export default AuthPage;