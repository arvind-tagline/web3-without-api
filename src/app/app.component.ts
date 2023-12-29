import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import Web3 from 'web3';
declare const window: any;

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'web-3';
  walletInstance: any;
  web3: any;
  enable!: Promise<any>;
  address: any;
  balance_: string = "";
  tokenConverted: any;
  accountBalance!: string;

  constructor() { }

  async getSelectedAddress() {
    if (typeof window !== "undefined") {
      await this.loadBalance();
      // this.loadTokenBalance();
      // await this.web3.eth.getCoinbase().then((result:any) =>{
      //   console.log('result :>> ', result);
      // });
    }
  }
  private async enableMetaMaskAccount(): Promise<any> {
    let enable = false;
    await new Promise((resolve, reject) => {
      enable = window.tronWeb.enable();
    });
    return Promise.resolve(enable);
  }
  tronWeb:any;
  async ngOnInit() {
    if (window.tronWeb) {
      // this.tronWeb = window.tronWeb;
      // console.log('tronWeb :>> ', this.tronWeb);
      // TronLink is installed and connected
      // You can use tronWeb to interact with the Tron blockchain
      try {
            // Request account access if needed
            await window.tronWeb.request({ method: 'tron_requestAccounts' });
            this.web3 = new Web3(window.tronWeb);
            window.tronWeb.ready; //request for connect tron wallet
          } catch (error) {
            console.error('Error initializing Web3:', error);
          }
    } else {
      console.error('TronLink not found. Please install and connect TronLink.');
    }
    // if (typeof window.ethereum !== 'undefined') {
    //   try {
    //     // Request account access if needed
    //     await window.ethereum.request({ method: 'eth_accounts' });
    //     console.log('window :>> ', window);
    //     this.web3 = new Web3(window.ethereum);
    //     //get the account address on chnage account
    //     window.ethereum.on('accountsChanged', (accounts: string[]) => {
    //       this.address = accounts[0];
    //     });
    //     this.enable = this.enableMetaMaskAccount();//check the meta mash account is install or not in user browser
    //     // get user metamash accounts
    //     const accounts = await this.web3.eth.getAccounts();
    //     console.log('accounts :>> ', accounts);
    //     this.address = accounts[0];
    //   } catch (error) {
    //     console.error('Error initializing Web3:', error);
    //   }
    // } else {
    //   alert('Non-Ethereum browser detected. Install MetaMask');
    // }
  }

  async loadBalance() {
    // const initialvalue = await this.web3.eth.getBalance(this.address);
    // this.accountBalance = this.web3.utils.fromWei(initialvalue, 'ether');
    if (window.tronWeb && window.tronWeb.ready) {
      const tronWeb = window.tronWeb;
    
      if (tronWeb.ready) {
        // TronLink is ready
        const address = tronWeb.defaultAddress.base58;
        tronWeb.trx.getBalance(address, (err:any, balance:any) => {
          if (err) {
            console.error('Error getting balance:', err);
          } else {
            // Convert the balance from SUN to TRX
            const trxBalance = tronWeb.fromSun(balance);
            this.accountBalance = trxBalance;
            console.log(`TRX Balance for ${address}: ${trxBalance} TRX`);
            // Handle the balance as needed
          }
        });
      } else {
        console.error('TronLink not ready. Please wait for TronLink to be fully initialized.');
      }
    } else {
      console.error('TronLink not found. Please install and connect TronLink.');
    }
    
  }

  minABI:any;
  contract:any;
  async loadTokenBalance() {
    let tokenAddress = "0x50327c6c5a14DCaDE707ABad2E27eB517df87AB5";
    let walletAddress = this.address;

    // The minimum ABI to get ERC20 Token balance
    this.minABI = [
      {
        "constant": true,
        "inputs": [],
        "name": "name",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "symbol",
        "outputs": [
          {
            "name": "",
            "type": "string"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [],
        "name": "decimals",
        "outputs": [
          {
            "name": "",
            "type": "uint8"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "balance",
            "type": "uint256"
          }
        ],
        "payable": false,
        "stateMutability": "view",
        "type": "function"
      },
      {
        "constant": false,
        "inputs": [
          {
            "name": "_to",
            "type": "address"
          },
          {
            "name": "_value",
            "type": "uint256"
          }
        ],
        "name": "transfer",
        "outputs": [
          {
            "name": "",
            "type": "bool"
          }
        ],
        "payable": false,
        "stateMutability": "nonpayable",
        "type": "function"
      },
      // Add other functions as needed
    ];
    

    // Get ERC20 Token contract instance
    this.contract = new this.web3.eth.Contract(this.minABI, tokenAddress);

    // Call balanceOf function
    await this.contract.methods.balanceOf(walletAddress).call().then((result: any) => {
      this.tokenConverted = this.web3.utils.fromWei(result, 'ether');
      console.log(result);
    });

  }

  async transferAmount() {
    // this.web3.eth.sendTransaction({
    //   from: this.address,
    //   to: '0x58DF150eDadf397d8E0b9ab103F07D1cBbDa164F',
    //   value: '0x0' + this.web3.utils.toWei('0', 'ether'),
    //   gas: 21000,
    //   maxFeePerGas: this.web3.utils.toWei('0', 'gwei'), // Set maxFeePerGas in Wei (adjust as needed)
    //   maxPriorityFeePerGas: this.web3.utils.toWei('0', 'gwei'), // Set maxPriorityFeePerGas in Wei (adjust as needed)
    // }).on('transactionHash', (hash: any) => {
    //       console.log('Transaction Hash:', hash);
    //     })
    //     .on('confirmation', (confirmationNumber: any, receipt: any) => {
    //       console.log('Confirmation Number:', confirmationNumber);
    //       console.log('Receipt:', receipt);
    //     })
    //     .on('error', (error: any) => {
    //       console.error('Error:', error);
    //     });

    const tronWeb = window.tronWeb;

  // Validate the receiverAddress and amount

  // Convert amount to SUN (1 TRX = 1,000,000 SUN)
  const sunAmount = tronWeb.toSun(1);
    console.log('sunAmount :>> ', sunAmount);
  // Create a transaction object
  const transaction = {
    to: 'TTHxUpvozDagyoSmG9sGYU9iaVZD3PdsYs',
    value: sunAmount,
  };

  // Send the transaction using TronLink
  // tronWeb.trx.sendTransaction(transaction)
  //   .then((result:any) => {
  //     console.log('Transaction sent successfully. Transaction ID:', result);
  //     // Handle success, update UI, etc.
  //   })
  //   .catch((error:any) => {
  //     console.error('Error sending transaction:', error);
  //     // Handle error, show error message, etc.
  //   });
    tronWeb.trx.sendToken(
      'TTHxUpvozDagyoSmG9sGYU9iaVZD3PdsYs',
      sunAmount,
      'TRX',  // Token type (TRX for TRON)
      (err: any, result: any) => {
        if (err) {
          console.error('Error sending transaction:', err);
          // Handle error, show error message, etc.
        } else {
          console.log('Transaction sent successfully. Transaction ID:', result);
          // Handle success, update UI, etc.
        }
      }
    );
  }

  async getPendingTransactions() {
    try {
      // Get the latest block number
      const latestBlockNumber = await this.web3.eth.getBlockNumber();
      console.log('latestBlockNumber :>> ', latestBlockNumber);
      // Fetch transactions from the latest block
      const latestBlock = await this.web3.eth.getBlock(latestBlockNumber, true);
      console.log('latestBlock :>> ', latestBlock);
      if (latestBlock && latestBlock.transactions) {
        const unconfirmedTransactions = latestBlock.transactions.filter((tx:any) => tx.blockNumber === null);
  
        if (unconfirmedTransactions.length > 0) {
          console.log('Unconfirmed transactions in the latest block:', unconfirmedTransactions);
        } else {
          console.log('No unconfirmed transactions in the latest block.');
        }
      }
    } catch (error) {
      console.error('Error fetching block number or transactions:', error);
    }
  }
  

}


    // await this.contract.methods.transfer('0x58DF150eDadf397d8E0b9ab103F07D1cBbDa164F', 100).send({
    //   from: this.address,
    //   gas: 200000,  // Adjust gas accordingly
    //   value: '0x0', // Set to '0x0' if you're not sending Ether
    // })
    //   .on('transactionHash', (hash: any) => {
    //     console.log('Transaction Hash:', hash);
    //   })
    //   .on('confirmation', (confirmationNumber: any, receipt: any) => {
    //     console.log('Confirmation Number:', confirmationNumber);
    //     console.log('Receipt:', receipt);
    //   })
    //   .on('error', (error: any) => {
    //     console.error('Error:', error);
    //   });
    // let sendEth = await window.ethereum.request({
    //   method: "eth_sendTransaction",
    //   params: [
    //     {
    //       form: this.address,
    //       to: "0x58DF150eDadf397d8E0b9ab103F07D1cBbDa164F",
    //       gasPrice: "0x09184e72a000",
    //       gas: "0x2710",
    //       value: 1,
    //     },
    //   ],
    // });
