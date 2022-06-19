import { ConnectButton } from "web3uikit"

export default function Header() {
    return (
        <div className="p-5 border-b-2 flex flex-row items-center">
            <h1 className="py-4 px-4 font-blog text-3xl">Decentralised Lottery</h1>
            <div className="al-auto py-2 px-4">
                <ConnectButton moralisAuth={false} />
            </div>
        </div>
    )
}
