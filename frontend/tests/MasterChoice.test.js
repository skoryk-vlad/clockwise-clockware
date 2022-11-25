import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event';
import { MasterChoice } from "../src/components/MasterChoice/MasterChoice";

const freeMasters = [
    { id: 1, name: 'Борис' },
    { id: 2, name: 'Евгений' },
    { id: 3, name: 'Владимир' },
    { id: 4, name: 'Максим' },
];
const price = 100;

const setup = (props) => {
    const returnForm = jest.fn();
    const addOrder = jest.fn();
    const utils = render(<MasterChoice
        freeMasters={freeMasters}
        returnForm={returnForm}
        price={price}
        addOrder={addOrder}
        {...props}
    />);
    return {
        returnForm,
        addOrder,
        ...utils
    };
};

describe("<MasterChoice />", () => {
    test("should render component correctly", () => {
        setup();

        expect(screen.getByAltText(/returnFormAltText/)).toBeInTheDocument();
        expect(screen.queryByText('noMasters')).not.toBeInTheDocument();

        const masterChooseButtons = screen.getAllByRole('button', { name: /masterChoose/ });
        expect(masterChooseButtons).toHaveLength(freeMasters.length);

        const orderButton = screen.getByRole('button', { name: /submit/ });
        expect(orderButton.type).toBe('submit');
        expect(orderButton.disabled).toBe(true);

        const priceText = screen.getByText(/price/);
        expect(+priceText.textContent.split(' ')[1]).toBe(price);
    });
    test("should show message when there are 0 masters", () => {
        setup({ freeMasters: [] });

        expect(screen.getByText(/noMasters/)).toBeInTheDocument();
    });
    test("should return to form when button clicked", async () => {
        const { returnForm } = setup();

        const returnButton = screen.getByAltText(/returnFormAltText/);
        await userEvent.click(returnButton);
        
        expect(returnForm).toHaveBeenCalled();
    });
    test("should submit form only when master choosen", async () => {
        const { addOrder } = setup();

        const orderButton = screen.getByRole('button', { name: /submit/ });
        expect(orderButton.type).toBe('submit');
        expect(orderButton.disabled).toBe(true);

        await userEvent.click(orderButton);

        expect(addOrder).toHaveBeenCalledTimes(0);

        const masterChooseButtons = screen.getAllByRole('button', { name: /masterChoose/ });

        await userEvent.click(masterChooseButtons[1]);
        
        await userEvent.click(orderButton);

        expect(addOrder).toHaveBeenCalledTimes(1);
        expect(addOrder).toHaveBeenCalledWith(freeMasters[1].id);
    });
});