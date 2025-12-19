import { useForm } from "react-hook-form";
import { useLogout } from "./useLogout";
import { useNavigate } from "react-router-dom";
import { useSignup } from "./useSignup";
import { useUser } from "./useUser";
import { useEffect } from "react";
import FullPageLoader from "@/components/ui/FullPageLoader";

function Signup() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const { signup, isPending } = useSignup();

  function onSubmit(data) {
    const { email, password } = data;
    signup({ email, password });
  }

  const { isAuthenticated, isLoading } = useUser();

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      navigate("/home", { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading || isAuthenticated) {
    return <FullPageLoader />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 p-4">
      <div className="w-full max-w-md">
        <div className="text-card-foreground relative overflow-hidden border-0 shadow-2xl bg-white/95 backdrop-blur-sm rounded-2xl">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200"></div>

          <div className="p-8 sm:p-10 md:pt-12 md:pb-10 md:px-10">
            <div className="flex flex-col items-center text-center space-y-6 sm:space-y-8">
              <div className="w-full">
                <div className="space-y-4">
                  <button
                    onClick={() => navigate(-1)}
                    type="button"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700 font-medium transition-colors -mb-2"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      className="lucide lucide-arrow-left h-4 w-4"
                    >
                      <path d="m12 19-7-7 7-7"></path>
                      <path d="M19 12H5"></path>
                    </svg>
                    Back to sign in
                  </button>

                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Create your account
                  </h2>

                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-3 sm:space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label
                          for="email"
                          className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-slate-700"
                        >
                          Email
                        </label>
                        <div className="relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="lucide lucide-mail absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400"
                          >
                            <rect
                              width="20"
                              height="16"
                              x="2"
                              y="4"
                              rx="2"
                            ></rect>
                            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                          </svg>
                          <input
                            {...register("email")}
                            type="email"
                            id="email"
                            placeholder="you@example.com"
                            required
                            className="flex w-full border px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 h-10 sm:h-11 bg-slate-50/50 border-slate-200 focus:border-slate-400 focus:ring-slate-400 rounded-xl placeholder:text-slate-400 text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          for="password"
                          className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-slate-700"
                        >
                          Password
                        </label>
                        <div className="relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="lucide lucide-lock absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400"
                          >
                            <rect
                              width="18"
                              height="11"
                              x="3"
                              y="11"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          <input
                            {...register("password", {
                              required: "Password is required",
                            })}
                            type="password"
                            id="password"
                            placeholder="Min. 8 characters"
                            required
                            className="flex w-full border px-3 py-2 ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm pl-10 h-10 sm:h-11 bg-slate-50/50 border-slate-200 focus:border-slate-400 focus:ring-slate-400 rounded-xl placeholder:text-slate-400 text-sm sm:text-base"
                          />
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label
                          for="confirmPassword"
                          className="peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-sm font-medium text-slate-700"
                        >
                          Confirm Password
                        </label>
                        <div className="relative">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            className="lucide lucide-lock absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400"
                          >
                            <rect
                              width="18"
                              height="11"
                              x="3"
                              y="11"
                              rx="2"
                              ry="2"
                            ></rect>
                            <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                          </svg>
                          <input
                            {...register("confirmPassword", {
                              required: "Please confirm your password",
                              validate: (value) =>
                                value === getValues("password") ||
                                "Passwords do not match",
                            })}
                            type="password"
                            placeholder="Re-enter password"
                            className={`flex w-full border px-3 py-2 ... ${
                              errors.confirmPassword
                                ? "border-red-500 focus:ring-red-500"
                                : "border-slate-200"
                            }`}
                          />
                        </div>
                        {errors.confirmPassword && (
                          <p className="text-red-500 text-xs mt-1 font-medium">
                            {errors.confirmPassword.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 px-4 py-2 w-full h-10 sm:h-11 bg-slate-900 hover:bg-slate-800 text-white font-medium shadow-sm rounded-xl transition-all duration-200"
                    >
                      {isPending ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          viewBox="0 0 24 24"
                        >
                          <rect
                            width="6"
                            height="14"
                            x="1"
                            y="4"
                            fill="#D3D3D3"
                          >
                            <animate
                              id="SVG9ovaHbIP"
                              fill="freeze"
                              attributeName="opacity"
                              begin="0;SVGa89dAd4w.end-0.25s"
                              dur="0.75s"
                              values="1;0.2"
                            />
                          </rect>
                          <rect
                            width="6"
                            height="14"
                            x="9"
                            y="4"
                            fill="#D3D3D3"
                            opacity="0.4"
                          >
                            <animate
                              fill="freeze"
                              attributeName="opacity"
                              begin="SVG9ovaHbIP.begin+0.15s"
                              dur="0.75s"
                              values="1;0.2"
                            />
                          </rect>
                          <rect
                            width="6"
                            height="14"
                            x="17"
                            y="4"
                            fill="#D3D3D3"
                            opacity="0.3"
                          >
                            <animate
                              id="SVGa89dAd4w"
                              fill="freeze"
                              attributeName="opacity"
                              begin="SVG9ovaHbIP.begin+0.3s"
                              dur="0.75s"
                              values="1;0.2"
                            />
                          </rect>
                        </svg>
                      ) : (
                        <span>Create account</span>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-slate-400 sm:hidden">
          <p>&nbsp;</p>
        </div>
      </div>
    </div>
  );
}

export default Signup;
