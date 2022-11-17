import { render, screen } from "@testing-library/react";
import { MySelect } from "../src/components/select/MySelect";
import userEvent from '@testing-library/user-event';

const cities = [
    { value: '1', name: 'Днепр' },
    { value: '2', name: 'Киев' },
    { value: '3', name: 'Полтава' },
];
const defaultOption = { value: '', name: '' };

const setup = (props) => {
    return render(<MySelect
        onChange={jest.fn()}
        value={defaultOption.value}
        options={cities}
        {...props}
    />);
};

describe("<OrderButton />", () => {
    test('should correctly set default option', () => {
        setup();
        expect(screen.getByRole('option', { name: defaultOption.name }).selected).toBe(true);
    });
    test('should display the correct number of options', () => {
        setup();
        expect(screen.getAllByRole('option').length).toBe(cities.length + 1);
    })
    test('should change option', async () => {
        let city = defaultOption.value;

        const { rerender } = setup({ value: city, onChange: value => city = value });

        await userEvent.selectOptions(
            screen.getByRole('combobox'),
            screen.getByRole('option', { name: cities[1].name }),
        )
        
        rerender(<MySelect
            onChange={value => city = value}
            value={city}
            options={cities}
        />);
        expect(city).toBe(cities[1].value);
        expect((screen.getByRole('option', { name: defaultOption.name })).selected).toBe(false);
        expect((screen.getByRole('option', { name: cities[1].name })).selected).toBe(true);
    })
});