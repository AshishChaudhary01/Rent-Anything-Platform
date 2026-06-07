import { Link, useLocation } from "react-router-dom";

const ROLE_HOME: Record<string, string> = {
  user: "/user",
  admin: "/admin",
};

function RaBreadcrumb() {
  const location = useLocation();

  const segments = location.pathname.split("/").filter(Boolean);

  const role = segments[0]; // user | admin
  const homePath = ROLE_HOME[role] || "/";

  // remove role segment
  const cleanSegments = segments.slice(1);

  const crumbs = cleanSegments.map((seg, i) => ({
    label: seg.replace(/-/g, " "),
    path: "/" + segments.slice(0, i + 2).join("/"),
  }));

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">

      {/* Home */}
      <Link to={homePath} className="hover:text-primary">
        Home
      </Link>

      {/* Dynamic crumbs */}
      {crumbs.map((c, i) => (
        <div key={c.path} className="flex items-center gap-2">
          <span>/</span>

          {i === crumbs.length - 1 ? (
            <span className="text-text-dark font-medium capitalize">
              {c.label}
            </span>
          ) : (
            <Link to={c.path} className="hover:text-primary capitalize">
              {c.label}
            </Link>
          )}
        </div>
      ))}
    </div>
  );
}

export default RaBreadcrumb;