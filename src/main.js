import Alpine from 'alpinejs'
import { ethers } from "ethers"
import myEpicNft from './MyEpicNFT.json'

window.Alpine = Alpine

Alpine.data('app', () => ({
  currentAccount: null,
  connectedContract: null,
  contractAddress: '0xE2338062cE9a08e61f444b6C27171DAc2D598BD0',
  rinkebyNetwork: false,
  async init() {
    this.checkIfWalletIsConnected();
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    this.connectedContract = new ethers.Contract(this.contractAddress, myEpicNft.abi, signer);
  },
  async checkIfWalletIsConnected() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        console.log("Make sure you have metamask!");
        return;
      } else {
        console.log("We have the ethereum object", ethereum);
      }

      const accounts = await ethereum.request({ method: 'eth_accounts' });
      if (accounts.length !== 0) {
        this.currentAccount = accounts[0];
        this.rinkebyNetwork = window.ethereum.networkVersion === '4' ? true : false;
        console.log("Found an authorized account:", this.currentAccount);

        this.connectedContract.on("NewEpicNFTMinted", (from, tokenId) => {
          console.log(from, tokenId.toNumber())
          alert(`Hey there! We've minted your NFT and sent it to your wallet. It may be blank right now. It can take a max of 10 min to show up on OpenSea. Here's the link: https://testnets.opensea.io/assets/${this.contractAddress}/${tokenId.toNumber()}`)
        });
      } else {
        console.log("No authorized account found")
      }
    } catch (error) {
      console.log(error);
    }
  },
  async connectWallet() {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }

      const accounts = await ethereum.request({ method: "eth_requestAccounts" });
      console.log("Connected", accounts[0]);
      this.currentAccount = accounts[0];
      this.rinkebyNetwork = window.ethereum.networkVersion === '4' ? true : false;
    } catch (error) {
      console.log(error)
    }
  },
  async askContractToMintNft() {
    try {
      const { ethereum } = window;

      if (ethereum) {
        console.log("Going to pop wallet now to pay gas...")
        let nftTxn = await this.connectedContract.makeAnEpicNFT();

        console.log("Mining...please wait.")
        await nftTxn.wait();

        console.log(`Mined, see transaction: https://rinkeby.etherscan.io/tx/${nftTxn.hash}`);

      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error)
    }
  },
}))

Alpine.start()