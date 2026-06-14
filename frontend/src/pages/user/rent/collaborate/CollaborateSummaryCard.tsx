import { Link } from "react-router-dom";

import RaCard from "../../../../components/card/RaCard";
import Divider from "../../../../components/divider/Divider";
import RaButton from "../../../../components/button/RaButton";
import { FaRegEdit } from "react-icons/fa";
import { tent01 } from "../../../../utils/images";
import { IoArrowForward, IoArrowForwardOutline } from "react-icons/io5";

function CollaborateSummaryCard() {
  return (
    <RaCard styleClass="flex flex-col gap-y-4">

      <div className="">

        {/* Small Screen ONLY */}
        <div className="lg:hidden flex justify-between gap-x-4 items-center">

          <div className="flex gap-x-2">
            <div><img src={tent01} alt="Listing Image" className="size-10 rounded-lg" /></div>
            <div className="text-base md:text-xl font-bold flex items-center truncate">Hiking Tent</div>
          </div>

          <div className="flex gap-x-2">
            <Link to="/user/rent/request-to-rent">
              <RaButton
                btnText="Edit"
                size="md"
                variant="outline"
                icon={<FaRegEdit />}
              />
            </Link>
            <Link to="/user/rent/checkout">
              <RaButton
                btnText="Continue"
                size="md"
                icon={<IoArrowForwardOutline />}
              // disabled={true}
              />
            </Link>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-3">
        <div className="hidden lg:block">
          <div className="flex gap-x-4">
            <div><img src={tent01} alt="Listing Image" className="size-14 rounded-lg" /></div>
            <div className="text-lg md:text-xl font-bold flex items-center truncate">Hiking Tent</div>
          </div>
        </div>

        <Divider />

        <div>
          <p className="text-sm text-muted">
            Rental Duration
          </p>

          <p className="font-semibold">
            Jul 10, 2026 - Jul 14, 2026
          </p>
        </div>

        <div>
          <p className="text-sm text-muted">
            Meetup Location
          </p>

          <p className="font-semibold">
            Baneshwor, Kathmandu
          </p>
        </div>

        <div>
          <p className="text-sm text-muted">
            Meetup Date & Time
          </p>

          <p className="font-semibold">
            10:30 AM, Jul 10,2026
          </p>
        </div>

        <div>
          <p className="text-sm text-muted">
            Note
          </p>

          <p className="font-semibold">
            Please be on time at the meetup location.
          </p>
        </div>

      </div>

      <Divider />

      <div className="hidden lg:flex flex-col gap-y-2">
        <Link to="/user/rent/request-to-rent">
          <RaButton
            btnText="Edit Request"
            size="md"
            variant="outline"
            icon={<FaRegEdit />}
          />
        </Link>
        <Link to="/user/rent/checkout">
          <RaButton
            btnText="Continue"
            size="md"
            icon={<IoArrowForwardOutline />}
          // disabled={true}
          />
        </Link>
      </div>

      <div className="text-center text-sm text-muted">
        Changes can be made before the request is accepted.
      </div>

    </RaCard>
  );
}

export default CollaborateSummaryCard;