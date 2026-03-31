
import SlackMessage from "../ui/message/Message";
import MessageEditor from "../ui/messageEditor/MessageEditor"
import { FaRegWindowMaximize, FaEllipsisH, FaTimes } from "react-icons/fa"; // Icons for the header
interface ThreadProps {
    onCloseThread: () => void; // Function to handle closing the thread
}
export const Thread: React.FC<ThreadProps> = ({ onCloseThread }) => {
    return (
        <div className="w-full h-full bg-white border-l-1 shadow-xl/30 z-51">
            <div className="w-full relative">
                <div className="flex justify-between items-center p-2 rounded-t-lg text-gray-600">
                    {/* Thread Title */}
                    <h2 className="text-xl font-bold">Thread</h2>

                    {/* Icons */}
                    <div className="flex items-center space-x-4">
                        {/* Grid Icon */}
                        <button className="p-1 hover:bg-gray-100 rounded-md">
                            <FaRegWindowMaximize size={15} />
                        </button>

                        {/* Settings Icon (Ellipsis) */}
                        <button className="p-1 hover:bg-gray-100 rounded-md">
                            <FaEllipsisH size={15} />
                        </button>

                        {/* Close Icon (X) */}
                        <button className="p-1 hover:bg-gray-100 rounded-md" onClick={onCloseThread}>
                            <FaTimes size={15} />
                        </button>
                    </div>
                </div>
                <div className="max-h-[calc(100vh-85px)] overflow-y-scroll flex flex-col-reverse">
                    <div className="w-full px-2 pb-4">
                        <MessageEditor />
                    </div>

                    <div className="py-5">
                        <SlackMessage
                            state="thread"
                            avatar="/avatar.png"
                            username="bladmirpedro11"
                            time="10:05 AM"
                            text="This is Test Text"
                            files={[{ name: "HEAD", type: "Plain Text" }, { name: "index", type: "Binary" }, { name: "avatar.png", type: "PNG" }]}
                            reactions={[{ emoji: "✅", count: 2 }, { emoji: "👀", count: 2 }, { emoji: "🙌", count: 2 }, { emoji: "🧑", count: 1 }]}
                            replies={2}
                            lastReply="16 hours ago"
                            onCommentClick={() => { }}
                            messageId={"001"}
                        />
                        <div className="flex justify-center py-2 flex items-center w-full bg-white">
                            {/* Date Pill */}
                            <div
                                className="px-3 py-[6px] mx-3 text-sm text-[#616061] flex items-center"
                            >
                                2 replies
                            </div>
                            {/* Right Line */}
                            <div className="flex-1 h-px bg-[#E0E0E0]" />
                        </div>
                        <SlackMessage
                            state="thread"
                            avatar="/avatar.png"
                            username="bladmirpedro11"
                            time="10:05 AM"
                            text="This is Test Text"
                            files={[{ name: "HEAD", type: "Plain Text" }, { name: "index", type: "Binary" }, { name: "avatar.png", type: "PNG" }]}
                            reactions={[{ emoji: "✅", count: 2 }, { emoji: "👀", count: 2 }, { emoji: "🙌", count: 2 }, { emoji: "🧑", count: 1 }]}
                            replies={2}
                            lastReply="16 hours ago"
                            onCommentClick={() => { }}
                            messageId={"001"}
                        />


                    </div>

                </div>
            </div>
        </div>
    )
}