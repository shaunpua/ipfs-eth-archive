import React,  {useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route} from 'react-router-dom';
import SimpleStorageContract from "./contracts/SimpleStorage.json";
import getWeb3 from "./getWeb3";
import BlockchainContext from "./BlockchainContext";
import AuthPage from "./components/AuthPage";
import "./App.css";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import HomePage from "./components/HomePage";


function App() {
  // const [storageValue, setStorageValue] = useState(undefined);
  const [web3, setWeb3] = useState(undefined);
  const [accounts, setAccounts] = useState([]);
  const [contract, setContract] = useState(undefined);

  useEffect(()=>{
    const init = async() =>{

      try {
        // Get network provider and web3 instance.
        const web3 = await getWeb3();
  
        // Use web3 to get the user's accounts.
        const accounts = await web3.eth.getAccounts();
  
        // Get the contract instance.
        const networkId = await web3.eth.net.getId();
        const deployedNetwork = SimpleStorageContract.networks[networkId];
        const contract = new web3.eth.Contract(
          SimpleStorageContract.abi,
          deployedNetwork && deployedNetwork.address,
        );
  
        // Set web3, accounts, and contract to the state, and then proceed with an
        // example of interacting with the contract's methods.
        
        setWeb3(web3);
        setAccounts(accounts);
        setContract(contract)

      } catch (error) {
        // Catch any errors for any of the above operations.
        alert(
          `Failed to load web3, accounts, or contract. Check console for details.`,
        );
        console.error(error);
      }

    }
    init()
  }, []);

  // useEffect(()=>{
  //   const load = async () => {
  //     // Stores a given value, 5 by default.
  //     await contract.methods.set(69).send({ from: accounts[0] });
  //     // Get the value from the contract to prove it worked.
  //     const response = await contract.methods.get().call();
  //     console.log(contract.methods.name())
  //     console.log(contract)
  //     console.log(response)
  //     console.log('potato')

  //     // Update state with the result.
  //     setStorageValue(response);
      

  //   }
  //   if (typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof contract !== 'undefined') {
  //     load()
  //   }
  // }, [web3, accounts, contract])

  if (typeof web3 === 'undefined') {
    return <div>Loading Web3, accounts, and contract...</div>;
  }

  return (
      <div className="App">
        <BlockchainContext.Provider value={{web3, accounts, contract}}>
          
          
          <Router>
          <Routes>
            <Route exact path="/" element={<HomePage/>}/>
            
            <Route path="/auth" element={<AuthPage/>}/>
            <Route path="/login" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route exact path="*" element={<p>Error no page found</p>}/>
              
          </Routes>
          </Router>
        </BlockchainContext.Provider>
    </div>
  );
    

}



export default App;
