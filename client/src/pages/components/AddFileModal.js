import React, {useContext, useState} from "react";
import BlockchainContext from "../../BlockchainContext";

function AddFileModal( {closeModal}) {
    
    const [description, setDescription] = useState('');
    const [uploadfile, setUploadfile] = useState([])

    const BlockchainContextImport =  useContext(BlockchainContext)
    const {web3, contract, accounts} = BlockchainContextImport;
    console.log('context provider data ',web3, contract, accounts[0]);
    return (
        <div className="modal-background">
            <div className="modal-container">
                <button className="modal-close-button" onClick={()=> {closeModal(false)}}> X </button>
                <div className="modal-title">
                    <h1>Upload File</h1>

                </div>
                <form  className="modal-form">
                    <div className="form-input">
                    <label>File Description</label>
                    <input 
                    type="text" 
                    required 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="auth-input"
                    placeholder="Enter Description"
                    />  
                    </div>
                    <div className="form-input">
                    <input
                    type="file"
                    value={uploadfile}
                    // onChange={(e) => setUploadfile(e.target.files[0])}
                    />
                    </div>
                    
                    <button className="register-button">Upload File</button>
                </form>
            </div>
            
        </div>
    )
}

export default AddFileModal
