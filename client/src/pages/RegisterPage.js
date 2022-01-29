import React, {useContext, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";
import NavBar1 from "./components/Navbar1"

function RegisterPage() {
    // const [address, setaddress] = useState(null)
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [passwordC, setPasswordC] = useState('');
    const navigate = useNavigate();

    //button disabler states
    const [registerDisable, setRegisterDisable] = useState(false);

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;

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
        setRegisterDisable(true);
        const formVal = formValidation(username, password, passwordC);
        
        if (formVal === true){

            try {
                await contract.methods.register(accounts[0],username, password).send({ from: accounts[0] });
                // const registerCAll = await contract.methods.register(accounts[0],username, password).call();
                // console.log(registerCAll, 'register CALL here')
                setRegisterDisable(false);
                navigate('/auth');

            } catch (err){
                console.log(err)
                setRegisterDisable(false);
                setUsername('');
                setPassword('');
                setPasswordC('');
                alert('User already registered with this account!')
                
            }
            
        } else {
            setRegisterDisable(false);
            setUsername('');
            setPassword('');
            setPasswordC('');
            alert('Wrong register input details!')
        }    
    }

    return (
        <div className="RegisterPage">
            <NavBar1/>
            <div className="register-container">
            <h2>Register</h2>
             <hr className="form-break" />
                <form onSubmit={registerSubmit}  >
                    <div className="form-input">
                        <label>Username</label>
                        <input 
                        type="text" 
                        required 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="auth-input"
                        placeholder="Enter Username"
                        />
                    </div>
                    <div className="form-input">
                        <label>Password</label>
                        <input 
                        type="password" 
                        required 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="auth-input"
                        placeholder="Enter Password"
                        />
                    </div>
                    <div className="form-input">
                        <label>Confirm Password</label>
                        <input 
                        type="password" 
                        required 
                        value={passwordC}
                        onChange={(e) => setPasswordC(e.target.value)}
                        className="auth-input"
                        placeholder="Confirm Password"
                        /> 
                    </div>
                    <button disabled={registerDisable} className="register-button">Register</button>
                    <div class="form-redirect">
                        <span>Already have an account? </span>
                            
                        <Link to="/login">Sign in</Link>
                    </div>
                </form>
            {/* <Link to="/auth">Register Button </Link> */}
            </div>
        </div>
    )
}

export default RegisterPage
