import { IoSend } from "react-icons/io5";

import RaCard from "../../../../components/card/RaCard";
import { profile01 } from "../../../../utils/images";

function CollaborateChat() {
  return (
    <RaCard round="round" styleClass="flex flex-col h-[78vh] lg:h-[88vh]">

      {/* Header */}
      <div className="pb-4 border-b border-gray-300 px-2">
        <p className="font-bold text-lg md:text-xl">
          Chat & Collaborate
        </p>
        <p className="font-light text-sm">
          You can negotiate meetup details with the lister.
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-4 flex flex-col gap-6">

        <div className="flex gap-x-4 items-start">
          <img src={profile01} alt="Profile Picture" className="size-8 md:size-10 rounded-full"></img>
          <div className="text-sm md:text-base self-start max-w-[70%] bg-gray-100 rounded-xl px-4 py-3">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat cumque quos necessitatibus corporis. Voluptatem laborum eius nulla aspernatur, tempora veritatis unde voluptatum corporis sapiente ab rerum, magni repellat accusamus minus?
          </div>
        </div>

        <div className="flex gap-x-4 items-start justify-start flex-row-reverse">
          <img src={profile01} alt="Profile Picture" className="size-10 rounded-full"></img>
          <div className="self-start max-w-[70%]  bg-primary text-white rounded-xl px-4 py-3">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat cumque quos necessitatibus corporis. Voluptatem laborum eius nulla aspernatur, tempora veritatis unde voluptatum corporis sapiente ab rerum, magni repellat accusamus minus?
            </p>
          </div>
        </div>
        <div className="flex gap-x-4 items-start">
          <img src={profile01} alt="Profile Picture" className="size-10 rounded-full"></img>
          <div className="self-start max-w-[70%] bg-gray-100 rounded-xl px-4 py-3">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat cumque quos necessitatibus corporis. Voluptatem laborum eius nulla aspernatur, tempora veritatis unde voluptatum corporis sapiente ab rerum, magni repellat accusamus minus?
            </p>
          </div>
        </div>

        <div className="flex gap-x-4 items-start justify-start flex-row-reverse">
          <img src={profile01} alt="Profile Picture" className="size-10 rounded-full"></img>
          <div className="self-start max-w-[70%]  bg-primary text-white rounded-xl px-4 py-3">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat cumque quos necessitatibus corporis. Voluptatem laborum eius nulla aspernatur, tempora veritatis unde voluptatum corporis sapiente ab rerum, magni repellat accusamus minus?
            </p>
          </div>
        </div>
        <div className="flex gap-x-4 items-start">
          <img src={profile01} alt="Profile Picture" className="size-10 rounded-full"></img>
          <div className="self-start max-w-[70%] bg-gray-100 rounded-xl px-4 py-3">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat cumque quos necessitatibus corporis. Voluptatem laborum eius nulla aspernatur, tempora veritatis unde voluptatum corporis sapiente ab rerum, magni repellat accusamus minus?
            </p>
          </div>
        </div>

        <div className="flex gap-x-4 items-start justify-start flex-row-reverse">
          <img src={profile01} alt="Profile Picture" className="size-10 rounded-full"></img>
          <div className="self-start max-w-[70%]  bg-primary text-white rounded-xl px-4 py-3">
            <p>
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugiat cumque quos necessitatibus corporis. Voluptatem laborum eius nulla aspernatur, tempora veritatis unde voluptatum corporis sapiente ab rerum, magni repellat accusamus minus?
            </p>
          </div>
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