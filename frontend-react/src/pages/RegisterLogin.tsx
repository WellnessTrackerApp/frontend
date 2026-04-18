import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  FaArrowRight,
  FaDumbbell,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaUser,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthToggleTabs from "../components/AuthToggleTabs";
import Button from "../components/ui/Button";
import {
  signIn,
  type SignInRequest,
  type SignInResponse,
  signUp,
  type SignUpRequest,
} from "../services/authService";
import { type ErrorResponse, type GeneralResponse } from "../types/ApiResponse";
import { type RegisterLoginForm } from "../types/AuthForms";

const RegisterLogin = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isRegister, setIsRegister] = useState<boolean>(false);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const inputStyling =
    "block w-full rounded-lg bg-input-light dark:bg-input-dark border border-border-light/30 dark:border-border-dark text-black dark:text-white placeholder:text-text-muted dark:placeholder:text-text-muted/80 focus:border-primary focus:ring-1 focus:outline-none focus:ring-primary sm:text-sm pl-10 h-12 transition-all";

  const [formData, setFormData] = useState<RegisterLoginForm>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const signUpMutation = useMutation<
    GeneralResponse,
    AxiosError<ErrorResponse>,
    SignUpRequest
  >({
    mutationFn: signUp,
    onSuccess: () => {
      toast.success(t("toastMessages.signUpSuccessful"));
      setIsRegister(false);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error(
          t("toastMessages.signUpFailed", { errorMessage: error.message }),
        );
      }
    },
  });

  const signInMutation = useMutation<
    SignInResponse,
    AxiosError<ErrorResponse>,
    SignInRequest
  >({
    mutationFn: signIn,
    onSuccess: (response) => {
      toast.success(t("toastMessages.signInSuccessful"));
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      navigate("/", { replace: true });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response) {
        const errorMessage: string = error.response.data.message;
        toast.error(errorMessage);
      } else {
        toast.error(
          t("toastMessages.signInFailed", { errorMessage: error.message }),
        );
      }
    },
  });

  const handleFormChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ): void => {
    const fieldName = event.target.name;
    const fieldValue = event.target.value;

    setFormData((prev) => ({
      ...prev,
      [fieldName]: fieldValue,
    }));
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();

    if (signInMutation.isPending) return;

    const data: SignInRequest = {
      email: formData.email,
      password: formData.password,
    };

    signInMutation.mutate(data);
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();

    if (signUpMutation.isPending) return;

    if (formData.password !== formData.confirmPassword) {
      toast.error(t("toastMessages.confirmPasswordMatchingError"));
      return;
    }

    const data: SignUpRequest = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    signUpMutation.mutate(data);
  };

  return (
    <>
      <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-white antialiased min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-light-grid-pattern dark:bg-dark-grid-pattern bg-size-[40px_40px] pointer-events-none opacity-15"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-linear-to-b from-transparent via-transparent to-background-light dark:to-background-dark pointer-events-none"></div>
        <div className="relative z-10 w-full max-w-115 px-4 py-8">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-linear-to-tr from-primary to-blue-400 flex items-center justify-center shadow-lg shadow-primary/30 mb-4">
              <FaDumbbell className="w-7 h-7 rotate-45 text-white dark:text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Gym Tracker</h1>
            <p className="text-text-muted text-sm mt-1">
              {t("registerLoginPageTitle")}
            </p>
          </div>
          <AuthToggleTabs
            isRegister={isRegister}
            setIsRegister={setIsRegister}
          />
          <form
            className="bg-card-light dark:bg-card-dark border dark:border-border-dark border-border-light rounded-2xl rounded-t-none shadow-2xl overflow-hidden"
            onSubmit={isRegister ? handleSignUp : handleSignIn}
          >
            <div className="p-6 pt-8 space-y-5">
              {isRegister && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium">
                    {t("usernameLabel")}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="text-text-muted text-[20px]" />
                    </div>
                    <input
                      className={inputStyling}
                      id="username"
                      name="username"
                      type="text"
                      placeholder={t("usernamePlaceholder")}
                      value={formData.username}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  {t("emailAddressLabel")}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaEnvelope className="text-text-muted text-[20px]" />
                  </div>
                  <input
                    className={inputStyling}
                    id="email"
                    name="email"
                    type="email"
                    placeholder={t("emailAddressPlaceholder")}
                    value={formData.email}
                    onChange={handleFormChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium">
                    {t("passwordLabel")}
                  </label>
                  {!isRegister && (
                    <span className="text-xs cursor-pointer font-medium text-primary hover:text-primary-hover underline decoration-transparent hover:decoration-primary transition-all">
                      {t("forgotPasswordLabel")}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FaLock className="text-text-muted text-[20px]" />
                  </div>
                  <input
                    className={inputStyling}
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder={
                      showPassword ? t("passwordPlaceholder") : "********"
                    }
                    value={formData.password}
                    onChange={handleFormChange}
                    required
                  />
                  <div
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text-muted text-[20px] hover:text-gray-500 dark:hover:text-white cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </div>
                </div>
              </div>

              {isRegister && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="block text-sm font-medium">
                      {t("confirmPasswordLabel")}
                    </label>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="text-text-muted text-[20px]" />
                    </div>
                    <input
                      className={inputStyling}
                      id="confirm-password"
                      name="confirmPassword"
                      type="password"
                      placeholder="********"
                      value={formData.confirmPassword}
                      onChange={handleFormChange}
                      required
                    />
                  </div>
                </div>
              )}
            </div>

            <Button
              btnStyle={"approve"}
              size={"big"}
              additionalStyle="dark:text-white! w-full font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-primary/20 hover:shadow-primary/40 active:scale-[0.98]"
              disabled={signInMutation.isPending || signUpMutation.isPending}
            >
              <span>{isRegister ? t("signUpButton") : t("signInButton")}</span>
              <FaArrowRight className="text-[20px]" />
            </Button>
          </form>
        </div>
      </div>
    </>
  );
};

export default RegisterLogin;
