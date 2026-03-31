import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useUser } from "~/providers/userProvider";
import { UserLogin } from "~/components/user/login";
import { ContentTile } from "~/components/common/content_tile";

export default function Login() {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) navigate("/", { replace: true });
  }, [user, navigate]);

  return (
    <div className="content-tile-wrap">
      <ContentTile header="Login">
        <UserLogin />
      </ContentTile>
    </div>
  );
}
