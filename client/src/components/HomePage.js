import React,  {useState, useEffect, useContext} from "react";
import BlockchainContext from "../BlockchainContext";

function HomePage() {
    const [storageValue, setStorageValue] = useState(undefined);


    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    console.log('context provider data ',web3, contract, accounts[0]);

    useEffect(()=>{
        const load = async () => {
          // Stores a given value, 5 by default.
          await contract.methods.set(69).send({ from: accounts[0] });
          // Get the value from the contract to prove it worked.
          const response = await contract.methods.get().call();
          console.log(contract.methods.name())
          console.log(contract)
          console.log(response)
          
    
          // Update state with the result.
          setStorageValue(response);
          
    
        }
        if (typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof contract !== 'undefined') {
          load()
        }
      }, [web3, accounts, contract])


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
        </div>
    )
}

export default HomePage
