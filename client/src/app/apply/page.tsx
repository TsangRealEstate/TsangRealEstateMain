"use client";
import { useState } from "react";
import { StepOne } from "./components/step1";
import { StepTwo } from "./components/step2";
import { StepThree } from "./components/step3";
import axiosInstance from "@/api/axiosInstance";
import { useAuth } from "@/context/AuthContext";


export default function Apply() {
    const [step, setStep] = useState(1);
    const { setLoading } = useAuth();

    type FormDataType = {
        email?: string;
        searchType?: string;
        [key: string]: any;
    };

    const [formData, setFormData] = useState<FormDataType>({});

    const submitFormData = async (email: string, informations: any) => {
        setLoading(true);
        try {
            const payload = {
                ...informations,
                email,
            };

            const response = await axiosInstance.post('/tenants', payload);

            const successMessage = `
            ✅ Success! 
            ${response.data.message}
            
            ${email !== "default@example.com"
                    ? "We've sent a confirmation email to " + email
                    : "No email sent (default account used)"}
            
            Next steps:
            - Our team will review your application
            - You'll receive property matches within 24-48 hours
            - Check your spam folder if you don't see our email
        `;

            alert(successMessage.replace(/\s+/g, ' ').trim())

            setStep(4);
        } catch (error: any) {
            console.error("Error posting data:", error.response?.data || error.message);
            alert(`Failed to submit: ${error.response?.data?.error || error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const firstStepCallBack = (data: any) => {
        setFormData({
            ...formData,
            ...data,
        });
        setStep(2);
    };

    const secondStepCallBack = (data: any) => {
        setFormData((prevState) => ({
            ...prevState,
            ...data,
        }));
        setStep(3);
    };

    const thirdStepCallBack = (data: any) => {
        setFormData((prevState) => ({
            ...prevState,
            ...data,
        }));

        const { email, searchType, ...information } = { ...formData, ...data } as any;
        submitFormData(email, { ...information, searchType });
    };


    return (
        <div className="bg-white px-6 py-24 sm:py-32 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                    Apply now
                </h2>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                    Fill out the form below and we will contact you soon
                </p>
            </div>
            <div className="container mx-auto max-w-xl w-full bg-white flex flex-col items-center mt-10 mb-20 shadow-[5px_10px_20px_1px_rgba(152,152,152,0.15)] text-center rounded-lg border border-blue-50 border-b-4 hover:border-blue-600 py-5">
                {step === 1 && (
                    <StepOne callBack={firstStepCallBack} defaultValues={formData} />
                )}
                {step === 2 && (
                    <StepTwo
                        callBack={secondStepCallBack}
                        goBack={() => {
                            setStep(1);
                        }}
                        defaultValues={formData}
                    />
                )}
                {step === 3 && (
                    <StepThree
                        searchType={formData.searchType}
                        callBack={thirdStepCallBack}
                        goBack={() => {
                            setStep(2);
                        }}
                    />
                )}
                {step === 4 && (
                    <h1>
                        We have received your application, we will contact you soon.
                    </h1>
                )}
            </div>
        </div>
    );
}