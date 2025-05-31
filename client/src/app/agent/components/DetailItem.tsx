import { DetailItemProps } from "@/types/sharedTypes";
import { ReactNode } from "react";

function DetailItem({ label, value, icon }: DetailItemProps & { value: ReactNode }) {
    return (
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="text-blue-500 text-2xl mr-4">{icon}</div>
            <div>
                <p className="font-semibold">{label}</p>
                <div className="text-gray-500">
                    {value}
                </div>
            </div>
        </div>
    );
}

export default DetailItem;