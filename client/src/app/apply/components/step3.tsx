import * as yup from "yup";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextInput } from "./TextInput";
import { OptionInput } from "./Options";
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";

const schema = yup.object().shape({
    instagram: yup.string().required("Instagram value is not valid"),
    leaseEndDate: yup.string().required("Select lease end date"),
    leaseStartDate: yup.string().required("Select lease start date"),
    propertyOwnerName: yup.string().required("property owner name is not valid"),
    bedrooms: yup.string().required("bedrooms is not valid"),
    bathrooms: yup.string().required("bathrooms is not valid"),
    desiredLocation: yup.array().min(1, "select at least one options"),
    budget: yup.string().required("budget is not valid"),
    brokenLease: yup.array().min(1, "select at least one options"),
    grossIncome: yup.string().required("grossIncome value is not valid"),
    creditScore: yup.string().required("creditScore is not valid"),
    nonNegotiables: yup
        .array()
        .of(yup.string().required("value is required"))
        .min(1, "select at least one options"),
});

type stepProps = {
    callBack: (data: any) => void;
    goBack: () => void;
};

const inputContainerClass =
    "flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md";

const formFields = {
    instagram: {
        name: "instagram",
        labelText:
            "What is your Instagram? This is used to send videos and quotes.",
        inputContainerClass,
        registerOptions: { required: true },
    },
    propertyOwnerName: {
        name: "propertyOwnerName",
        labelText:
            'What is the full name of the property you currently have a lease at? If you are renting from a private owner, then please list "private owner".',
        inputContainerClass,
        registerOptions: { required: true },
    },
    bedrooms: {
        name: "bedrooms",
        labelText: "How many bedrooms is your household looking for?",
        inputType: "radio",
        options: [
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5+", label: "5+" },
        ],
    },
    bathrooms: {
        name: "bathrooms",
        labelText: "How many bathrooms is your household looking for?",
        inputType: "radio",
        options: [
            { value: "1", label: "1" },
            { value: "2", label: "2" },
            { value: "3", label: "3" },
            { value: "4", label: "4" },
            { value: "5+", label: "5+" },
        ],
    },
    desiredLocation: {
        name: "desiredLocation",
        labelText: "What part(s) of San Antonio are you looking to move to?",
        inputType: "checkbox",
        options: [
            {
                value: "Dominion/Rim/La Cantera/UTSA",
                label: "Dominion/Rim/La Cantera/UTSA",
            },
            { value: "Boerne", label: "Boerne" },
            { value: "Stone Oak", label: "Stone Oak" },
            {
                value: "North Central/Castle Hills",
                label: "North Central/Castle Hills",
            },
            { value: "Medical Center", label: "Medical Center" },
            {
                value: "Alamo Ranch/Westover Hills",
                label: "Alamo Ranch/Westover Hills",
            },
            { value: "Downtown", label: "Downtown" },
            { value: "Alamo Heights", label: "Alamo Heights" },
            {
                value: "Thousand Oaks/Far Northeast/Live Oak/Schertz/Converse",
                label: "Thousand Oaks/Far Northeast/Live Oak/Schertz/Converse",
            },
            {
                value: "Southeast/South Central/Brooks City Base",
                label: "Southeast/South Central/Brooks City Base",
            },
            { value: "New Braunfels", label: "New Braunfels" },
            {
                value: "I am unsure. I am new to San Antonio.",
                label: "I am unsure. I am new to San Antonio.",
            },
        ],
    },
    budget: {
        name: "budget",
        labelText: "What is your budget for rent (not including residential fees)?",
        inputType: "radio",
        options: [
            { value: "Below $1200", label: "Below $1200" },
            {
                value:
                    "$1200 - $1300 (average pricing of one-bedrooms as of July 2023)",
                label:
                    "$1200 - $1300 (average pricing of one-bedrooms as of July 2023)",
            },
            { value: "$1400 - $1500", label: "$1400 - $1500" },
            {
                value: "$1500 - $1600 (average pricing of two-bedrooms as of Jan 2023)",
                label: "$1500 - $1600 (average pricing of two-bedrooms as of Jan 2023)",
            },
            { value: "$1600 - $1700", label: "$1600 - $1700" },
            { value: "$1700 - $1800", label: "$1700 - $1800" },
            {
                value:
                    "$1800 - $1900 (average pricing of three-bedrooms as of July 2023)",
                label:
                    "$1800 - $1900 (average pricing of three-bedrooms as of July 2023)",
            },
            { value: "$1900+", label: "$1900+" },
            { value: "inp1", label: "Other", input: true },
        ],
    },
    brokenLease: {
        name: "brokenLease",
        labelText:
            "Does anybody that is going to be on the lease (including co-signer/guarantor) have any broken leases, evictions, or criminal history?",
        inputType: "checkbox",
        options: [
            {
                value: "Broken lease/Owe money to a property",
                label: "Broken lease/Owe money to a property",
            },
            {
                value: "Owe a property money",
                label: "Owe a property money",
            },
            {
                value: "Eviction",
                label: "Eviction",
            },
            {
                value: "Felony",
                label: "Felony",
            },
            {
                value: "Misdemeanor",
                label: "Misdemeanor",
            },
            {
                value: "None",
                label: "None",
            },
        ],
    },
    grossIncome: {
        name: "grossIncome",
        labelText:
            "What is the whole household's (all adults being added on the lease) monthly gross income (includes all job income, child support, monthly benefits, all other income provable via direct deposits/paystubs)? Reason: San Antonio properties require an income requirement for approved applications.",
        inputContainerClass,
        registerOptions: { required: true },
    },
    creditScore: {
        name: "creditScore",
        labelText: "Where is your current credit score ranging from?",
        inputType: "radio",
        options: [
            { value: "Below 550", label: "Below 550" },
            { value: "550 - 600", label: "550 - 600" },
            { value: "600 - 650", label: "600 - 650" },
            { value: "650+", label: "650+" },
        ],
    },
    nonNegotiables: {
        name: "nonNegotiables",
        labelText: "What are your non-negotiables? (check applicable)",
        inputType: "checkbox",
        options: [
            {
                value: "1st floor",
                label: "1st floor",
            },
            {
                value: "2nd floor",
                label: "2nd floor",
            },
            {
                value: "3rd floor or top floor",
                label: "3rd floor or top floor",
            },
            {
                value: "Washer/dryer connections",
                label: "Washer/dryer connections",
            },
            {
                value: "Washer/dryer included",
                label: "Washer/dryer included",
            },
            {
                value: "Patio/Balcony",
                label: "Patio/Balcony",
            },
            {
                value: "No carpet in living room",
                label: "No carpet in living room",
            },
            {
                value: "Yard",
                label: "Yard",
            },
            { value: "inp2", label: "Other", input: true },
        ],
    },
};

export function StepThree({ callBack, goBack }: stepProps) {
    const { loading } = useAuth()
    const [isConsentChecked, setIsConsentChecked] = useState(false);

    const formState = useForm({
        mode: "onChange",
        reValidateMode: "onBlur",
        resolver: yupResolver(schema),
    });
    const {
        formState: { errors, dirtyFields },
        handleSubmit,
        control,
    } = formState;


    const SubmitForm = async (data: any) => {
        if (!isConsentChecked) {
            return;
        }
        callBack(data);
    };

    const handleConsentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsConsentChecked(e.target.checked);
    };

    return (
        <form onSubmit={handleSubmit(SubmitForm)} className="w-full px-10">
            <div className="space-y-12 w-full">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Step 3
                    </h2>

                    <div className="mt-10 text-left">
                        {/* instagram */}
                        <TextInput formState={formState} field={formFields.instagram} />

                        {/* leaseStartDate */}
                        <div className="mt-4">
                            <label
                                htmlFor="leaseStartDate"
                                className="text-sm font-semibold leading-6 text-gray-900"
                            >
                                What is the ideal lease start date?
                            </label>
                            <div className={inputContainerClass}>
                                <Controller
                                    control={control}
                                    name="leaseStartDate"
                                    rules={{ required: true }}
                                    render={({ field, fieldState: { invalid, error } }) => {
                                        // Convert Date object to YYYY-MM-DD format for input
                                        const value = field.value ? new Date(field.value).toISOString().split('T')[0] : '';

                                        return (
                                            <input
                                                type="date"
                                                id="leaseStartDate"
                                                min={new Date().toISOString().split('T')[0]} // Set min date to today
                                                className={`w-full px-3 py-1 rounded-md focus:ring-0 font-normal border-gray-300 ${error && !field.value ? "border-red-500" : ""
                                                    }`}
                                                value={value}
                                                onChange={(e) => {
                                                    // Convert back to Date object when value changes
                                                    field.onChange(e.target.value ? new Date(e.target.value) : null);
                                                }}
                                            />
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        {/* leaseEndDate */}
                        <div className="mt-4">
                            <label
                                htmlFor="leaseEndDate"
                                className="text-sm font-semibold leading-6 text-gray-900"
                            >
                                When does your current lease end?
                            </label>
                            <div className={inputContainerClass}>
                                <Controller
                                    control={control}
                                    name="leaseEndDate"
                                    rules={{ required: true }}
                                    render={({ field, fieldState: { invalid, error } }) => {
                                        const value = field.value ? new Date(field.value).toISOString().split('T')[0] : '';

                                        return (
                                            <input
                                                type="date"
                                                id="leaseEndDate"
                                                min={new Date().toISOString().split('T')[0]}
                                                className={`w-full px-3 py-1 rounded-md focus:ring-0 font-normal border-gray-300 ${error && !field.value ? "border-red-500" : ""
                                                    }`}
                                                value={value}
                                                onChange={(e) => {
                                                    field.onChange(e.target.value ? new Date(e.target.value) : null);
                                                }}
                                            />
                                        );
                                    }}
                                />
                            </div>
                        </div>

                        {/* propertyOwnername  */}
                        <TextInput
                            formState={formState}
                            field={formFields.propertyOwnerName}
                        />

                        {/* bedrooms */}
                        <OptionInput formState={formState} field={formFields.bedrooms} />

                        {/* bathrooms */}
                        <OptionInput formState={formState} field={formFields.bathrooms} />

                        {/* desiredLocation */}
                        <OptionInput
                            formState={formState}
                            field={formFields.desiredLocation}
                        />

                        {/* budget */}
                        <OptionInput formState={formState} field={formFields.budget} />

                        {/* brokenLease */}
                        <OptionInput formState={formState} field={formFields.brokenLease} />

                        {/* grossIncome */}
                        <TextInput formState={formState} field={formFields.grossIncome} />

                        {/* creditScore */}
                        <OptionInput formState={formState} field={formFields.creditScore} />

                        {/* nonNegotiables */}
                        <OptionInput
                            formState={formState}
                            field={formFields.nonNegotiables}
                        />

                        <div className="mt-4">
                            <label className="flex items-start space-x-2">
                                <input
                                    type="checkbox"
                                    checked={isConsentChecked}
                                    onChange={handleConsentChange}
                                    className="mt-1"
                                />
                                <span className="text-sm font-bold text-gray-700">
                                    By clicking “Submit” below, I am providing my ESIGN signature and express written consent to receive phone calls, text messages, and emails from Tsang Real Estate Corporation (“Tsang Real Estate”) and its affiliates, including via automated technology, SMS/MMS messages, AI generated voice, and prerecorded and/or artificial voice messages. I acknowledge my consent is required to obtain any goods or services. To opt out from texts, I can reply, ‘out’ at any time. To opt out from emails, I can click on the ‘unsubscribe’ link in the emails. Message and data rates may apply.
                                </span>
                            </label>
                        </div>

                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="button"
                    onClick={goBack}
                    className="text-sm font-semibold leading-6 text-gray-900"
                >
                    Back
                </button>
                <button
                    type="submit"
                    disabled={!isConsentChecked || loading}
                    className={`rounded-md px-3 py-2 text-sm font-semibold shadow-sm focus-visible:outline focus-visible:outline-offset-2 ${isConsentChecked || loading
                        ? 'bg-blue-600 text-white hover:bg-blue-500 focus-visible:outline-blue-600'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    {loading ? 'Submiting...' : 'Submit'}
                </button>
            </div>
        </form>
    );
}