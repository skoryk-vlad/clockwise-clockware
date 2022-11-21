import { render, screen } from "@testing-library/react";
import { formatISO } from "date-fns";
import { ClientOrderForm } from "../src/components/Forms/ClientOrderForm";
import { ORDER_STATUSES, WATCH_SIZES } from "../src/constants";
import userEvent from '@testing-library/user-event';

const cities = [
    { id: 1, name: 'Днепр', price: 120 },
    { id: 2, name: 'Киев', price: 150 },
    { id: 3, name: 'Полтава', price: 100 },
];

const defaultOrder = {
    name: "",
    email: "",
    watchSize: WATCH_SIZES.SMALL,
    cityId: null,
    date: "",
    time: null,
    status: ORDER_STATUSES.AWAITING_PAYMENT,
    images: []
};

const validOrder = {
    name: "Степан",
    email: "stepa123@gmail.com",
    watchSize: WATCH_SIZES.SMALL,
    cityId: cities[0].id,
    date: "2023-01-30",
    time: 10,
    status: ORDER_STATUSES.AWAITING_PAYMENT,
    images: []
};

const setup = (props) => {
    return render(<ClientOrderForm
        order={defaultOrder}
        onClick={jest.fn()}
        cities={cities}
        {...props}
    />);
};

describe("<ClientOrderForm />", () => {
    test("should render component correctly", async () => {
        const { container } = setup();

        expect(container.childNodes[0].childNodes).toHaveLength(8);

        const nameInput = screen.queryByPlaceholderText(/name/);
        expect(nameInput.value).toBe(defaultOrder.name);

        const emailInput = screen.queryByPlaceholderText(/email/);
        expect(emailInput.value).toBe(defaultOrder.email);

        const regexWatchSizes = new RegExp(Object.values(WATCH_SIZES).join('|'));
        const watchSizePickerButtons = screen.queryAllByRole('button', { name: regexWatchSizes });
        expect(watchSizePickerButtons).toHaveLength(Object.values(WATCH_SIZES).length);

        const selectedWatchSizeButton = watchSizePickerButtons.find(btn => btn.textContent.includes(defaultOrder.watchSize));
        expect(selectedWatchSizeButton.classList.contains('active')).toBe(true);

        const select = screen.getByRole('combobox');
        expect(select.childNodes).toHaveLength(cities.length + 1);
        expect((screen.getByRole('option', { name: '' })).selected).toBe(true);

        const dateInput = screen.getByTestId('dateInput');
        expect(dateInput.type).toBe('date');
        expect(dateInput.value).toBe(defaultOrder.date);
        expect(dateInput.min).toBe(formatISO(new Date(), { representation: 'date' }));

        const timePickerButtons = screen.queryAllByRole('button', { name: /1[0-8]/ });
        expect(timePickerButtons).toHaveLength(9);

        const selectedTimeButton = timePickerButtons.find(btn => +btn.textContent === defaultOrder.time);
        expect(selectedTimeButton).toBeUndefined();

        const photoInput = screen.getByTestId('photoInput');
        expect(photoInput.type).toBe('file');
        expect(photoInput.multiple).toBe(true);

        const orderButton = screen.getByRole('button', { name: /order/ });
        expect(orderButton.type).toBe('submit');
        expect(orderButton.disabled).toBe(false);

        const priceText = screen.getByText(/price/);
        expect(+priceText.textContent.split(' ')[1]).toBe(0);
    });
    test("should disable button because fields are empty", async () => {
        const callback = jest.fn();
        setup({ onClick: callback });

        const orderButton = screen.getByRole('button', { name: /order/ });
        expect(orderButton.disabled).toBe(false);
        expect(orderButton.classList.contains('disabledBtn')).toBe(false);

        await userEvent.dblClick(orderButton);
        
        expect(orderButton.disabled).toBe(true);
        expect(orderButton.classList.contains('disabledBtn')).toBe(true);
        expect(callback).toHaveBeenCalledTimes(0);
    });
    test("should submit form when fields are valid", async () => {
        const callback = jest.fn();
        setup({ onClick: callback, order: validOrder });

        const orderButton = screen.getByRole('button', { name: /order/ });

        await userEvent.click(orderButton);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith({ ...validOrder, price: (Object.values(WATCH_SIZES).indexOf(validOrder.watchSize) + 1) * cities.find(city => city.id === validOrder.cityId).price });
    });
    test("should show errors when fields are not valid", async () => {
        setup();

        const nameInput = screen.queryByPlaceholderText(/name/);
        const emailInput = screen.queryByPlaceholderText(/email/);
        const dateInput = screen.queryByTestId('dateInput');

        await userEvent.type(nameInput, validOrder.name);
        await userEvent.type(emailInput, validOrder.email);
        await userEvent.type(dateInput, validOrder.date);

        expect(screen.queryByText('errors.name')).not.toBeInTheDocument();
        expect(screen.queryByText('errors.email')).not.toBeInTheDocument();
        expect(screen.queryByText('errors.cityId')).not.toBeInTheDocument();
        expect(screen.queryByText('errors.date')).not.toBeInTheDocument();
        expect(screen.queryByText('errors.time')).not.toBeInTheDocument();

        const orderButton = screen.queryByRole('button', { name: /order/ });
        await userEvent.dblClick(orderButton);

        expect(screen.queryByText('errors.name')).not.toBeInTheDocument();
        expect(screen.queryByText('errors.email')).not.toBeInTheDocument();
        expect(screen.getByText('errors.cityId')).toBeInTheDocument();
        expect(screen.queryByText('errors.date')).not.toBeInTheDocument();
        expect(screen.getByText('errors.time')).toBeInTheDocument();
        expect(orderButton.disabled).toBe(true);
    });
    test("should show errors when time and watchSize are not valid", async () => {
        setup({ order: validOrder });

        const watchSizeButton = screen.queryByRole('button', { name: new RegExp(WATCH_SIZES.BIG) });
        const timeButton = screen.queryByRole('button', { name: 17 });

        expect(screen.queryAllByText('errors.timeWatchSize')).toHaveLength(0);

        await userEvent.click(watchSizeButton);
        await userEvent.click(timeButton);

        const orderButton = screen.queryByRole('button', { name: /order/ });
        await userEvent.dblClick(orderButton);

        expect(screen.queryAllByText('errors.timeWatchSize')).toHaveLength(2);
    });
    test("should update order price", async () => {
        setup();

        const priceText = screen.getByText(/price/);
        expect(+priceText.textContent.split(' ')[1]).toBe(0);

        const regexWatchSizes = new RegExp(Object.values(WATCH_SIZES).join('|'));
        const watchSizePickerButtons = screen.queryAllByRole('button', { name: regexWatchSizes });

        const selectOptions = screen.queryByRole('combobox');

        await userEvent.selectOptions(selectOptions, screen.queryByRole('option', { name: cities[0].name }))
        expect(+priceText.textContent.split(' ')[1]).toBe(cities[0].price * watchSizePickerButtons[0].dataset.num);

        await userEvent.click(watchSizePickerButtons[1]);
        expect(+priceText.textContent.split(' ')[1]).toBe(cities[0].price * watchSizePickerButtons[1].dataset.num);

        await userEvent.selectOptions(selectOptions, screen.queryByRole('option', { name: cities[1].name }))
        await userEvent.click(watchSizePickerButtons[2]);
        expect(+priceText.textContent.split(' ')[1]).toBe(cities[1].price * watchSizePickerButtons[2].dataset.num);
    });
});