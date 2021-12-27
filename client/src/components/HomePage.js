import React,  {useState, useEffect, useContext} from "react";
import {useNavigate } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";

function HomePage() {
    const [storageValue, setStorageValue] = useState(0);
    const [contractname, setContractname] = useState('');
    const [loggedIn, setLoggedIn] = useState(false)
    const navigate = useNavigate();

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    console.log('context provider data ',web3, contract, accounts[0]);

    useEffect(()=>{
        const load = async () => {
          // Stores a given value, 5 by default.
          try {
                const checkLogin = await contract.methods.checkIsUserLogged(accounts[0]).call();
                console.log(checkLogin, 'LOGIN STATE 1 /home')
                
                console.log(loggedIn, 'login state 2')
                 if (checkLogin === true){
                   setLoggedIn(true)
                 } else {
                   navigate('/auth');
                 }
            } catch (err){
                console.log(err)
                
            }

         
          
          // await contract.methods.set(69).send({ from: accounts[0] });
          

          contract.methods.name().call(function(err,res){
            setContractname(res);
          });
          
          // Get the value from the contract to prove it worked.
          const response = await contract.methods.get().call();
          // console.log(contract.methods.name())
          // console.log(contract)
          // console.log(response)
          
          
    
          // Update state with the result.
          setStorageValue(response);
          
    
        }
        if (typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof contract !== 'undefined') {
          load()
        }
      }, [web3, accounts, contract])


    const logoutSubmit = async () => {
        try {
          // const loginCAll = await contract.methods.login(accounts[0], password).call();
          await contract.methods.logout(accounts[0]).send({ from: accounts[0] });
                
            
                
            navigate('/auth');
                
                
        } catch (err){
            console.log(err)
            alert('Error logout account to blockchain!')
                
          }
    }


    return (
        <div>
            <h1>Good to Go!</h1>
          <p>Your Truffle Box is installed and ready.</p>
          <h2>Smart Contract Example</h2>
          <p>
            If your contracts compiled and migrated successfully, below will show
            a stored value of 5 (by default).
          </p>
          <p>
            Try changing the value stored on <strong>line 42</strong> of App.js.
          </p>
          
          <div>The stored value is: {storageValue}</div>
          <div>Contract name is  {contractname}</div>
         <button onClick={logoutSubmit}>Logout</button>
        </div>
    )
}

export default HomePage
