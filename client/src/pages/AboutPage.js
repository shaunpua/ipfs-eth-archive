import React from 'react'
import { Link, useNavigate } from "react-router-dom";
import NavBar2 from "./components/Navbar2"
import Sidebar from "./components/Sidebar";

function AboutPage() {
  return (
    <div className="AboutPage">
        <NavBar2/>
        <div className="home-container">
            <Sidebar/>
            <div className="home-content" >
            <h1>ArchStorage Guide</h1>
            
            <p  style={{ marginTop: "8px"}}>Welcome, to ArchStorage a blockchain based storage system. </p>
            <p  style={{ marginTop: "6px"}}> This system has three main file functions Upload, Update and Delete, with supported file types such as text, docx and PDF Files.</p>
            <p  style={{ marginTop: "6px"}}> Everytime a file function is performed, a transaction is made. You can view the list of transactions in the transaction page.</p>

            <h2 style={{ fontSize: "1.6rem",  marginTop: "8px"}}>Uploading Files</h2>
            <p  style={{ marginTop: "6px"}}>- To upload a file, click the "Create+" button on the main page, which will prompt a form </p>
            <p  style={{ marginTop: "6px"}}>- Uploaded files are public and open to edit by default. You can make files private by clicking the checkbox.</p>
            <p  style={{ marginTop: "6px"}}>- You can also implement file permissioning by entering the usernames of your permissioned users for that file. </p>

            <h2 style={{ fontSize: "1.6rem",  marginTop: "8px"}}>Updating Files</h2>
            <p  style={{ marginTop: "6px"}}>- To upload a file, click the update icon on a specified file or the update button on the page for that file, which will prompt a form </p>
            <p  style={{ marginTop: "6px"}}>- You can then upload the new file, which must be of the same type of the original file. Owners can also update the file permission.</p>
            <p  style={{ marginTop: "6px"}}>- If the update symbol or button is greyed out, that means that you do noy have permission by the file's owner to edit that file.</p>
            <p  style={{ marginTop: "6px"}}>- Every time a file is updated, a change level value is produced to determine the amount of change was done to that file.</p>

            <h2 style={{ fontSize: "1.6rem",  marginTop: "8px"}}>File Change Level Legends</h2>
            <div style={{ display: "flex",  marginTop: "8px"}}>
            <div  className="file-section-lvdot" ></div>
            <div style={{ marginLeft: "8px",  marginRight: "8px",  marginTop: "4px"}}>No Change</div>
            <div  className="file-section-lvdot" style={{backgroundColor: "green"}}></div>
            <div style={{ marginLeft: "8px",  marginRight: "8px",  marginTop: "4px"}}>Minor, less than 10%</div>
            <div  className="file-section-lvdot" style={{backgroundColor: "#ffd105"}}></div>
            <div style={{ marginLeft: "8px",  marginRight: "8px",  marginTop: "4px"}}>Moderate, 10 to less than 50%</div>
            <div  className="file-section-lvdot" style={{backgroundColor: "red"}}></div>
            <div style={{ marginLeft: "8px",  marginRight: "8px",  marginTop: "4px"}}>Major, 50% and above</div>
            </div>
            

            
            </div>

        </div>
        
    </div>
  )
}

export default AboutPage