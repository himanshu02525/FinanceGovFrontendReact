import React from 'react';

const GenericMetricsCard = ({ data, title = "Metrics Overview", generatedAt }) => {
    const getSafeData = (input) => {
        if (!input) return null;
        if (typeof input === "object") return input;

        let parsed = input;

        for (let i = 0; i < 5; i++) {
            try {
                if (typeof parsed !== "string") return parsed;

                parsed = parsed.trim();

                if (parsed.startsWith('"') && parsed.endsWith('"')) {
                    parsed = parsed.slice(1, -1);
                }

                parsed = parsed.replace(/\\"/g, '"');

                parsed = JSON.parse(parsed);
            } catch (e) {
                break;
            }
        }

        if (typeof parsed === "object") return parsed;

        console.error("Final Parse Failed:", input);
        return { Error: "Invalid report data format" };
    };

    const metricsData = getSafeData(data);
    if (!metricsData) return null;

    const formatLabel = (str) =>
        str.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());

const formatValue = (key, value) => {
        if (typeof value === 'boolean') return value ? "Yes" : "No";
        if (value === null || value === undefined) return "N/A";
        if (typeof value === 'number') {
            return value.toLocaleString();
        }
        return String(value);
    };

    const MetricTile = ({ label, value }) => (
        <div style={{
            padding: '12px 16px',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px solid #e2e8f0',
        }}>
            <span style={{
                display: 'block',
                fontSize: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#64748b',
                fontWeight: '700',
                marginBottom: '4px'
            }}>
                {formatLabel(label)}
            </span>
            <span style={{ fontSize: '1.1rem', fontWeight: '700', color: '#1e293b' }}>
                {formatValue(label, value)}
            </span>
        </div>
    );

    const renderRecursive = (inputData, level = 0) => {
        if (!inputData) return null;

        if (Array.isArray(inputData)) {
            return (
                <div>
                    {inputData.map((item, index) => (
                        <div key={index}>{renderRecursive(item, level + 1)}</div>
                    ))}
                </div>
            );
        }

        if (typeof inputData !== 'object') return null;

        const entries = Object.entries(inputData);
        const flatItems = entries.filter(([_, v]) => typeof v !== 'object' || v === null);
        const nestedItems = entries.filter(([_, v]) => typeof v === 'object' && v !== null);

        return (
            <div style={{ width: '100%' }}>
                {flatItems.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: '10px',
                        marginBottom: '20px'
                    }}>
                        {flatItems.map(([k, v]) => (
                            <MetricTile key={k} label={k} value={v} />
                        ))}
                    </div>
                )}

                {nestedItems.map(([key, value]) => (
                    <div key={key + level} style={{
                        marginTop: '15px',
                        marginBottom: '15px',
                        padding: '10px',
                        backgroundColor: level === 0 ? '#ffffff' : 'transparent',
                        borderRadius: '8px',
                        border: level === 0 ? '1px solid #f1f5f9' : 'none'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{
                                fontSize: level === 0 ? '0.85rem' : '0.75rem',
                                fontWeight: '800',
                                color: level === 0 ? '#2563eb' : '#64748b',
                                textTransform: 'uppercase',
                                marginRight: '10px'
                            }}>
                                {formatLabel(key)}
                            </span>
                            <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
                        </div>

                        <div style={{ paddingLeft: '12px', borderLeft: '2px solid #e2e8f0' }}>
                            {renderRecursive(value, level + 1)}
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #cbd5e1',
            fontFamily: 'system-ui, sans-serif'
        }}>
            <div style={{ marginBottom: '20px', borderBottom: '2px solid #f1f5f9', paddingBottom: '10px' }}>
                <h2 style={{ margin: 0, fontSize: '1.4rem', color: '#0f172a' }}>{title}</h2>
                {generatedAt && <small style={{ color: '#64748b' }}>Ref: {generatedAt}</small>}
            </div>
            {renderRecursive(metricsData)}
        </div>
    );
};

export default GenericMetricsCard;