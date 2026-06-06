import {
  IoHardwareChipOutline,
  IoConstructOutline,
  IoFlashOutline,
  IoMusicalNotesOutline,
  IoCameraOutline,
  IoBicycleOutline,
  IoHomeOutline,
  IoGameControllerOutline,
} from "react-icons/io5";
import { Link } from "react-router-dom";

export const categories = [
  {
    id: 1,
    name: "Electronics",
    path: "/user/category/electronics",
    icon: IoHardwareChipOutline,
  },
  {
    id: 2,
    name: "Adventure Tools",
    path: "/user/category/adventure-tools",
    icon: IoConstructOutline,
  },
  {
    id: 3,
    name: "Appliances",
    path: "/user/category/appliances",
    icon: IoFlashOutline,
  },
  {
    id: 4,
    name: "Musical Instruments",
    path: "/user/category/music",
    icon: IoMusicalNotesOutline,
  },
  {
    id: 5,
    name: "Photography",
    path: "/user/category/photography",
    icon: IoCameraOutline,
  },
  {
    id: 6,
    name: "Outdoor Gear",
    path: "/user/category/outdoor",
    icon: IoBicycleOutline,
  },
  {
    id: 7,
    name: "Home Essentials",
    path: "/user/category/home",
    icon: IoHomeOutline,
  },
  {
    id: 8,
    name: "Gaming",
    path: "/user/category/gaming",
    icon: IoGameControllerOutline,
  },
];

const RaCategoryBar = () => {
  return (
    <div
      className="
        flex gap-3
        overflow-x-auto
        scrollbar-none
        py-2
      "
    >
      {categories.map((cat) => {
        const Icon = cat.icon;

        return (
          <Link
            key={cat.id}
            to={cat.path}
            className="
              flex items-center gap-2
              whitespace-nowrap
              bg-white
              border border-gray-200
              rounded-full
              px-4 py-2
              text-xs md:text-sm
              text-muted
              hover:border-muted/40
              hover:text-black
              transition
            "
          >
            <Icon className="size-3 text-primary" />
            {cat.name}
          </Link>
        );
      })}
    </div>
  );
};

export default RaCategoryBar;