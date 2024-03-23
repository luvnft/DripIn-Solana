import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

function ConnectMetamask() {
  const [walletAddress, setWalletAddress] = useState("");
  const [loading, setLoading] = useState(false);

  async function requestAccount() {
    setLoading(true);
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
      } else {
        throw new Error("Metamask not detected");
      }
    } catch (error) {
      console.error("Error connecting:", error.message);
      alert(
        "Failed to connect to Metamask. Please make sure it's installed and unlocked."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    function handleAccountsChanged(accounts) {
      if (accounts.length === 0) {
        setWalletAddress("");
      }
    }

    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountsChanged);
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      }
    };
  }, []);

  function formatWalletAddress(address) {
    if (!address) return "";
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }

  return (
    <div>
      {/* <button
        style={{
          color: "white",
          borderRadius: "13px",
          height: "40px",
          width: "165px",
          fontFamily: "Light",
          position: "relative",
          border: "2px solid white",
        }}
        onClick={requestAccount}
        disabled={loading}
      > */}
      <Button onClick={requestAccount}
        disabled={loading}>        {loading
          ? "Connecting..."
          : walletAddress
          ? formatWalletAddress(walletAddress)
          : "Connect Wallet"}
      {/* </button> */}</Button>

    </div>
  );
}

export default ConnectMetamask;
