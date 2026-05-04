import { useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useTranslation } from "react-i18next";
import {
  FaArrowRight,
  FaCalendar,
  FaDumbbell,
  FaEnvelope,
  FaEye,
  FaEyeSlash,
  FaLock,
  FaMars,
  FaRulerVertical,
  FaUser,
  FaVenus,
  FaWeight,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthToggleTabs from "../components/AuthToggleTabs";
import Button from "../components/ui/Button";
import {
  gymSignUp,
  signIn,
  type SignUpRequest as GymSignUpRequest,
  type SignInRequest,
  type SignInResponse,
} from "../services/gym/authService";
import type { SignUpRequest as HealthSignUpRequest } from "../services/health/authService";
import { healthSignUp } from "../services/health/authService";
import { healthDeleteUser } from "../services/health/userService";
import { type ErrorResponse } from "../types/ApiResponse";
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
    birthDate: "",
    height: "",
    weight: "",
    gender: "MALE",
  });

  const signUpMutation = useMutation({
    mutationFn: async ({
      healthSignUpRequest,
      gymSignUpRequest,
    }: {
      healthSignUpRequest: HealthSignUpRequest;
      gymSignUpRequest: GymSignUpRequest;
    }) => {
        const id = await gymSignUp(gymSignUpRequest);


      try {
        await healthSignUp({
                ...healthSignUpRequest,
                id: id
              });
      } catch (error) {
        try {
          await gymDeleteUser();
        } catch (rollbackError) {
          console.error("Failed to rollback gym signup", rollbackError);
        }
        throw error;
      }
    },
    onSuccess: () => {
      toast.success(t("toastMessages.signUpSuccessful"));
      setIsRegister(false);
    },
    onError: (error: AxiosError<ErrorResponse | string>) => {
      if (error.response) {
        if (typeof error.response.data === "string") {
          toast.error(error.response.data);
        } else {
          toast.error(error.response.data.message);
        }
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
      localStorage.setItem("username", response.username); // TODO store data in a more secure way
      localStorage.setItem("password", formData.password); // TODO store data in a more secure way
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
    } else if (formData.height === "" || formData.weight === "") {
      toast.error(t("toastMessages.heightWeightRequiredError"));
      return;
    }

    const gymSignUpRequest: GymSignUpRequest = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    const healthSignUpRequest: Omit<HealthSignUpRequest, 'id'> = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
      birthDate: formData.birthDate + "T00:00:00Z",
      height: Number(formData.height),
      weight: Number(formData.weight),
      gender: formData.gender,
    };

    signUpMutation.mutate({
      healthSignUpRequest: healthSignUpRequest as HealthSignUpRequest,
      gymSignUpRequest,
    });
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
            <div className="p-6 pt-8 space-y-5 max-h-105 scrollbar hover:scrollbar overflow-y-auto scrollbar-thumb-scrollbar-thumb-light scrollbar-track-scrollbar-track-light dark:scrollbar-thumb-scrollbar-thumb-dark dark:scrollbar-track-scrollbar-track-dark">
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
                <>
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
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      {t("birthDateLabel")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaCalendar className="text-text-muted text-[20px]" />
                      </div>
                      <input
                        className={`${inputStyling} [&::-webkit-calendar-picker-indicator]:hidden`}
                        id="birthdate"
                        name="birthDate"
                        type="date"
                        value={formData.birthDate}
                        onChange={handleFormChange}
                        onClick={(e) => {
                          e.currentTarget.showPicker();
                        }}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      {t("heightLabel")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaRulerVertical className="text-text-muted text-[20px]" />
                      </div>
                      <input
                        className={`${inputStyling} [&::-webkit-inner-spin-button]:hidden`}
                        id="height"
                        name="height"
                        type="number"
                        min={50}
                        max={300}
                        placeholder={"0 cm"}
                        value={formData.height}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      {t("weightLabel")}
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <FaWeight className="text-text-muted text-[20px]" />
                      </div>
                      <input
                        className={`${inputStyling} [&::-webkit-inner-spin-button]:hidden`}
                        id="weight"
                        name="weight"
                        type="number"
                        min={40}
                        max={500}
                        placeholder={"0 kg"}
                        value={formData.weight}
                        onChange={handleFormChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      {t("genderLabel")}
                    </label>
                    <div className="flex gap-4">
                      {["MALE", "FEMALE"].map((gender) => (
                        <label key={gender} className="relative cursor-pointer">
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={handleFormChange}
                            className="peer sr-only"
                          />

                          <div
                            className="flex flex-col items-center justify-center px-3 py-2 rounded-lg border 
                                      bg-input-light dark:bg-input-dark 
                                      border-border-light/30 dark:border-border-dark
                                      text-text-muted transition-all duration-200
                                      hover:border-primary/50
                                      peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary
                                        peer-focus-visible:ring-2 peer-focus-visible:ring-primary"
                          >
                            <span className="text-sm font-medium">
                              {gender == "MALE" ? (
                                <span className="flex items-center gap-1">
                                  <FaMars className="text-xl" /> {t("male")}
                                </span>
                              ) : (
                                <span className="flex items-center gap-1">
                                  <FaVenus className="text-xl" /> {t("female")}
                                </span>
                              )}
                            </span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                </>
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
