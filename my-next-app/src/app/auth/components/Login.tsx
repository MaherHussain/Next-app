"use client";
import { useEffect, useState } from "react";
import InputTextField from "@/app/components/shared/input-text-fied";
import Button from "@/app/components/shared/Button";
import { useLoginPartner } from "@/app/queries/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Login() {
  const initialFormData = {
    email: "",
    password: "",
  };
  const {push} = useRouter()
  const [formData, setFormData] = useState(initialFormData);

  const { mutate: login, isPending } = useLoginPartner();

  const loginFields = [
    {
      label: "Email",
      type: "email",
      value: formData.email,
      name: "email",
      placeholder: "Your email",
      isRequired: true,
      inputName: "email",
    },
    {
      label: "Password",
      type: "password",
      value: formData.password,
      name: "password",
      placeholder: "Your password",
      isRequired: true,
      inputName: "password",
    },
  ];

  const [isDisabled, setIsDisabled] = useState(false);
  const [error, setError] = useState<Record<string, string> | null>(null);
  const [generalError, setGeneralError] = useState("");

  type FieldName = "email" | "password";
  const [touched, setTouched] = useState<Record<FieldName, boolean>>({
    email: false,
    password: false,
  });

  useEffect(() => {
    const isFormValid = !!formData.email && !!formData.password;
    setIsDisabled(!isFormValid);
  }, [formData, error]);

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name as FieldName]: true }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field when user starts typing
    if (error && error[name]) {
      setError((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return Object.keys(newErrors).length > 0 ? newErrors : null;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData, {
      onSuccess: (data: any) => {
        push("/partner/dashboard/overview");

        setFormData(initialFormData);
      },
      onError: (error: any) => {
        const response = error.response?.data;
        if (response?.errors) {
          setError(response.errors);
          setGeneralError(""); // clear general error
        } else if (response?.message) {
          setGeneralError(response.message);
          setError({}); // clear field errors
        } else {
          setGeneralError("Something went wrong, please try again later");
          setError({});
        }
      },
    });
  };

  return (
    <form
      className="flex flex-col gap-4 w-full max-w-md mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-2xl font-bold text-center">Login</h1>
      {generalError && (
        <span className="text-red-500 text-left px-2 py-3 bg-red-100">
          {generalError}
        </span>
      )}
      {loginFields.map((field) => {
        return (
          <div key={field.name} className="flex flex-col gap-2 w-full">
            <InputTextField
              type={field.type}
              value={field.value}
              placeholder={field.placeholder}
              label={field.label}
              isRequired
              onChange={handleChange}
              error={
                touched[field.name as FieldName] ? error?.[field.name] : ""
              }
              inputName={field.inputName}
              onBlur={handleBlur}
            />
          </div>
        );
      })}
      <div className="text-left">
        {" "}
        <p>
          Don't have partner account?{" "}
          <span className="text-orange-500 hover:text-orange-700">
            <Link href="/auth/partner/register">Register</Link>
          </span>
        </p>
      </div>
      <Button
        buttonText="Login"
        isLoading={isPending}
        isDisabled={isDisabled || isPending}
        clickHandler={() => handleSubmit}
      />
    </form>
  );
} 