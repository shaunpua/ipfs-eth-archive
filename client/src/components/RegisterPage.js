import React, {useContext, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";

function RegisterPage() {
    const [address, setaddress] = useState(null)
    const [username, setUsername] = useState('');
    const [password, setpassword] = useState('');
    const [passwordC, setpasswordC] = useState('');
    const navigate = useNavigate();

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    console.log('context provider data ',web3, contract, accounts[0]);


    const formValidation = (userN, pass, passC) => {

        if (userN.length < 5 || userN.length < 6 || userN.length < 6){
            return false;
        }

        if (pass !== passC) {
            return false
        }



        return true;
    }

    const registerSubmit = (e) => {
        e.preventDefault();

        console.log(username, password);
        const formVal = formValidation(username, password, passwordC);
        if (formVal === true){
            navigate('/auth');
        } else {
            alert('Wrong register input details!')
        }

        
    }
    return (
        <div>
            <h2>Create account</h2>
            <form onSubmit={registerSubmit}>
            <label>Username</label>
            <input 
            type="text" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
            <label>Password</label>
            <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setpassword(e.target.value)}
            />
            <label>Confirm Password</label>
            <input 
            type="password" 
            required 
            value={passwordC}
            onChange={(e) => setpasswordC(e.target.value)}
            />
            <button>Register</button>
            </form>
            {/* <Link to="/auth">Register Button </Link> */}
        </div>
    )
}

export default RegisterPage
