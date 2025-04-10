
type TextInputProps = {
    field: {
        name: string;
        labelText: string;
        containerClass?: string;
        labelClass?: string;
        inputContainerClass?: string;
        registerOptions?: any;
    } & any;
    formState: any;
};
export function TextInput(props: TextInputProps) {
    const {
        name,
        labelText,
        containerClass = "mt-4",
        labelClass = "block text-sm font-semibold leading-6 mb-3",
        inputContainerClass = "mt-2 font-medium flex rounded-md shadow-sm  ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-blue-600",
        registerOptions = {},
    } = props.field;

    const {
        register,
        formState: { errors, dirtyFields },
    } = props.formState;

    return (
        <div className={containerClass}>
            <label htmlFor={name} className={labelClass}>
                {(labelText)}
            </label>

            <div className={inputContainerClass}>
                <input
                    id={name}
                    className={`block px-3 font-semibold leading-6 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 ${errors?.[name] ? "ring-rose-600" : ""
                        } 
                      ${dirtyFields?.[name] && errors?.[name]
                            ? "ring-rose-600"
                            : ""
                        }`}
                    type="text"
                    {...register(name, registerOptions)}
                />
            </div>
        </div>
    );
}