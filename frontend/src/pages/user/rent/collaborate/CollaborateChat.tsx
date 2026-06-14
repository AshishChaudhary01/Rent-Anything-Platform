import { IoSend } from "react-icons/io5";

import RaCard from "../../../../components/card/RaCard";

function CollaborateChat() {
  return (
    <RaCard round="round" styleClass="flex flex-col h-[70vh] md:h-[85vh]">

      {/* Header */}
      <div className="pb-4 border-b">
        <h2 className="font-bold text-xl">
          Chat & Collaborate
        </h2>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-3">

        <div className="self-start max-w-[80%] bg-gray-100 rounded-xl px-4 py-3">
          Is this item available next week?
        </div>

        <div className="self-end max-w-[80%] bg-primary text-white rounded-xl px-4 py-3">
          Yes, it is available.
        </div>

        <div className="self-start max-w-[80%] bg-gray-100 rounded-xl px-4 py-3">
          Is this item available next week?
        </div>

        <div className="self-end max-w-[80%] bg-primary text-white rounded-xl px-4 py-3">
          Yes, it is available.
        </div>

        <div className="self-start max-w-[80%] bg-gray-100 rounded-xl px-4 py-3">
          Is this item available next week?
        </div>

        <div className="self-end max-w-[80%] bg-primary text-white rounded-xl px-4 py-3">
          Yes, it is available.
        </div>

        <div className="self-start max-w-[80%] bg-gray-100 rounded-xl px-4 py-3">
          Is this item available next week?
        </div>

        <div className="self-end max-w-[80%] bg-primary text-white rounded-xl px-4 py-3">
          Yes, it is available.
        </div>

        <div className="self-start max-w-[80%] bg-gray-100 rounded-xl px-4 py-3">
          Is this item available next week?
        </div>

        <div className="self-end max-w-[80%] bg-primary text-white rounded-xl px-4 py-3">
          Yes, it is available.
        </div>

        <div className="self-start max-w-[80%] bg-gray-100 rounded-xl px-4 py-3">
          Is this item available next week?
        </div>

        <div className="self-end max-w-[80%] bg-primary text-white rounded-xl px-4 py-3">
          Yes, it is available.
        </div>

      </div>

      {/* Input */}
      <div className="border-t border-gray-300 pt-4 flex gap-2">

        <input
          type="text"
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-4 py-2"
        />

        <button
          className="bg-primary text-white px-4 rounded-lg"
        >
          <IoSend />
        </button>

      </div>

    </RaCard>
  );
}

export default CollaborateChat;