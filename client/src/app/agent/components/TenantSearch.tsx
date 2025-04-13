import React, { useEffect } from "react";
import { FiSearch, FiChevronDown } from "react-icons/fi";
import { AiOutlineUser, AiOutlineMail } from "react-icons/ai";

interface Tenant {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
}

interface TenantSearchProps {
    searchTerm: string;
    onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    filteredTenants: Tenant[];
    onTenantSelect: (tenantId: string) => void;
}

const TenantSearch: React.FC<TenantSearchProps> = ({
    searchTerm,
    onSearchChange,
    filteredTenants,
    onTenantSelect,
}) => {
    const [isDropdownOpen, setIsDropdownOpen] = React.useState(false);
    const inputRef = React.useRef<HTMLInputElement>(null);

    const handleInputFocus = () => {
        if (searchTerm.length > 0 || filteredTenants.length > 0) {
            setIsDropdownOpen(true);
        }
    };

    const handleInputBlur = () => {
        setTimeout(() => {
            setIsDropdownOpen(false);
        }, 200);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onSearchChange(e);
        if (e.target.value.length > 0) {
            setIsDropdownOpen(true);
        } else {
            setIsDropdownOpen(false);
        }
    };

    useEffect(() => {
        if (searchTerm.length > 0 && document.activeElement === inputRef.current) {
            setIsDropdownOpen(true);
        }
    }, [searchTerm]);

    return (
        <div className="justify-between search-func px-8 flex items-center py-8">
            <h1 className="text-3xl font-bold text-gray-800 my-5 text-center">Agent Dashboard</h1>

            <div className="w-[350px] relative">
                <div className="relative">
                    <input
                        ref={inputRef}
                        type="text"
                        placeholder="Find tenant: name, email, or phone..."
                        className="w-full px-4 py-3 pr-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onFocus={handleInputFocus}
                        onBlur={handleInputBlur}
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                        <FiSearch className="text-gray-400" />
                    </div>
                </div>

                {/* Dropdown Results */}
                {isDropdownOpen && filteredTenants.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
                        {filteredTenants.map((tenant) => (
                            <div
                                key={tenant._id}
                                onClick={() => {
                                    onTenantSelect(tenant._id);
                                    setIsDropdownOpen(false);
                                }}
                                className="px-4 py-3 hover:bg-blue-50 cursor-pointer flex items-center border-b border-gray-100 last:border-b-0"
                            >
                                <div className="flex-shrink-0 mr-3 text-blue-500">
                                    <AiOutlineUser size={18} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-gray-900 truncate">
                                        {tenant.firstName} {tenant.lastName}
                                    </p>
                                    <p className="text-sm text-gray-500 truncate flex items-center">
                                        <AiOutlineMail className="mr-1" size={14} />
                                        {tenant.email}
                                    </p>
                                </div>
                                <FiChevronDown className="ml-2 text-gray-400" size={16} />
                            </div>
                        ))}
                    </div>
                )}

                {/* No results message */}
                {isDropdownOpen && searchTerm && filteredTenants.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg p-4 text-center text-gray-500">
                        No tenants found matching "{searchTerm}"
                    </div>
                )}
            </div>
        </div>
    );
};

export default TenantSearch;