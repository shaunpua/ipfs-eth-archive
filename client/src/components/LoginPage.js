import React, {useContext, useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";

function LoginPage() {
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    console.log('context provider data ',web3, contract, accounts[0]);


     useEffect(()=>{
        
        const checkIfLoggedIn = async () => {
          // Stores a given value, 5 by default.
          console.log('check if logge din function')
          try {
                const checkLogin = await contract.methods.checkIsUserLogged(accounts[0]).call();
                console.log(checkLogin, 'LOGIN STATE 1 /login')
                 if (checkLogin == true){
                   navigate('/');
                 } 
            } catch (err){
                console.log(err)
                
            }

        
        }
        
        checkIfLoggedIn()
        
        
      }, [])

    const loginSubmit = async (e) => {
        e.preventDefault();

         try {
                // const loginCAll = await contract.methods.login(accounts[0], password).call();
                const loginCAll = await contract.methods.login(accounts[0], password).send({ from: accounts[0] });
                
                console.log(loginCAll, 'login CALL here')
                
                navigate('/');
                
                
            } catch (err){
                console.log(err)
                alert('Error login account to blockchain!')
                
            }

        
        
    }
    return (
        <div>
        
            <h2>Login</h2>
            <form onSubmit={loginSubmit}>
            <label>Your address {accounts[0]}</label>
            
            <label>Password</label>
            <input 
            type="password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />
            
            <button>Login </button>
            </form>
        
             {/* <Link to="/">Login Button </Link> */}
        </div>
    )
}

export default LoginPage
