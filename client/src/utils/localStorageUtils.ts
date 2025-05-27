
export const getLocalNonNegotiables = (tenantId: string): string[] => {
    const saved = localStorage.getItem(`nonNegotiables_${tenantId}`);
    return saved ? JSON.parse(saved) : [];
};

export const setLocalNonNegotiables = (tenantId: string, items: string[]) => {
    localStorage.setItem(`nonNegotiables_${tenantId}`, JSON.stringify(items));
};


export const getLocalDesiredLocations = (tenantId: string): string[] => {
    const saved = localStorage.getItem(`desiredLocation_${tenantId}`);
    return saved ? JSON.parse(saved) : [];
};

export const setLocalDesiredLocations = (tenantId: string, items: string[]) => {
    localStorage.setItem(`desiredLocation_${tenantId}`, JSON.stringify(items));
};
