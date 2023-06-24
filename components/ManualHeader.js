import React, { useEffect } from "react";
import { useMoralis } from "react-moralis";
const ManualHeader = () => {
  const {
    enableWeb3,
    account,
    isWeb3Enabled,
    Moralis,
    deactivateWeb3,
    isWeb3EnableLoading,
  } = useMoralis();

  useEffect(() => {
    if (isWeb3Enabled) return;
    if (typeof window !== "undefined") {
      if (window.localStorage.getItem("IS_WEB3_ENABLED")) enableWeb3();
    }
  }, [isWeb3Enabled]);

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      console.log(`${account} changed`);
      if (account == null) {
        deactivateWeb3();
        window.localStorage.removeItem("IS_WEB3_ENABLED");
      }
    });
  }, []);

  return (
    <div>
      {account ? (
        <div>Connected!!</div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
            if (typeof window !== "undefined") {
              window.localStorage.setItem("IS_WEB3_ENABLED", true);
            }
          }}
          disabled={isWeb3EnableLoading}>
          Enable Web3
        </button>
      )}
    </div>
  );
};

export default ManualHeader;
