import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect } from 'vitest';

import App from '../../App.tsx';


describe("Навигация по страницам", () => {
    it('если /, то отобразить HomePage', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText("Здесь появятся хайлайты")).toBeTruthy()
    });
    it('если /generate, то отобразить GeneratePage', () => {
        render(
            <MemoryRouter initialEntries={['/generate']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText("Сгенерируйте готовый csv-файл нажатием одной кнопки")).toBeTruthy()
    });
    it('если /history, то отобразить HistoryPage', () => {
        render(
            <MemoryRouter initialEntries={['/history']}>
                <App />
            </MemoryRouter>
        );

        expect(screen.getByText("Сгенерировать больше")).toBeTruthy()
    });
})