import React,  {useState, useEffect, useContext} from "react";
import {useNavigate } from "react-router-dom";
import BlockchainContext from "../BlockchainContext";
import NavBar2 from "./components/Navbar2"
import Sidebar from "./components/Sidebar";
import { convertBytes } from '../extraFunctions';
import moment from 'moment'

function TransactionPage() {
    const [transactions, setTransactions] = useState([]);
    const [transactionCount, setTransactionCount] = useState(null);
    const [loggedIn, setLoggedIn] = useState(false);
    const navigate = useNavigate();

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;

    useEffect(()=>{
        const load = async () => {
          // Stores a given value, 5 by default.
          try {
                const checkLogin = await contract.methods.checkIsUserLogged(accounts[0]).call();
                console.log(checkLogin, 'LOGIN STATE 1 /home')

                await contract.methods.transactionCount().call(function(err,res){
                  setTransactionCount(res);
                });
                
                const transactionArray = await contract.methods.getAllTransactions().call();

                // console.log(transactionArray);

                setTransactions(transactionArray);
                
      
                
                
                console.log(loggedIn, 'login state 2')
                 if (checkLogin === true){
                   setLoggedIn(true);
                 } else {
                   navigate('/auth');
                 }
            } catch (err){
                console.log(err)
                
            }
          
    
        }
        if (typeof web3 !== 'undefined' && typeof accounts !== 'undefined' && typeof contract !== 'undefined') {
          load()
        }
      }, [web3, accounts, contract, transactionCount])


    return (
        <div className="TransactionPage">
            <NavBar2/>
            <div className="home-container">
            <Sidebar/>
            <div className="home-content">
            
              <h2>ArchStorage / Transactions</h2>
              <h3>Transaction count is: {transactionCount}</h3>
            
              <div className="home-file-descriptions">
                  <p style={{width: "90px", marginLeft: "10px"}}>File Name</p>
                  <p style={{width: "90px", marginLeft: "100px"}}>File Hash</p>
                  <p style={{width: "70px", marginLeft: "40px"}}>File Size</p>
                  <p style={{width: "80px", marginLeft: "20px"}}>Uploader</p>
                  <p style={{width: "80px", marginLeft: "30px"}}>Address</p>
                  <p style={{width: "110px", marginLeft: "10px"}}>Transaction Type</p>
                  <p style={{width: "90px", marginLeft: "10px"}}>Change Level</p>
                  <p style={{width: "90px", marginLeft: "10px"}}>Upload Date</p>
                  
              </div>
              
              <div className="home-files-container">
              {transactions.map((transaction, key) => {
                  return (<div className="file-section">
                  
                  <div className="file-section-item" style={{width: "180px", marginLeft: "10px" }}>{transaction.fileName}</div>
                  <div className="file-section-item" style={{width: "120px", marginLeft: "10px" }} ><a
                            href={"https://ipfs.infura.io/ipfs/" + transaction.fileHash}
                            rel="noopener noreferrer"
                            target="_blank">
                            {transaction.fileHash.substring(0,10)}...
                          </a></div>
                  <div className="file-section-item" style={{width: "80px", marginLeft: "10px" }}>{convertBytes(transaction.fileSize)}</div>
                  <div className="file-section-item" style={{width: "100px", marginLeft: "10px" }}>{transaction.userName}</div>
                  <div className="file-section-item" style={{width: "120px", marginLeft: "10px" }}><a
                            href={"https://etherscan.io/address/" + transaction.userAddress}
                            rel="noopener noreferrer"
                            target="_blank">
                            {transaction.userAddress.substring(0,10)}...
                          </a></div>
                <div className="file-section-item" style={{width: "100px", marginLeft: "10px" }}>{transaction.transactionType}</div>
                <div className="file-section-item" style={{width: "60px", marginLeft: "10px" }}>{transaction.changeLevel}</div>
                <div className="file-section-item" style={{width: "140px", marginLeft: "10px" }}>{moment.unix(transaction.uploadTime).format('h:mm:ss A M/D/Y')}</div>
                <div  className="file-section-lvdot"></div>
                  
                </div>)
                })}
                
                
              </div>
           
            </div>
          </div>
        </div>
    )
}

export default TransactionPage
