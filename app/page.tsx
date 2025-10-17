"use client";

import { useEffect, useState } from "react";
import styles from "./page.module.css";
import { Wallet } from "@coinbase/onchainkit/wallet";
import { useAccount, useBalance, useSignMessage } from "wagmi";
import { useGreeter } from "@/src/hooks/useGreeter";
import { baseSepolia } from "viem/chains";

export default function Home() {
  const { address, isConnected, chain } = useAccount();
  const { data: wagmiBalance } = useBalance({ address });
  const {
    signMessage,
    data: signatureData,
    isPending: isSigning,
  } = useSignMessage();

  const [newGreeting, setNewGreeting] = useState("");
  const [message, setMessage] = useState("");
  const [balance, setBalance] = useState<string | null>(null);
  const [signature, setSignature] = useState<string | null>(null);
  

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const [currentChain, setCurrentChain] = useState<any>(null);


  const isCorrectNetwork = currentChain?.id === baseSepolia.id;

  const {
    greeting,
    refetchGreeting,
    readError,
    setGreeting,
    isWritePending,
    writeError,
    isConfirming,
    isConfirmed,
    confirmError,
    transactionHash,
  } = useGreeter(); // Make sure your hook returns `hash`

  useEffect(() => {
    if (wagmiBalance?.formatted) {
      setBalance(`${parseFloat(wagmiBalance.formatted).toFixed(4)} ${wagmiBalance.symbol}`);
    }
  }, [wagmiBalance]);

  useEffect(() => {
    if (signatureData) {
      setSignature(signatureData);
    }
  }, [signatureData]);

  useEffect(() => {
    if (chain) {
      setCurrentChain(chain);
    }
  }, [chain]);

  useEffect(() => {
    if (isConfirmed) {
      refetchGreeting();
      setNewGreeting("");
    }
  }, [isConfirmed, refetchGreeting]);

  const handleSign = () => {
    if (!message) return alert("Enter a message to sign!");
    signMessage({ message });
  };

  const handleSetGreeting = () => {
    if (newGreeting.trim()) {
      setGreeting(newGreeting);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.headerWrapper}>
        <h1 className={styles.title}>🚀 Base dApp</h1>
        <Wallet />
      </header>

      <main className={styles.content}>
        {!isConnected ? (
          <p className={styles.infoText}>
            Connect your wallet to sign messages and interact with smart contracts on the Base network.
          </p>
        ) : (
          <div className={styles.section}>
            {/* Network Check */}
            {!isCorrectNetwork && (
              <div className={styles.errorMessage}>
                <p>⚠️ Wrong Network! Please switch to Base Sepolia.</p>
                <p className={styles.networkInfo}>
                  Current: {currentChain?.name || "Unknown"} | Required: <b>Base Sepolia</b>
                </p>
              </div>
            )}

            {/* Wallet Overview */}
            {isCorrectNetwork && (
              <>
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>Wallet Overview</h2>
                  <p className={styles.label}>Address:</p>
                  <p className={styles.address}>{address}</p>

                  {balance && (
                    <div className={styles.balanceSection}>
                      <p className={styles.label}>ETH Balance:</p>
                      <p className={styles.balance}>{balance}</p>
                    </div>
                  )}
                </div>

                {/* Message Signing */}
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>Sign a Message (Gasless)</h2>

                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={styles.input}
                    placeholder="Enter message to sign"
                  />

                  <button
                    className={styles.button}
                    onClick={handleSign}
                    disabled={isSigning}
                  >
                    {isSigning ? "Signing..." : "Sign Message"}
                  </button>

                  {signature && (
                    <div className={styles.signatureBox}>
                      <p className={styles.label}>Signature:</p>
                      <p className={styles.signature}>{signature}</p>
                    </div>
                  )}
                </div>

                {/* Greeter Contract Section */}
                <div className={styles.card}>
                  <h2 className={styles.cardTitle}>Greeter Contract</h2>

                  <div className={styles.greetingDisplay}>
                    <p className={styles.label}>Current Greeting:</p>
                    <p className={styles.currentGreeting}>{greeting || "Loading..."}</p>
                  </div>

                  <div className={styles.updateSection}>
                    <p className={styles.label}>Update Greeting:</p>
                    <input
                      type="text"
                      value={newGreeting}
                      onChange={(e) => setNewGreeting(e.target.value)}
                      className={styles.input}
                      placeholder="Enter new greeting"
                    />
                <button
  onClick={handleSetGreeting}
  disabled={isWritePending || isConfirming || !newGreeting.trim()}
  className={styles.button}
>
  {isWritePending ? (
    <span className={styles.spinner}></span> // spinner for pending
  ) : isConfirming ? (
    <span className={styles.spinner}></span> // spinner for confirming
  ) : (
    "Please hold on for popup"
  )}
</button>

                  </div>

                  {/* Transaction hash */}
                  {transactionHash && (
                    <div className={styles.transactionSection}>
                      <p className={styles.label}>Transaction Submitted:</p>
                      <a
                        href={`https://sepolia.basescan.org/tx/${transactionHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.link}
                      >
                        {transactionHash}
                      </a>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
