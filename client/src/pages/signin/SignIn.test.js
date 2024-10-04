// SignIn.test.js
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import SignIn from "./SignIn";
import { login } from "../../services/authServices";
import "@testing-library/jest-dom";

// Mocking the login service
jest.mock("../../services/authServices", () => ({
  login: jest.fn(),
}));

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"), // Keep the original functionalities
  useNavigate: jest.fn(), // Mock the useNavigate hook
}));

describe("SignIn Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders SignIn form correctly", () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    expect(screen.getByLabelText(/Email or phone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByText(/Login/i)).toBeInTheDocument();
    expect(screen.getByText(/Create account/i)).toBeInTheDocument();
  });

  test("email and password inputs should have correct types", () => {
    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    // Find the email input
    const emailInput = screen.getByLabelText(/Email or phone/i);
    // Assert that the input is of type email
    expect(emailInput).toHaveAttribute("id", "email");

    // Find the password input
    const passwordInput = screen.getByLabelText(/Password/i);
    // Assert that the input is of type password
    expect(passwordInput).toHaveAttribute("id", "password");
  });

  test("should show error for unverified user", async () => {
    login.mockResolvedValue({
      status: "error",
      errors: { message: "User is not verified" },
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email or phone/i), {
      target: { value: "waniket48@gmai.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "Aniket@977" },
    });

    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(
        screen.getByText(
          /Please verify your email address first before proceeding./i
        )
      ).toBeInTheDocument();
    });
  });

  test("should show invalid credentials error", async () => {
    login.mockResolvedValue({
      status: "error",
      errors: { message: "Invalid email or password" },
    });

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email or phone/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      const errorMessages = screen.getAllByText(/Invalid email or password/i);
      expect(errorMessages.length).toBe(2);
    });
  });

  test("should navigate to dashboard on successful login", async () => {
    login.mockResolvedValue({
      status: "success",
    });

    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByLabelText(/Email or phone/i), {
      target: { value: "user@example.com" },
    });
    fireEvent.change(screen.getByLabelText(/Password/i), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByText(/Login/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/dashboard");
    });
  });

  test('should redirect to signup page on "Create account" click', async () => {
    const mockNavigate = jest.fn();
    useNavigate.mockReturnValue(mockNavigate);

    render(
      <MemoryRouter>
        <SignIn />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText(/Create account/i));

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/signup");
    });
  });
});
