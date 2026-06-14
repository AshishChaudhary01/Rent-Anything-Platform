import { Link } from "react-router-dom";

import RaCard from "../../../../components/card/RaCard";
import Divider from "../../../../components/divider/Divider";
import RaButton from "../../../../components/button/RaButton";
import { FaRegEdit } from "react-icons/fa";

function CollaborateSummaryCard() {
  return (
    <RaCard styleClass="flex flex-col gap-y-4">

      <div className="flex items-center justify-between">
        <h2 className="font-bold text-base md:text-xl">
          Current Request
        </h2>

        {/* Edit Request Button for Small Screen ONLY */}
        <div className="lg:hidden">
          <Link to="/user/rent/request-to-rent">
            <RaButton
              btnText="Edit"
              size="md"
              icon={<FaRegEdit />}
            />
          </Link>
        </div>
      </div>

      <Divider />

      <div className="flex flex-col gap-y-3">

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

      <div className="hidden lg:block">
        <Link to="/user/rent/request-to-rent">
          <RaButton
            btnText="Edit Request"
            size="md"
            icon={<FaRegEdit />}
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