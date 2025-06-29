
import { HistoryItemType } from '@app-types/history.ts';
import { STORAGE_KEY } from '@utils/consts.ts';
import { getHistory, addToHistory, removeFromHistory, clearHistory } from '@utils/storage.ts';
import { describe, it, expect, vi, beforeEach } from 'vitest';


describe('Работа с Local Storage', () => {
    beforeEach(() => {
        localStorage.clear();
        vi.restoreAllMocks();
    });

    it('получает корректные данные из Local Storage', () => {
        const mockItem: HistoryItemType[] = [
            { id: '1', timestamp: 123, fileName: 'report.csv' },
        ];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(mockItem));

        expect(getHistory()).toEqual(mockItem);
    });

    it('сохраняет данные в Local Storage', () => {
        const newItem = addToHistory({ fileName: 'report.csv' });

        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(stored[0].fileName).toBe('report.csv');
        expect(newItem).toEqual(stored[0]);
    });

    it('удаляет элемент из Local Storage по id', () => {
        const item = addToHistory({ fileName: 'report.csv' });
        removeFromHistory(item.id);

        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
        expect(stored.find((i: HistoryItemType) => i.id === item.id)).toBeUndefined();
    });

    it('очищает Local Storage', () => {
        addToHistory({ fileName: 'ToClear.csv' });
        clearHistory();

        expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    });
});
