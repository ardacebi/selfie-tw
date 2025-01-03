import { FaLock, FaMailBulk } from "react-icons/fa";
import { useMutation } from "@tanstack/react-query";
import postNewPassword from "../data_creation/postNewPassword.js";

const ForgotPasswordForm = () => {
  const mutateAccount = useMutation(postNewPassword, {
    onSuccess: (data) => {
      console.log('Account found! Password changed! ', data);
    },
    onError: (error) => {
      console.error('Error changing password: ', error);
    },
  });
  return (
    <div>
      <form
        action=""
        onSubmit={(e) => {
          e.preventDefault();
          const formData = new FormData(e.target);
          const userDataObj = {
            email: formData.get("email") ?? "",
            password: formData.get("password") ?? "",
          };
          mutateAccount.mutate(userDataObj);
        }}
      >
        <h1>Change Password</h1>
        <label htmlFor="email">
          <div className="input-box">
            <input
              name="email"
              id="email"
              type="text"
              placeholder="Email"
              required
            />
            <FaMailBulk className="icon" />
          </div>
        </label>

        <label htmlFor="password">
          <div className="input-box">
            <input
              name="password"
              id="password"
              type="password"
              placeholder="New Password"
              required
            />
            <FaLock className="icon" />
          </div>
        </label>
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};

export default ForgotPasswordForm;
