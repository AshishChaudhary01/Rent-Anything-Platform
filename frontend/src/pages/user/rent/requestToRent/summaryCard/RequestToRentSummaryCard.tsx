import RaCard from "../../../../../components/card/RaCard"
import Divider from "../../../../../components/divider/Divider"
import RequestToCollaborateButton from "./CollaborateButton"
import CollaborateButton from "./CollaborateButton"

function RequestToRentSummaryCard({
  formData,
}: any) {
  const getDays = () => {
    if (!formData.startDate || !formData.endDate)
      return 0;

    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);

    const diff =
      (end.getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24);

    return diff > 0 ? diff : 0;
  };
  const days = getDays();

  const dailyRate = 100; // later replace with listing rate

  const rental = days * dailyRate;
  const commitmentFee = 100;
  const deposit = 100;
  const subtotal = rental + commitmentFee + deposit;
  const payNow = commitmentFee;
  const payLater = rental + deposit;

  return (
    <RaCard styleClass="flex flex-col gap-y-4">
      <div className="font-medium flex gap-x-4 justify-between lg:justify-start items-center">
        <p className="text-base lg:text-2xl font-bold truncate">
          Demo Listing Title
        </p>

        {/* Request Button for Small Screen ONLY */}
        <div className="lg:hidden text-base md:text-lg gap-x-2 flex justify-between">
          <div className="flex items-center">
            <p>Total: <span className="font-bold text-primary">400</span></p>
          </div>
          <CollaborateButton />
        </div>
      </div>
      <Divider />

      <div className="flex flex-col gap-y-2">
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <p>
              Rental(Nrs. {dailyRate} / day x {days})
            </p>
          </div>
          <p className="font-bold">Nrs. {rental}</p>

        </div>
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <p>Commitment fee(For trust)</p>
          </div>
          <p className="font-bold">Nrs. {commitmentFee}</p>
        </div>
        <div className="flex justify-between">
          <div className="flex gap-x-2 items-center text-muted">
            <p>Security Deposit(Refundable)</p>
          </div>
          <p className="font-bold">Nrs. {deposit}</p>
        </div>
        <div className="flex justify-between my-2">
          <div className="flex gap-x-2 items-center text-xl font-semibold">
            <p>Sub Total:</p>
          </div>
          <p className="font-bold">Nrs. {subtotal}</p>
        </div>
      </div>
      <Divider />

      <div className="flex text-gray-600 justify-between gap-x-4 items-center text-lg">
        <div>Pay Later: </div>
        <div>Nrs.<span>{payLater}</span></div>
      </div>
      <div className="flex justify-between gap-x-4 items-center text-2xl font-semibold">
        <div>Pay now: </div>
        <div>Nrs.<span>{payNow}</span></div>
      </div>

      {/* Request To Collaborate Button Full view Only */}
      <div className="hidden lg:block">

        <RequestToCollaborateButton />
      </div>
      <div className="text-center text-muted font-light text-sm"> For now, you will only be charged a small commitment fee that will later be deducted from total fee.</div>
    </RaCard>
  )
}


export default RequestToRentSummaryCard