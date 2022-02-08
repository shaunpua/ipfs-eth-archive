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
    
    const editPercent = (changes,total) => {
      if  (changes > 0 && total == 0)
        return 100;
      if(changes==0||total==0)
        return 0;
      else
        return changes/total*100;
     
    }

    useEffect(()=>{
        const load = async () => {
          
          try {
                const checkLogin = await contract.methods.checkIsUserLogged(accounts[0]).call();
                console.log(checkLogin, 'LOGIN STATE 1 /home')

                await contract.methods.transactionCount().call(function(err,res){
                  setTransactionCount(res);
                });
                
                const transactionArray = await contract.methods.getAllTransactions().call();

                
                transactionArray.reverse();
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
                  <p style={{width: "20px", marginLeft: "10px"}}>ID</p>
                  <p style={{width: "80px", marginLeft: "30px"}}>File Name</p>
                  <p style={{width: "80px", marginLeft: "85px"}}>File Hash</p>
                  <p style={{width: "70px", marginLeft: "50px"}}>File Size</p>
                  <p style={{width: "80px", marginLeft: "20px"}}>Uploader</p>
                  <p style={{width: "80px", marginLeft: "30px"}}>Address</p>
                  <p style={{width: "60px", marginLeft: "30px"}}> Type</p>
                  <p style={{width: "120px", marginLeft: "30px"}}>Upload Date</p>
                  <p style={{width: "90px", marginLeft: "70px"}}>Change Level</p>
                  
              </div>
              
              <div className="home-files-container">
              {transactions.map((transaction, key) => {
                  return (<div className="file-section">
                  <div className="file-section-item" style={{width: "40px", marginLeft: "10px" }}>{transaction.fileId}</div>
                  <div className="file-section-item" style={{width: "150px", marginLeft: "10px" }}>{transaction.fileName}</div>
                  <div className="file-section-item" style={{width: "120px", marginLeft: "10px" }} ><a
                            href={"https://ipfs.infura.io/ipfs/" + transaction.fileHash}
                            rel="noopener noreferrer"
                            target="_blank">
                            {transaction.fileHash.substring(0,10)}...
                          </a></div>
                  <div className="file-section-item" style={{width: "80px", marginLeft: "10px" }}>{convertBytes(transaction.fileSize)}</div>
                  <div className="file-section-item" style={{width: "100px", marginLeft: "10px" }}>{transaction.userName}</div>
                  <div className="file-section-item" style={{width: "100px", marginLeft: "10px" }}><a
                            href={"https://etherscan.io/address/" + transaction.userAddress}
                            rel="noopener noreferrer"
                            target="_blank">
                            {transaction.userAddress.substring(0,10)}...
                          </a></div>
                <div className="file-section-item" style={{width: "80px", marginLeft: "10px" }}>{transaction.transactionType}</div>
                <div className="file-section-item" style={{width: "170px", marginLeft: "10px" }}>{moment.unix(transaction.uploadTime).format('h:mm:ss A M/D/Y')}</div>
                <div className="file-section-item" style={{width: "40px", marginLeft: "10px" }}>{transaction.changeLevel}</div>
                {editPercent(transaction.changeLevel,transaction.lastSize)==0 ? <div  className="file-section-lv">{transaction.changeLevel}/{transaction.lastSize}</div>: null }
        
                {editPercent(transaction.changeLevel,transaction.lastSize) > 0 && editPercent(transaction.changeLevel,transaction.lastSize) < 10 ? <div  className="file-section-lv" style={{backgroundColor: "green"}}>{transaction.changeLevel}/{transaction.lastSize}</div>: null }
                {editPercent(transaction.changeLevel,transaction.lastSize) >= 10 && editPercent(transaction.changeLevel,transaction.lastSize) < 50 ? <div  className="file-section-lv" style={{backgroundColor: "#ffd105"}}>{transaction.changeLevel}/{transaction.lastSize}</div>: null } 
                {editPercent(transaction.changeLevel,transaction.lastSize) >= 50 ? <div  className="file-section-lv" style={{backgroundColor: "red"}}>{transaction.changeLevel}/{transaction.lastSize}</div>: null } 
                </div>)
                })}
                
                
              </div>
           
            </div>
          </div>
        </div>
    )
}

export default TransactionPage
