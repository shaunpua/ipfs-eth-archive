import React, {useContext, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";

function RegisterPage() {
    const [address, setaddress] = useState(null)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordC, setPasswordC] = useState('');
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

    

    const registerSubmit = async (e) => {
        e.preventDefault();

        console.log(username, password);
        const formVal = formValidation(username, password, passwordC);
        if (formVal === true){
            try {
                await contract.methods.register(accounts[0],username, password).send({ from: accounts[0] });
                // const registerCAll = await contract.methods.register(accounts[0],username, password).call();

                // console.log(registerCAll, 'register CALL here')
                navigate('/auth');
            } catch (err){
                console.log(err)
                alert('User already registered with this account!')
                
            }
            
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
            onChange={(e) => setPassword(e.target.value)}
            />
            <label>Confirm Password</label>
            <input 
            type="password" 
            required 
            value={passwordC}
            onChange={(e) => setPasswordC(e.target.value)}
            />
            <button>Register</button>
            </form>
            {/* <Link to="/auth">Register Button </Link> */}
        </div>
    )
}

export default RegisterPage
