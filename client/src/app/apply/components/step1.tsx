import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

const schema = yup.object().shape({
    email: yup.string().required("email is required").email("Enter valid email"),
    firstName: yup.string().required("First name is required"),
    lastName: yup.string().required("Last name is required"),
    mobileNumber: yup
        .string()
        .required("Mobile number is required")
        .matches(/^\d{9,12}$/, { message: "Please enter valid cell number" }),
    searchType: yup.string().required("Select search type"),
});

type stepProps = {
    callBack: (data: any) => void;
    defaultValues: any;
};

export function StepOne({ callBack, defaultValues }: stepProps) {
    const {
        register,
        formState: { errors, dirtyFields },
        handleSubmit,
        getValues,
        reset,
    } = useForm({
        mode: "onChange",
        reValidateMode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues,
    });

    const { ref: emailRef, ...emailField } = register("email");
    const { ref: firstNameRef, ...firstNameField } = register("firstName");
    const { ref: lastNameRef, ...lastNameField } = register("lastName");
    const { ref: mobileNumberRef, ...mobileNumberField } =
        register("mobileNumber");
    const { ref: searchTypeRef, ...searchTypeField } = register("searchType");

    const SubmitForm = async (data: any) => {
        callBack(data);
        console.log("Data from step-one form", data)
    };

    return (
        <form onSubmit={handleSubmit(SubmitForm)}>
            <div className="space-y-12">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                        Step 1
                    </h2>
                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 text-left">
                        {/* email */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                What is a good email for apartments to send you information?
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                                    <input
                                        id="email"
                                        className={`block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 ${errors?.email ? "ring-rose-600" : ""
                                            } 
                                         ${dirtyFields?.email && errors?.email
                                                ? "ring-rose-600"
                                                : ""
                                            }`}
                                        type="email"
                                        autoComplete="email"
                                        ref={emailRef}
                                        {...emailField}
                                        tabIndex={1}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* name */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="firstName"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                What is your legal first name?
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                                    <input
                                        id="firstName"
                                        className={`block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 ${errors?.firstName ? "ring-rose-600" : ""
                                            } 
                                           ${dirtyFields?.firstName && errors?.firstName
                                                ? "ring-rose-600"
                                                : ""
                                            }`}
                                        type="text"
                                        autoComplete="given-name"
                                        ref={firstNameRef}
                                        {...firstNameField}
                                        tabIndex={2}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* lastName  */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="lastName"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                What is your legal last name?
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                                    <input
                                        id="lastName"
                                        className={`block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 ${errors?.lastName ? "ring-rose-600" : ""
                                            } 
                                           ${dirtyFields?.lastName && errors?.lastName
                                                ? "ring-rose-600"
                                                : ""
                                            }`}
                                        type="text"
                                        autoComplete="family-name"
                                        ref={lastNameRef}
                                        {...lastNameField}
                                        tabIndex={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* mobile */}
                        <div className="sm:col-span-4">
                            <label
                                htmlFor="mobileNumber"
                                className="block text-sm font-medium leading-6 text-gray-900"
                            >
                                What is your cell phone number? (i.e. 2109759800)
                            </label>
                            <div className="mt-2">
                                <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600 sm:max-w-md">
                                    <input
                                        id="mobileNumber"
                                        className={`block w-full rounded-md border-0 px-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 ${errors?.mobileNumber ? "ring-rose-600" : ""
                                            } 
                                         ${dirtyFields?.mobileNumber && errors?.mobileNumber
                                                ? "ring-rose-600"
                                                : ""
                                            }`}
                                        type="tel"
                                        autoComplete="tel"
                                        ref={mobileNumberRef}
                                        {...mobileNumberField}
                                        tabIndex={4}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* type */}
                        <div className="sm:col-span-4">
                            <div className="mt-2">
                                <fieldset>
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                                        What are you looking for?
                                    </legend>
                                    <div
                                        className={`mt-6 space-y-2  ${errors?.searchType
                                            ? "ring-1 ring-inset ring-rose-600"
                                            : ""
                                            } 
                                        ${dirtyFields?.searchType && errors?.searchType
                                                ? "ring-rose-600"
                                                : ""
                                            }`}
                                    >
                                        <div className="flex items-center gap-x-3">
                                            <input
                                                id="rent"
                                                type="radio"
                                                value={`rent`}
                                                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                                                ref={searchTypeRef}
                                                {...searchTypeField}
                                            />
                                            <label
                                                htmlFor="rent"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Rent
                                            </label>
                                        </div>
                                        <div className="flex items-center gap-x-3">
                                            <input
                                                id="purchase"
                                                type="radio"
                                                value={`purchase`}
                                                className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                                                ref={searchTypeRef}
                                                {...searchTypeField}
                                            />
                                            <label
                                                htmlFor="purchase"
                                                className="block text-sm font-medium leading-6 text-gray-900"
                                            >
                                                Purchase
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 flex items-center justify-end gap-x-6">
                <button
                    type="submit"
                    className="rounded-md bg-blue-600 px-6 cursor-pointer py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Next
                </button>
            </div>
        </form>
    );
}