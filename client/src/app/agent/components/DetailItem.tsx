interface DetailItemProps {
    label: string;
    value: string | number;
    icon: React.ReactNode;
}

function DetailItem({ label, value, icon }: DetailItemProps) {
    return (
        <div className="flex items-center p-4 bg-gray-50 rounded-lg shadow-sm">
            <div className="text-blue-500 text-2xl mr-4">{icon}</div>
            <div>
                <p className="font-semibold">{label}</p>
                <p className="text-gray-500">{value}</p>
            </div>
        </div>
    );
}

export default DetailItem