export const formatAvailabilityDate = (dateString: string): string => {
    const availableDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    availableDate.setHours(0, 0, 0, 0);

    return availableDate <= today
        ? "Now"
        : availableDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
};