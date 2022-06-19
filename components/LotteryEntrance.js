import { useWeb3Contract } from "react-moralis"
import { useMoralis } from "react-moralis"
import { useEffect, useState } from "react"
import contractAddress from "../constants/contractAddress.json"
import abi from "../constants/abi.json"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"

export default function LotteryEntrance() {
    const [entranceFee, setEntranceFee] = useState("0")
    const [noOfPlayers, setNoOfPlayers] = useState("0")
    const [recentWinner, setRecentWinner] = useState("0")
    const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
    const chainId = parseInt(chainIdHex) //converting hex to int
    const lotteryAddress = chainId in contractAddress ? contractAddress[chainId][0] : null
    const dispatch = useNotification()
    const {
        runContractFunction: enterLottery,
        isFetching,
        isLoading,
    } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "enterLottery",
        params: {},
        msgValue: entranceFee,
    })
    const { runContractFunction: getEntranceFee } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getEntranceFee",
        params: {},
    })
    const { runContractFunction: getNumberOfPlayers } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getNumberOfPlayers",
        params: {},
    })
    const { runContractFunction: getRecentWinner } = useWeb3Contract({
        abi: abi,
        contractAddress: lotteryAddress,
        functionName: "getRecentWinner",
        params: {},
    })

    async function updateUI() {
        const entranceFeeFromContract = (await getEntranceFee()).toString()
        setEntranceFee(entranceFeeFromContract)
        await updateNoOfPlayers()
        await updateRecentWinner()
    }

    //geting the entrance fee after knowing metawallet is connected
    useEffect(() => {
        if (isWeb3Enabled) {
            updateUI()
        }
    }, [isWeb3Enabled])

    const handleSuccess = async (tx) => {
        await tx.wait(1)
        handleNewNotification(tx) //for popup notification
        updateUI()
    }

    const handleNewNotification = (tx) => {
        //creating notification
        dispatch({
            type: "info",
            message: "Transaction Complete!",
            title: "Tx Notification",
            position: "topR",
            icon: "bell",
        })
    }

    const updateNoOfPlayers = async () => {
        const noOfPlayersFromContract = (await getNumberOfPlayers()).toString()
        setNoOfPlayers(noOfPlayersFromContract)
    }

    const updateRecentWinner = async () => {
        const recentWinnerFromContract = (await getRecentWinner()).toString()
        setRecentWinner(recentWinnerFromContract)
    }

    return (
        <div className="p-5">
            {lotteryAddress ? (
                <div>
                    <button
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md"
                        onClick={async () => {
                            await enterLottery({
                                onSuccess: handleSuccess,
                                onError: (error) => {
                                    console.log(error)
                                },
                            })
                        }}
                        disabled={isFetching || isLoading}
                    >
                        {isLoading || isFetching ? (
                            <div className="animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                        ) : (
                            <div>Enter Lottery</div>
                        )}
                    </button>
                    <div>Entrance Fee: {ethers.utils.formatUnits(entranceFee, "ether")} ETH</div>
                    <div>No Of Players: {noOfPlayers}</div>
                    <div>Recent Winner: {recentWinner}</div>
                </div>
            ) : (
                <div>No Lottery Address detected</div>
            )}
        </div>
    )
}
