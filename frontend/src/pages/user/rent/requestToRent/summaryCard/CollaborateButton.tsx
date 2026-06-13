import { Link } from "react-router-dom";
import RaButton from "../../../../../components/button/RaButton";

const CollaborateButton = () => {
  return (
    <Link to={"/user/rent/collaborate"}>
      <RaButton
        type="submit"
        btnText="Continue"
        size="large"
      />
    </Link>
  );
};

export default CollaborateButton