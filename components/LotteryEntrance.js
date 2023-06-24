import { useEffect, useState } from "react";
import { useMoralis, useWeb3Contract } from "react-moralis";
import contractAddresses from "../contracts/addresses.json";
import abi from "../contracts/abi.json";
import { useNotification } from "web3uikit";

export const LotteryEntrance = () => {
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis();
  const chainId = parseInt(chainIdHex);
  const dispatch = useNotification();
  // console.log(chainId);
  const raffleAddress =
    chainId in contractAddresses ? contractAddresses[chainId][0] : null;
  // console.log(raffleAddress);
  const [entranceFee, setEntranceFee] = useState("");
  const [numberOfPlayers, setNumberOfPlayers] = useState("");
  const [recentWinner, setRecentWinner] = useState("");
  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "enterRaffle",
    params: {},
    msgValue: entranceFee,
  });
  const { runContractFunction: getEntranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getEntranceFee",
    params: {},
  });
  const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getNumberOfPlayers",
    params: {},
  });
  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress,
    functionName: "getRecentWinner",
    params: {},
  });

  const handleSuccess = async (tx) => {
    await tx.wait(1);
    handleNewNotification(tx);
    updateUi();
  };
  async function updateUi() {
    const fee = (await getEntranceFee()).toString();
    const numberPlayers = (await getNumberOfPlayers()).toString();
    const recentWinner = await getRecentWinner();
    setRecentWinner(recentWinner);
    setNumberOfPlayers(numberPlayers);
    setEntranceFee(fee);
  }
  const handleNewNotification = (tx) => {
    dispatch({
      type: "info",
      message: "transaction complete!",
      title: "transaction notification",
      position: "topR",
      icon: "bell",
    });
  };
  useEffect(() => {
    if (isWeb3Enabled) {
      updateUi();
    }
  }, [isWeb3Enabled]);

  return (
    <div className="p-5">
      <h1 className="py-4 px-4 font-bold text-3xl">Lottery</h1>
      {raffleAddress ? (
        <>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto"
            onClick={async () =>
              await enterRaffle({
                // onComplete:
                // onError:
                onSuccess: handleSuccess,
                onError: (error) => console.log(error),
              })
            }
            disabled={isLoading || isFetching}>
            {isLoading || isFetching ? (
              <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
            ) : (
              "Enter Raffle"
            )}
          </button>
          <div>
            Entrance Fee: {entranceFee} WEI
          </div>
          <div>The current number of players is: {numberOfPlayers}</div>
          <div>The most previous winner was: {recentWinner}</div>
        </>
      ) : (
        <div>Please connect to a supported chain </div>
      )}
    </div>
  );
}