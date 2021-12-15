const SimpleStorage = artifacts.require("./SimpleStorage.sol");
const truffleAssert = require('truffle-assertions');



contract('SimpleStorage', ([deployer, uploader]) => {

  let simplestorage

  before(async () => {
    simplestorage = await SimpleStorage.deployed()
  })
  describe('deployment', async () => {
    it('deploys successfully', async () => {
      const address = await simplestorage.address
      assert.notEqual(address, 0x0)
      assert.notEqual(address, '')
      assert.notEqual(address, null)
      assert.notEqual(address, undefined)
    })

    it('has a name', async () => {
      const name = await simplestorage.name()
      assert.equal(name, 'ArchStorage')
    })

    // it("...should store the value 89.", async () => {
      
  
    //   // Set value of 89
    //   await simplestorage.set(89);
  
    //   // Get stored value
    //   const storedData = await simplestorage.get.call();
  
    //   assert.equal(storedData, 89, "The value 89 was not stored.");
    // });
  })

  describe('file', async () => {
    let result, fileCount
    const fileHash = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'
    const fileSize = '1'
    const fileType = 'TypeOfTheFile'
    const fileName = 'NameOfTheFile'
    const fileDescription = 'DescriptionOfTheFile'

    before(async () => {
      result = await simplestorage.uploadFile(fileHash, fileSize, fileType, fileName, fileDescription, { from: uploader })
      fileCount = await simplestorage.fileCount()
    })

    //check event
    it('upload file', async () => {
      // SUCESS
      assert.equal(fileCount, 1)
      const event = result.logs[0].args
      assert.equal(event.fileId.toNumber(), fileCount.toNumber(), 'Id is correct')
      assert.equal(event.fileHash, fileHash, 'Hash is correct')
      assert.equal(event.fileSize, fileSize, 'Size is correct')
      assert.equal(event.fileType, fileType, 'Type is correct')
      assert.equal(event.fileName, fileName, 'Name is correct')
      assert.equal(event.fileDescription, fileDescription, 'Description is correct')
      assert.equal(event.uploader, uploader, 'Uploader is correct')

      // // FAILURE: File must have hash
      // await simplestorage.uploadFile('', fileSize, fileType, fileName, fileDescription, { from: uploader }).should.be.rejected;

      // // FAILURE: File must have size
      // await simplestorage.uploadFile(fileHash, '', fileType, fileName, fileDescription, { from: uploader }).should.be.rejected;
      
      // // FAILURE: File must have type
      // await simplestorage.uploadFile(fileHash, fileSize, '', fileName, fileDescription, { from: uploader }).should.be.rejected;

      // // FAILURE: File must have name
      // await simplestorage.uploadFile(fileHash, fileSize, fileType, '', fileDescription, { from: uploader }).should.be.rejected;

      // // FAILURE: File must have description
      // await simplestorage.uploadFile(fileHash, fileSize, fileType, fileName, '', { from: uploader }).should.be.rejected;
    })

    //check from Struct
    it('lists file', async () => {
      const file = await simplestorage.files(fileCount)
      assert.equal(file.fileId.toNumber(), fileCount.toNumber(), 'id is correct')
      assert.equal(file.fileHash, fileHash, 'Hash is correct')
      assert.equal(file.fileSize, fileSize, 'Size is correct')
      assert.equal(file.fileName, fileName, 'Size is correct')
      assert.equal(file.fileDescription, fileDescription, 'description is correct')
      assert.equal(file.uploader, uploader, 'uploader is correct')
    })
  })

  describe('transaction', async () => {
    const userAddressT = '0x917Cb2aD1C186c689f67170bea745852eD879990'
    const userNameT = 'user1'
    const fileHashT = 'QmV8cfu6n4NT5xRr2AHdKxFMTZEJrA44qgrBCr739BN9Wb'
    const fileNameT = 'file1'
    const transactionType = 'ADD'
    const changeLevel = 0

    // before(async () => {
    //   await simplestorage.addTransaction(userAddressT, userNameT, fileNameT, fileHashT, transactionType, changeLevel)
    //   transactions = simplestorage.transactions;
    //   console.log(transactions)
    // })

    it('should add transaction', async () => {
      const result = simplestorage.addTransaction(userAddressT, userNameT, fileNameT, fileHashT, transactionType, changeLevel)
      truffleAssert.eventEmitted(result, 'transactionAdded', (event) => {
        console.log(result)
        return event.userAddress == userAddressT
      });
    });

    // it('adds transaction', async () => {

    //   await simplestorage.addTransaction(userAddressT, userNameT, fileNameT, fileHashT, transactionType, changeLevel)
    //   transaction2 = simplestorage.transactions;
    //   console.log('test val')
    //   console.log(transactions)
    //   assert.equal(temp.userAddress, userAddressT, 'User address is correct')

      
      
    // })
    
  })

  
  
});
