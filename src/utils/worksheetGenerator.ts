import { db } from '../services/db';
import { Worksheet } from '../types';

export const aggregateErrors = (kidId: string, daysBack = 7) => {
    const recentErrors = db.getErrors(kidId, daysBack);

    const grouped: Record<string, number> = {};
    recentErrors.forEach(e => {
        grouped[e.error_type] = (grouped[e.error_type] || 0) + 1;
    });

    return Object.entries(grouped)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3);
};

export const generateWorksheet = async (kidId: string): Promise<Worksheet | null> => {
    const kid = db.getKid(kidId);
    if (!kid) return null;

    const errors = aggregateErrors(kidId);

    if (errors.length === 0) {
        return null;
    }

    const worksheet: Worksheet = {
        id: `ws_${Date.now()}`,
        kid_id: kidId,
        period_start: new Date(Date.now() - 7 * 86400000).toISOString(),
        period_end: new Date().toISOString(),
        status: 'generated',
        focus_areas: errors,
        created_at: new Date().toISOString(),
        pdf_url: `worksheet_${kidId}_${Date.now()}.pdf`
    };

    db.addWorksheet(worksheet);
    return worksheet;
};
