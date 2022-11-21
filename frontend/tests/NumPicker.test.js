import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { NumPicker } from "../src/components/NumPicker/NumPicker";
import { WATCH_SIZES } from "../src/constants";

const defaultWatchSize = Object.values(WATCH_SIZES)[0];
const defaultTime = 10;

describe("<NumPicker />", () => {
    test("should render component for picking watchSize", () => {
        render(<NumPicker
            from='1' to='3' values={Object.values(WATCH_SIZES)}
            onClick={jest.fn()}
            value={Object.values(WATCH_SIZES).indexOf(defaultWatchSize) + 1}
        />);

        const watchSizePickerButtons = screen.getAllByRole('button');

        expect(watchSizePickerButtons).toHaveLength(Object.values(WATCH_SIZES).length);

        watchSizePickerButtons.forEach((btn, index) => {
            expect(btn.textContent).toBe(Object.values(WATCH_SIZES)[index]);
        });

        const selectedWatchSizeButton = watchSizePickerButtons.find(btn => defaultWatchSize === btn.textContent);
        expect(selectedWatchSizeButton.classList.contains('active')).toBe(true);

        watchSizePickerButtons.filter(btn => !(defaultWatchSize === btn.textContent)).forEach(btn => {
            expect(btn.classList.contains('active')).toBe(false);
        });
    });
    test("should change watchSize by click", async () => {
        let watchSize = defaultWatchSize;

        render(<NumPicker
            from='1' to='3' values={Object.values(WATCH_SIZES)}
            onClick={(event) => watchSize = Object.values(WATCH_SIZES)[+event.target.dataset.num - 1]}
            value={Object.values(WATCH_SIZES).indexOf(watchSize) + 1}
        />);

        const watchSizePickerButtons = screen.getAllByRole('button');

        expect(watchSizePickerButtons[0].classList.contains('active')).toBe(true);

        await userEvent.click(watchSizePickerButtons[1]);

        expect(watchSize).toBe(watchSizePickerButtons[1].textContent);
        expect(watchSizePickerButtons[1].classList.contains('active')).toBe(true);
        watchSizePickerButtons.filter(btn => btn.textContent !== watchSize).forEach(btn => {
            expect(btn.classList.contains('active')).toBe(false);
        });

        await userEvent.click(watchSizePickerButtons[2]);

        expect(watchSize).toBe(watchSizePickerButtons[2].textContent);
        expect(watchSizePickerButtons[2].classList.contains('active')).toBe(true);
        watchSizePickerButtons.filter(btn => btn.textContent !== watchSize).forEach(btn => {
            expect(btn.classList.contains('active')).toBe(false);
        });
    });
    test("should render component for picking time", () => {
        render(<NumPicker
            from='10' to='18' min={0}
            count={Object.values(WATCH_SIZES).indexOf(defaultWatchSize) + 1}
            onClick={jest.fn()}
            value={defaultTime}
        />);

        const timePickerButtons = screen.getAllByRole('button');

        expect(timePickerButtons).toHaveLength(9);

        timePickerButtons.forEach((btn, index) => {
            expect(btn.textContent).toBe(`${10 + index}`);
        });

        const selectedTimeButton = timePickerButtons.find(btn => defaultTime === +btn.textContent);
        expect(selectedTimeButton.classList.contains('active')).toBe(true);

        timePickerButtons.filter(btn => defaultTime !== +btn.textContent).forEach(btn => {
            expect(btn.classList.contains('active')).toBe(false);
        });
    });
    test("should change time by click", async () => {
        let time = defaultTime;

        render(<NumPicker
            from='10' to='18' min={0}
            count={Object.values(WATCH_SIZES).indexOf(defaultWatchSize) + 1}
            onClick={(event) => time = +event.target.dataset.num}
            value={time}
        />);

        const timePickerButtons = screen.getAllByRole('button');

        expect(timePickerButtons[0].classList.contains('active')).toBe(true);

        await userEvent.click(timePickerButtons[3]);

        expect(time).toBe(+timePickerButtons[3].textContent);
        expect(timePickerButtons[3].classList.contains('active')).toBe(true);
        timePickerButtons.filter(btn => btn.textContent !== `${time}`).forEach(btn => {
            expect(btn.classList.contains('active')).toBe(false);
        });
    });
    test("should change time by click with another watchSize", async () => {
        let time = defaultTime;
        const watchSize = Object.values(WATCH_SIZES)[2];
        const count = Object.values(WATCH_SIZES).indexOf(watchSize) + 1;

        render(<NumPicker
            from='10' to='18' min={0}
            count={count}
            onClick={(event) => time = +event.target.dataset.num}
            value={time}
        />);
        
        const timePickerButtons = screen.getAllByRole('button');

        timePickerButtons.filter(btn => +btn.textContent >= time && +btn.textContent < time + count).forEach(btn => {
            expect(btn.classList.contains('active')).toBe(true);
        });

        await userEvent.click(timePickerButtons[3]);

        expect(time).toBe(+timePickerButtons[3].textContent);
        timePickerButtons.filter(btn => +btn.textContent >= time && +btn.textContent < time + count).forEach(btn => {
            expect(btn.classList.contains('active')).toBe(true);
        });
        timePickerButtons.filter(btn => !(+btn.textContent >= time && +btn.textContent < time + count)).forEach(btn => {
            expect(btn.classList.contains('active')).toBe(false);
        });
    });
    test("should not change time by click due to min time limit", async () => {
        let time = 14;
        const min = 12;
        const count = Object.values(WATCH_SIZES).indexOf(defaultWatchSize) + 1;

        render(<NumPicker
            from='10' to='18' min={min}
            count={count}
            onClick={(event) => time = +event.target.dataset.num}
            value={time}
        />);
        
        const timePickerButtons = screen.getAllByRole('button');

        expect(timePickerButtons[4].classList.contains('active')).toBe(true);
        expect(timePickerButtons[4].disabled).toBe(false);

        expect(timePickerButtons[0].disabled).toBe(true);
        expect(timePickerButtons[0].classList.contains('disabled')).toBe(true);
        await userEvent.click(timePickerButtons[0]);

        expect(time).toBe(+timePickerButtons[4].textContent);
    });
});