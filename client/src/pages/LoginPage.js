import React, {useContext, useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";
import NavBar1 from "./components/Navbar1"

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
        <div className="LoginPage">
            <NavBar1/>
            <div className="login-container">
            <h2>Login</h2>
            <hr className="form-break" />
            <form onSubmit={loginSubmit}>
            <label style={{fontWeight: '450'}}>Your current address is {accounts[0]}</label>
            <br/>
                <div className="form-input" style={{marginTop: '20px'}}>
                    <label>Password</label>
                    <input 
                    type="password" 
                    required 
                    value={password}
                    className="auth-input"
                    placeholder="Enter Password"
                    onChange={(e) => setPassword(e.target.value)}
                    />
                        
                </div>
           
            
                <button className="register-button">Login </button>
                <div class="form-redirect">
                        <span>Dont have an account yet?</span>
                        
                        <Link to="/register">Register</Link>
                    </div>
            </form>

            </div>
           
        
             {/* <Link to="/">Login Button </Link> */}
        </div>
    )
}

export default LoginPage
