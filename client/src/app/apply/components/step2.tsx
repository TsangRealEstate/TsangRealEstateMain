import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";

const schema = yup.object().shape({
    OtherOnLease: yup.string().required("Select one option"),
    othersOnLeasevalue: yup.string().when("OtherOnLease", {
        is: "yes",
        then: (schema) => schema.required("Value is required"),
    }),
});

const Options = [
    {
        label: "Yes.",
        value: "yes",
    },
    {
        label: "No. I am the only adult that is going to be on the lease.",
        value: "no",
    },
];

type stepProps = {
    callBack: (data: any) => void;
    goBack: () => void;
    defaultValues: any;
};

export function StepTwo({ callBack, goBack, defaultValues }: stepProps) {
    const {
        register,
        formState: { errors, dirtyFields },
        handleSubmit,
        getValues,
        watch,
        reset,
    } = useForm({
        mode: "onChange",
        reValidateMode: "onBlur",
        resolver: yupResolver(schema),
        defaultValues,
    });
    let OtherOnLease = watch("OtherOnLease");

    const { ref: OtherOnLeaseRef, ...OtherOnLeaseField } =
        register("OtherOnLease");
    const { ref: othersOnLeasevalueRef, ...othersOnLeasevalueField } =
        register("othersOnLeasevalue");

    const SubmitForm = async (data: any) => {
        callBack(data);
    };

    return (
        <form onSubmit={handleSubmit(SubmitForm)} className="w-full px-10">
            <div className="space-y-12 w-full">
                <div className="border-b border-gray-900/10 pb-12">
                    <h2 className="text-2xl font-semibold leading-7 text-gray-900">
                        Step 2
                    </h2>

                    <div className="mt-10 text-left">
                        {/* type */}
                        <div className="">
                            <div className="mt-2">
                                <fieldset>
                                    <legend className="text-sm font-semibold leading-6 text-gray-900">
                                        Are there any other adults (people over the 18 years old)
                                        that is going to be on the lease?
                                    </legend>
                                    <div
                                        className={`mt-6 space-y-2  ${errors?.OtherOnLease
                                            ? "ring-1 ring-inset ring-rose-600"
                                            : ""
                                            } 
                                             ${dirtyFields?.OtherOnLease && errors?.OtherOnLease
                                                ? "ring-rose-600"
                                                : ""
                                            }`}
                                    >
                                        {Options.map((item, index) => {
                                            return (
                                                <div
                                                    className="flex items-center gap-x-3"
                                                    key={`fo-${index}`}
                                                >
                                                    <input
                                                        id={item.value}
                                                        type="radio"
                                                        value={item.value}
                                                        className="h-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                                                        ref={OtherOnLeaseRef}
                                                        {...OtherOnLeaseField}
                                                        tabIndex={1}
                                                    />
                                                    <label
                                                        htmlFor={item.value}
                                                        className="block text-sm font-medium leading-6 text-gray-900"
                                                    >
                                                        {item.label}
                                                    </label>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </fieldset>
                            </div>
                        </div>

                        {/* Other Adults */}
                        {OtherOnLease === "yes" && (
                            <div className="mt-10">
                                <label
                                    htmlFor="others-on-lease"
                                    className="block text-sm font-medium leading-6 text-gray-900"
                                >
                                    What are the legal first and last names of the other adults
                                    that will be on the lease? <br />
                                    Please separate the names with a comma (i.e. Alex Tsang,
                                    Andrea Perez, Susan Dover).
                                </label>
                                <div className="mt-2">
                                    <textarea
                                        id="others-on-lease"
                                        rows={3}
                                        className={`block px-3 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${errors?.othersOnLeasevalue ? "ring-rose-600" : ""
                                            } 
                                           ${dirtyFields?.othersOnLeasevalue &&
                                                errors?.othersOnLeasevalue
                                                ? "ring-rose-600"
                                                : ""
                                            }`}
                                        defaultValue={""}
                                        ref={othersOnLeasevalueRef}
                                        {...othersOnLeasevalueField}
                                    />
                                </div>
                            </div>
                        )}
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
                    className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                    Next
                </button>
            </div>
        </form>
    );
}