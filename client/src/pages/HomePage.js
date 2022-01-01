import React,  {useState, useEffect, useContext} from "react";
import {useNavigate } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";
import NavBar2 from "./components/Navbar2"
import Sidebar from "./components/Sidebar";
import AddFileModal from "./components/AddFileModal";

function HomePage() {
    const [storageValue, setStorageValue] = useState(0);
    const [filecount, setFilecount] = useState(null);
    const [contractname, setContractname] = useState('');
    const [openmodal, setOpenmodal] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false)
    const navigate = useNavigate();

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    // console.log('context provider data ',web3, contract, accounts[0]);

    useEffect(()=>{
        const load = async () => {
          // Stores a given value, 5 by default.
          try {
                const checkLogin = await contract.methods.checkIsUserLogged(accounts[0]).call();
                console.log(checkLogin, 'LOGIN STATE 1 /home')
                
                console.log(loggedIn, 'login state 2')
                 if (checkLogin === true){
                   setLoggedIn(true);
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

          contract.methods.fileCount().call(function(err,res){
            setFilecount(res);
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


    


    return (
        <div className="HomePage">
          <NavBar2/>
          {openmodal && <AddFileModal closeModal={setOpenmodal}/>}
          <div className="home-container">
            <Sidebar/>
            <div className="home-content">
            
              <h2>ArchStorage / All Files</h2>
              <h3>File count is: {filecount}</h3>
              <button className="upload-button" onClick={()=> {setOpenmodal(true)}}>Create +</button>
              <div className="home-file-descriptions">
                  <p>ID</p>
                  <p>Name</p>
                  <p>Description</p>
                  <p>Type</p>
                  <p>Size</p>
                  <p>Date</p>
                  <p>Uploader</p>
                  <p>Hash</p>
              </div>
              
              <div className="home-files-container">
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                <div className="file-section">
                  <p>2</p>
                  <p>Document-test-upload.txt</p>
                  <p>This is a file for testing </p>
                  <p>doc/doc.x</p>
                  <p>254 bytes</p>
                  <p>9:14:01 PM 12/21/2021</p>
                  <p>0x331E51CE3c5C8ec98F62320F60Ec70527AbD05e3</p>
                  <p>bafybeib4hiir6zli7ac67edjraiw352chq5hpmmxobswrmer2etmzmx37a</p>
                </div>
                
                
              </div>
            {/* <h1>Good to Go!</h1>
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
          <div>Contract name is  {contractname}</div> */}
            </div>
          </div>
           
         
        </div>
    )
}

export default HomePage
