import { Suspense } from 'react';
import TenantResultsDisplay from '../../components/TenantResultsDisplay';

export default async function TenantResultsPage({
    params
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;
    const tenantName = decodeURIComponent(name);

    return <TenantResultsDisplay tenantName={tenantName} />;
}