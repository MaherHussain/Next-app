"use client";
import {useEffect, useState} from "react";
import InputTextField from "../../shared/input-text-fied";
import Button from "../../shared/Button";
import { useCreatePartner } from "@/app/queries/auth";

export default function Register() {
    const initialFormData = {
        partnerName: "",
        restaurantName: "",
        restaurantAddress: "",
        email: "",
        password: "",
    }
     const [formData, setFormData] = useState(initialFormData);
   
    const {mutate: createPartner, isPending} = useCreatePartner();
const registerfields= [
    {
        label: "Partner Name",
        type: "text",
        value: formData.partnerName,
        name: "partnerName",
        placeholder: "Your name",
        isRequired: true,
        inputName: "partnerName",
    },
    {
        label: "Restaurant Name",
        type: "text",
        value: formData.restaurantName,
        name: "restaurantName",
        placeholder: "Your restaurant name",
        isRequired: true,
        inputName: "restaurantName",    
    },
    {
        label: "Restaurant Address",
        type: "text",
        value: formData.restaurantAddress,
        name: "restaurantAddress",
        placeholder: "Your restaurant address",
        isRequired: true,
        inputName: "restaurantAddress",    
    },
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
    
]

const [isDisabled, setIsDisabled] = useState(false);
const [error, setError] = useState<Record<string, string> | null>(null);

const [generalError, setGeneralError] = useState('');
   useEffect(() => {
    const isFormValid =
      !!formData.partnerName &&
      !!formData.restaurantName &&
      !!formData.restaurantAddress &&
      !!formData.email &&
      !!formData.password;
      setIsDisabled(!isFormValid);
   }, [formData,  error])
type FieldName = "partnerName" | "restaurantName" | "restaurantAddress" | "email" | "password";
    const [touched, setTouched] = useState<Record<FieldName, boolean>>({
        partnerName: false,
        restaurantName: false,
        restaurantAddress: false,
        email: false,
        password: false,
    });

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name as FieldName]: true }));
  };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        
        const {name, value} = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
        
        // Clear error for this field when user starts typing
        if (error && error[name]) {
            setError(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return Object.keys(newErrors).length > 0 ? newErrors : null;
            });
        }
    }

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        createPartner(formData, {
            onSuccess: (data) => {
               /*  console.log("Partner created successfully and logged in", data) */;
                // Auto-login successful, redirect to dashboard
                window.location.href = '/partner/dashboard';
            },
            onError: (error) => {
            const response = error.response?.data;
            if (response?.errors) {
                setError(response.errors);
                setGeneralError(''); // clear general error
            } else if (response?.message) {
                setGeneralError(response.message);
                setError({}); // clear field errors
            } else {
                setGeneralError("Something went wrong, please try again later");
                setError({});
            }
            },
        });
    }

  return (
    <form className="flex flex-col gap-4 w-full max-w-md mx-auto" onSubmit={handleSubmit}>
        <h1 className="text-2xl font-bold text-center">Sign up as a partner</h1>
       {generalError && <span className="text-red-500 text-left px-2 py-3 bg-red-100">{generalError}</span>}
        {registerfields.map((field) => {
            return (
        <div key={field.name} className="flex flex-col gap-2 w-full">
            <InputTextField
            type={field.type}
            value={field.value}
            placeholder={field.placeholder}
            label={field.label}
            isRequired
            onChange={handleChange}
            error={touched[field.name as FieldName] ? error?.[field.name] : ""}
            inputName={field.inputName}
            onBlur={handleBlur}
          />
        </div>
            )
        })}
        <Button buttonText="Register" isLoading={isPending} isDisabled={isDisabled || isPending} clickHandler={() => handleSubmit} />
    </form>
  );
}