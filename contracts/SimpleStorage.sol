// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract SimpleStorage {
    // data
    string public name = "ArchStorage";
    uint256 storedData;

    uint256 public fileCount = 0;
    uint256 public transactionCount = 0;
    mapping(uint256 => File) public files;
    mapping(address => UserDetail) user;

    struct File {
        uint256 fileId;
        string fileHash;
        uint256 fileSize;
        string fileType;
        string fileName;
        string fileDescription;
        uint256 uploadTime;
        address uploader;
    }

    struct UserDetail {
        address addr;
        string name;
        string password;
        bool isUserLoggedIn;
    }

    struct Transaction {
        address userAddress;
        string userName;
        string fileName;
        string fileHash;
        string transactionType;
        uint256 changeLevel;
    }
    Transaction[] transactions;

    //events

    event transactionAdded(Transaction temp);

    event FileUploaded(
        uint256 fileId,
        string fileHash,
        uint256 fileSize,
        string fileType,
        string fileName,
        string fileDescription,
        uint256 uploadTime,
        address uploader
    );

    constructor() public {}

    function uploadFile(
        string memory _fileHash,
        uint256 _fileSize,
        string memory _fileType,
        string memory _fileName,
        string memory _fileDescription
    ) public {
        // Make sure the file hash exists
        require(bytes(_fileHash).length > 0);
        // Make sure file type exists
        require(bytes(_fileType).length > 0);
        // Make sure file description exists
        require(bytes(_fileDescription).length > 0);
        // Make sure file fileName exists
        require(bytes(_fileName).length > 0);
        // Make sure uploader address exists
        require(msg.sender != address(0));
        // Make sure file size is more than 0
        require(_fileSize > 0);

        // Increment file id
        fileCount++;

        // Add File to the contract
        files[fileCount] = File(
            fileCount,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            block.timestamp,
            msg.sender
        );
        // Trigger an event
        emit FileUploaded(
            fileCount,
            _fileHash,
            _fileSize,
            _fileType,
            _fileName,
            _fileDescription,
            block.timestamp,
            msg.sender
        );
    }

    // user registration function
    function register(
        address _address,
        string memory _name,
        string memory _password
    ) public returns (bool) {
        require(user[_address].addr != msg.sender);
        user[_address].addr = _address;
        user[_address].name = _name;
        user[_address].password = _password;
        user[_address].isUserLoggedIn = false;
        return true;
    }

    // user login function
    function login(address _address, string memory _password)
        public
        returns (bool)
    {
        if (
            keccak256(abi.encodePacked(user[_address].password)) ==
            keccak256(abi.encodePacked(_password))
        ) {
            user[_address].isUserLoggedIn = true;
            return user[_address].isUserLoggedIn;
        } else {
            return false;
        }
    }

    // check the user logged In or not
    function checkIsUserLogged(address _address) public view returns (bool) {
        return (user[_address].isUserLoggedIn);
    }

    // logout the user
    function logout(address _address) public {
        user[_address].isUserLoggedIn = false;
    }

    function addTransaction(
        address _userAddress,
        string memory _userName,
        string memory _fileName,
        string memory _fileHash,
        string memory _transactionType,
        uint256 _changeLevel
    ) public {
        Transaction memory temp;
        temp.userAddress = _userAddress;
        temp.userName = _userName;
        temp.fileName = _fileName;
        temp.fileHash = _fileHash;
        temp.transactionType = _transactionType;
        temp.changeLevel = _changeLevel;
        transactions.push(temp);
        transactionCount++;
        emit transactionAdded(temp);
        /*
        emit transactionAdded(
            _userAddress,
            _userName,
            _fileName,
            _fileHash,
            _transactionType,
            _changeLevel
        );
        */
    }

    function set(uint256 x) public {
        storedData = x;
    }

    function get() public view returns (uint256) {
        return storedData;
    }
}
