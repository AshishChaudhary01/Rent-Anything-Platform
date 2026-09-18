import { Link, useLocation } from "react-router-dom";

const ROLE_HOME: Record<string, string> = {
  user: "/user",
  admin: "/admin",
};

function RaBreadcrumb({
  items,
}: {
  items?: { label: string; path?: string }[]
}) {
  const location = useLocation();

  const trail = items
    ? [{ label: "Home", path: "/user" }, ...items]
    : (() => {
      const segments = location.pathname.split("/").filter(Boolean);
      const role = segments[0];
      return [
        { label: "Home", path: ROLE_HOME[role] || "/" },
        ...segments.slice(1).map((seg, i, arr) => ({
          label: seg.replace(/-/g, " "),
          path: i === arr.length - 1 ? undefined : "/" + segments.slice(0, i + 2).join("/"),
        })),
      ];
    })();

  return (
    <div className="flex items-center gap-2 text-sm text-gray-500">
      {trail.map((c, i) => (
        <div key={`${c.label}-${i}`} className="flex items-center gap-2">
          {i > 0 && <span>/</span>}
          {i === trail.length - 1 || !c.path ? (
            <span className="text-text-dark font-medium capitalize">{c.label}</span>
          ) : (
            <Link to={c.path} className="hover:text-primary capitalize">{c.label}</Link>
          )}
        </div>
      ))}
    </div>
  );
}

export default RaBreadcrumb;
