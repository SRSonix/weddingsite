import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "~/providers/userProvider";

export function UserLogin(){
  const {t} = useTranslation(["user", "common"])
  const {login} = useUser();
  const [userToken, setuserToken] = useState('');
  const [errorMessage, setErrorMessage] = useState("");

    const handleFormSubmit = (e: FormEvent) => {
        setErrorMessage("");

        e.preventDefault();
        if (!userToken) {
            setErrorMessage("User Token missing! Contact the wedding organizer to request a new one!");
            return;
        }

        login(userToken).then(
            (loginResult) => {
                if(!loginResult) setErrorMessage("Login Failed! Contact the wedding organizer if you have problems with the login!");
            }
        );
    };

    return (
        <div>
          <h3>Login</h3>
          <p>please log in to see the content of this website.</p>
            { errorMessage &&  <div>
                <p className="text-red-700">{errorMessage}</p>
            </div>}
            <form onSubmit={handleFormSubmit} className="w-full max-w-lg flex flex-wrap">
              <div>
                <label htmlFor="userToken" className="input-label">Token:</label>
                <input
                  className="input-block"
                  type="password"
                  id="userToken"
                  placeholder="token"
                  value={userToken}
                  onChange={(e) => setuserToken(e.target.value)}
                />
              </div>
              <div className="px-3 mt-7">
                <button type="submit" className="btn">Log In</button>
              </div>
            </form>
        </div>
    );
}