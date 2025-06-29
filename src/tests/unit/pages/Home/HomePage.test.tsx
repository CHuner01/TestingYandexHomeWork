import { useState } from 'react';

import { AnalysisHighlight } from '@app-types/analysis.ts';
import { Highlights } from '@app-types/common.ts';
import { HomePage } from '@pages/Home';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi, expect, describe, it } from 'vitest';

interface CsvAnalysisParams {
    onData: (data: AnalysisHighlight[]) => void;
    onError: (error: Error) => void;
    onComplete: (highlights?: Highlights) => void;
}

vi.mock('@store/analysisStore', () => {
    return {
        useAnalysisStore: () => {
            const [file, setFile] = useState<File | null>(null);
            const [status, setStatus] = useState<'idle' | 'processing' | 'completed'>('idle');
            const [highlights, setHighlights] = useState([]);
            const [error, setError] = useState<string | null>(null);

            const reset = () => {
                setFile(null);
                setStatus('idle');
                setHighlights([]);
                setError(null);
            };

            return {
                file,
                status,
                highlights,
                error,
                setFile,
                setStatus,
                setHighlights,
                reset,
                setError,
            };
        },
    };
});

global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    body: {
        getReader: () => ({
            read: vi.fn()
                .mockResolvedValueOnce({ done: false, value: new Uint8Array([1]) })
                .mockResolvedValueOnce({ done: true, value: null }),
        }),
    },
});



describe("Страница с анализом файла", () => {
    it("Выбранный CSV файл сохраняется", async () => {
        const user = userEvent.setup();
        render(<HomePage />);

        const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
        const input = screen.getByTestId('file-input') as HTMLInputElement;

        await user.upload(input, file);

        expect(await screen.findByText("test.csv")).toBeTruthy()
    })

    it("показывает сообщение об успехе после успешного запроса", async () => {
        vi.mock('@hooks/use-csv-analysis', () => {
            return {
                useCsvAnalysis: (params: CsvAnalysisParams) => {
                    const { onComplete } = params;
                    return {
                        analyzeCsv: async (_file: File) => {
                            await new Promise((r) => setTimeout(r, 10));
                            onComplete({
                                total_spend_galactic: 1000,
                                rows_affected: 50,
                                less_spent_at: 120,
                                big_spent_at: 200,
                                less_spent_value: 10,
                                big_spent_value: 100,
                                average_spend_galactic: 30,
                                big_spent_civ: 'humans',
                                less_spent_civ: 'humans',
                            });
                        },
                    };
                },
            };
        });
        const user = userEvent.setup();
        render(<HomePage />);

        const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
        const input = screen.getByTestId('file-input') as HTMLInputElement;
        await user.upload(input, file);

        const sendButton = screen.getByTestId("button-send");
        await user.click(sendButton);

        await waitFor(() => {
            expect(screen.findByText("готово")).toBeTruthy();
        }, { timeout: 60000 });
    })

    it("если произошла ошибка при анализе файла, выводит сообщение об ошибке", async () => {
        vi.mock('@hooks/use-csv-analysis', () => {
            return {
                useCsvAnalysis: (params: CsvAnalysisParams) => {
                    const { onError } = params;
                    return {
                        analyzeCsv: async (_file: File) => {
                            await new Promise((r) => setTimeout(r, 10));
                            onError(new Error('Ошибка при анализе файла'));
                        },
                    };
                },
            };
        });

        const user = userEvent.setup();
        render(<HomePage />);

        const file = new File(['a,b\n1,2'], 'test.csv', { type: 'text/csv' });
        const input = screen.getByTestId('file-input') as HTMLInputElement;
        await user.upload(input, file);

        const sendButton = screen.getByTestId("button-send");
        await user.click(sendButton);

        await waitFor(async () => {
            expect(screen.findByText("Неизвестная ошибка парсинга")).toBeTruthy();
        }, { timeout: 60000 });
    })

})

