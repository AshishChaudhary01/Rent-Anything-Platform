import { Link } from "react-router-dom";
import RaButton from "../../../../components/button/RaButton"

const RequestToRentButton = () => {
  return (
    <Link to={"/user/rent/request-to-rent"}>
      <RaButton
        type="submit"
        btnText="Request to Rent"
        size="large"
      />
    </Link>
  );
};

export default RequestToRentButton