
import { GeneratePage } from '@pages/Generate'
import { render, screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';



describe("Страница с генерацией файла", () => {
    beforeEach(() => {
        vi.restoreAllMocks();
    });

    it('показывает сообщение об успехе после успешного запроса', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            headers: {
                get: () => 'attachment; filename="report.csv"',
            },
            blob: async () => new Blob(['data']),
        }));

        Object.defineProperty(window.URL, 'createObjectURL', {
            writable: true,
            value: vi.fn(() => 'mock-url'),
        });

        Object.defineProperty(window.URL, 'revokeObjectURL', {
            writable: true,
            value: vi.fn(),
        });

        render(<GeneratePage />);
        HTMLAnchorElement.prototype.click = vi.fn();

        const button = screen.getByTestId('generate-button');
        await userEvent.click(button);

        const successMessage = await screen.findByText('Отчёт успешно сгенерирован!');
        expect(successMessage).toBeTruthy()
    });


    it("если произошла ошибка при генерации файла, выводит сообщение об ошибке", async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            json: async () => ({ error: 'Ошибка сервера' }),
        }));

        render(<GeneratePage />);

        const button = screen.getByTestId('generate-button');
        await userEvent.click(button);

        const errorMessage = await screen.findByText("Произошла ошибка: Ошибка сервера");
        expect(errorMessage).toBeTruthy()
    })
})