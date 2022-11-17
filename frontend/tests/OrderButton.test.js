import { render, screen } from "@testing-library/react";
import { OrderButton } from "../src/components/OrderButton/OrderButton";
import userEvent from '@testing-library/user-event';

const buttonTitle = 'Test button';

describe("<OrderButton />", () => {
    test("should render children correctly", () => {
        render(<OrderButton onClick={jest.fn()}>{buttonTitle}</OrderButton>);

        expect(screen.getByText(/Test button/)).toBeInTheDocument();
    });

    test("should call onClick successfully", async () => {
        const callback = jest.fn();

        render(<OrderButton onClick={callback}>{buttonTitle}</OrderButton>);

        expect(callback).not.toHaveBeenCalled();

        await userEvent.click(screen.getByText(/Test button/));

        expect(callback).toHaveBeenCalled();
    });
});