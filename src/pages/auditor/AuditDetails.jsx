import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import * as auditApi from "../../api/auditApi";
import { Loader, EmptyState, DisplayOneAudit } from '../../core/registry';

const AuditDetails = () => {
    const { id } = useParams();

    const [audit, setAudit] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    const fetchAudit = useCallback(async (aid) => {
        setLoading(true);
        try {
            const data = await auditApi.getById(aid);
            if (data) {
                console.log(data);
                
                setAudit(data);
                setErrorMsg('');
            } else {
                setErrorMsg('Audit record not found.');
            }
        } catch (err) {
            const apiMsg = err?.response?.data?.message || err?.message || 'Unknown error';
            setErrorMsg(apiMsg);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (id) fetchAudit(id);
    }, [id, fetchAudit]);

    if (loading) return <Loader message="Loading audit record..." />;

    if (!audit) {
        return <EmptyState message={errorMsg || "Record not found"} />;
    }

    return (
        <DisplayOneAudit
            audit={audit}
            onRefresh={() => fetchAudit(id)}
        />
    );
};

export default AuditDetails;