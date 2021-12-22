import React, {useContext} from "react";
import { Link } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";

function LoginPage() {

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    console.log('context provider data ',web3, contract, accounts[0]);
    return (
        <div>
             <Link to="/">Login Button </Link>
        </div>
    )
}

export default LoginPage
