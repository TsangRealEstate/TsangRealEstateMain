import React from "react";

interface AgentLoginFormProps {
    password: string;
    loading: boolean;
    error: string | null;
    onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => void;
}

const AgentLoginForm: React.FC<AgentLoginFormProps> = ({
    password,
    loading,
    error,
    onPasswordChange,
    onSubmit,
}) => {
    return (
        <form onSubmit={onSubmit} className="max-w-md text-center my-[8rem] mx-auto bg-white rounded-xl p-8 shadow-md">
            <h2 className="text-2xl font-bold">Agent Portal</h2>
            <p className="text-gray-600 my-5">Enter admin credentials to continue</p>
            <input
                type="password"
                placeholder="Enter admin password"
                value={password}
                onChange={onPasswordChange}
                className="w-full px-4 py-3 border rounded-lg mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
            />
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
                disabled={loading}
            >
                {loading ? (
                    <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Authenticating...
                    </span>
                ) : "Submit"}
            </button>
            {error && <p className="text-red-500 mt-2">{error}</p>}
        </form>
    );
};

export default AgentLoginForm;