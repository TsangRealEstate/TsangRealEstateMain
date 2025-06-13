import { useState } from 'react';

type Props = {
    title: string;
    items: string[];
    selectedItems: string[];
    onSave: (selected: string[]) => void;
    onClose: () => void;
};

const MultiSelectModal = ({ title, items, selectedItems, onSave, onClose }: Props) => {
    const [tempSelected, setTempSelected] = useState<string[]>(selectedItems);

    const toggleItem = (item: string) => {
        const wasSelected = tempSelected.includes(item);
        const newSelected = wasSelected
            ? tempSelected.filter(i => i !== item)
            : [...tempSelected, item];

        setTempSelected(newSelected);
    };

    return (
        <div className="fixed inset-0 bg-black/15 bg-opacity-50 flex items-center justify-center z-50">
            <div className={
                title === "Edit Desired Locations"
                    ? "bg-white rounded-lg p-6 w-full max-w-2xl"
                    : "bg-white rounded-lg p-6 w-full max-w-md"
            }>
                <h3 className="text-lg font-semibold mb-4">{title}</h3>
                <div
                    className={
                        title === "Edit Desired Locations"
                            ? "grid grid-cols-1 lg:gap-2 gap-y-3 max-h-60 overflow-y-auto"
                            : "space-y-2 max-h-60 overflow-y-auto"
                    }
                >
                    {items.map((item) => (
                        <div key={item} className="flex items-center">
                            <input
                                type="checkbox"
                                id={`item-${item}`}
                                checked={tempSelected.includes(item)}
                                onChange={() => toggleItem(item)}
                                className="h-4 w-4 text-blue-600 rounded"
                            />
                            <label htmlFor={`item-${item}`} className="ml-2 text-gray-700">
                                {item}
                            </label>
                        </div>
                    ))}
                </div>
                <div className="mt-6 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(tempSelected)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MultiSelectModal;
