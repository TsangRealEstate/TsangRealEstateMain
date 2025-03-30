import { useState } from "react";
type Options = Record<string, string> & {
    input?: boolean;
};
type OptionsProps = {
    field: {
        name: string;
        labelText: string;
        inputType: string;
        options: Options[];
    } & any;
    formState: any;
};
export function OptionInput(props: OptionsProps) {
    const { name, labelText, inputType, options } = props.field;
    const {
        register,
        formState: { errors, dirtyFields },
        setValue,
        getValues,
    } = props.formState;

    const initialState = {};
    options
        .filter((f: any) => !!f.input)
        .forEach(({ value }: any) => {
            Object.assign(initialState, {
                [value]: {
                    selected: false,
                    value: "",
                },
            });
        });
    const [inputs, setInputs] = useState<any>(initialState);

    return (
        <div className="mt-4">
            <fieldset>
                <legend className="text-sm font-semibold leading-6">{labelText}</legend>
                <div
                    className={`mt-2 space-y-2 ring-1 ring-inset px-4 py-2 ${errors?.[name] ? "ring-rose-600" : "ring-transparent"
                        } 
                  ${dirtyFields?.[name] && errors?.[name] ? "ring-rose-600" : ""
                        }`}
                >
                    {options.map(
                        ({ value, label, input }: Options, optionsIndex: number) => {
                            const inputProps = {};
                            if (input) {
                                if (inputType === "radio") {
                                    Object.assign(inputProps, {
                                        checked: inputs[value]?.selected,
                                    });
                                }
                                if (inputType === "checkbox") {
                                   
                                }
                            }
                            return (
                                <div
                                    className="flex items-center gap-x-3"
                                    key={`fo-${optionsIndex}`}
                                >
                                    <input
                                        id={`${name}-${value}`}
                                        type={inputType}
                                        value={input ? inputs[value]?.value : value}
                                        className="h-4 px-4 w-4 border-gray-300 text-blue-600 focus:ring-blue-600"
                                        {...register(name, { required: true })}
                                        onClick={() => {
                                            if (input) {
                                                if (inputType === "radio") {
                                                    setInputs((prev: any) => {
                                                        return {
                                                            ...prev,
                                                            [value]: {
                                                                selected: true,
                                                                value: "",
                                                            },
                                                        };
                                                    });
                                                } else if (inputType === "checkbox") {

                                                }
                                            } else {
                                                if (inputType === "radio") {
                                                    setInputs(initialState);
                                                }
                                            }
                                        }}
                                        {...inputProps}
                                    />
                                    <label
                                        htmlFor={`${name}-${value}`}
                                        className={`block text-sm font-medium leading-6 ${input ? "" : "w-full"
                                            }`}
                                    >
                                        {label}
                                    </label>
                                    {input && (
                                        <input
                                            id={value}
                                            type="text"
                                            value={inputs[value]?.value || ""}
                                            onChange={(e) => {
                                                setInputs((prev: any) => {
                                                    return {
                                                        ...prev,
                                                        [value]: {
                                                            selected: true,
                                                            value: e.target.value || "",
                                                        },
                                                    };
                                                });
                                                // get value,
                                                if (inputType === "checkbox") {
                                                   
                                                } else {
                                                    setValue(name, e.target.value);
                                                }
                                            }}
                                            className={`w-full border-transparent focus:ring-0 border-b-gray-300 border-2 text-blue-600 ring-0 focus:border-transparent focus:border-b-blue-500 ${inputs[value]?.selected && errors?.[name]
                                                    ? "border-b-red-500"
                                                    : ""
                                                }`}
                                        />
                                    )}
                                </div>
                            );
                        }
                    )}
                </div>
            </fieldset>
        </div>
    );
}