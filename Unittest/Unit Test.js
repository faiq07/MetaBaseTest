import React from "react";
import SearchResult from "./SearchResult";
import { render, screen, fireEvent } from "@testing-library/react";
import { act } from "react-dom/test-utils";
import ActionForm from "./ActionForm";
import userEvent from "@testing-library/user-event";
import * as Yup from "yup";
import UserProfileForm from "./UserProfileForm";
import { mount } from "enzyme";
import LoginHistoryList from "./LoginHistoryList";

const fakeResult = {
  id: 1,
  name: "Fake Result",
  model: "table",
  moderated_status: "normal",
  getUrl: () => "#",
  getIcon: () => ({ name: "database", size: 20 }),
  description: "This is a fake result",
  context: [{ is_match: true, text: "match" }, { is_match: false, text: "no match" }],
  scores: { score: 1 }
};

const mockLoginHistory = [
  {
    timestamp: "2022-04-30T12:34:56Z",
    location: "San Francisco, CA",
    ip_address: "127.0.0.1",
    device_description: "Chrome on Mac",
    active: true,
    timezone: "America/Los_Angeles",
  },
];

describe("SearchResult", () => {
  test("renders name and description", () => {
    render(<SearchResult result={fakeResult} />);
    const name = screen.getByTestId("search-result-item-name");
    const description = screen.getByText(fakeResult.description);
    expect(name).toBeInTheDocument();
    expect(description).toBeInTheDocument();
  });

  test("renders context with matched text", () => {
    render(<SearchResult result={fakeResult} />);
    const context = screen.getByText("match");
    expect(context).toHaveStyle(`color: ${COLOR_BRAND}`);
  });

  test("renders an active icon", () => {
    render(<SearchResult result={fakeResult} />);
    const icon = screen.getByLabelText(`Active ${fakeResult.model}`);
    expect(icon).toHaveStyle(`color: ${COLOR_BRAND}`);
  });

  test("renders a loading spinner if not synced", () => {
    const loadingResult = { ...fakeResult, model: "table" };
    render(<SearchResult result={loadingResult} />);
    const spinner = screen.getByRole("progressbar");
    expect(spinner).toBeInTheDocument();
  });
});


describe("ActionForm", () => {
  const onSubmitMock = jest.fn();

  const initialValues = {
    parameter1: "initialValue1",
    parameter2: "initialValue2",
  };

  const action = {
    id: 1,
    name: "Test Action",
    parameters: [
      {
        id: "parameter1",
        name: "Parameter 1",
        type: "string",
      },
      {
        id: "parameter2",
        name: "Parameter 2",
        type: "string",
      },
    ],
  };

  test("renders form fields and submit button", () => {
    render(
      <ActionForm
        action={action}
        initialValues={initialValues}
        onSubmit={onSubmitMock}
      />
    );

    expect(screen.getByLabelText("Parameter 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Parameter 2")).toBeInTheDocument();
    expect(screen.getByText("Submit")).toBeInTheDocument();
  });

  test("submits form values when submit button is clicked", async () => {
    render(
      <ActionForm
        action={action}
        initialValues={initialValues}
        onSubmit={onSubmitMock}
      />
    );

    await act(async () => {
      fireEvent.change(screen.getByLabelText("Parameter 1"), {
        target: { value: "newValue1" },
      });
      fireEvent.change(screen.getByLabelText("Parameter 2"), {
        target: { value: "newValue2" },
      });

      fireEvent.click(screen.getByText("Submit"));
    });

    expect(onSubmitMock).toHaveBeenCalledWith(
      {
        parameter1: "newValue1",
        parameter2: "newValue2",
      },
      expect.any(Object)
    );
  });

  test("cancels the form when cancel button is clicked", async () => {
    const onCloseMock = jest.fn();

    render(
      <ActionForm
        action={action}
        initialValues={initialValues}
        onSubmit={onSubmitMock}
        onClose={onCloseMock}
      />
    );

    fireEvent.click(screen.getByText("Cancel"));

    expect(onCloseMock).toHaveBeenCalled();
  });
});


describe("UserProfileForm", () => {
  const user = {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@example.com",
    locale: "en",
  };

  const locales = [
    { value: "en", name: "English" },
    { value: "fr", name: "French" },
  ];

  const onSubmit = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  test("renders without errors", () => {
    render(
      <UserProfileForm
        user={user}
        locales={locales}
        isSsoUser={false}
        onSubmit={onSubmit}
      />
    );
  });

  test("submits the form with the correct data", async () => {
    const { getByRole } = render(
      <UserProfileForm
        user={user}
        locales={locales}
        isSsoUser={false}
        onSubmit={onSubmit}
      />
    );

    // Enter new user data
    const firstNameInput = getByRole("textbox", { name: /first name/i });
    userEvent.clear(firstNameInput);
    userEvent.type(firstNameInput, "Jane");

    const lastNameInput = getByRole("textbox", { name: /last name/i });
    userEvent.clear(lastNameInput);
    userEvent.type(lastNameInput, "Doe");

    const emailInput = getByRole("textbox", { name: /email/i });
    userEvent.clear(emailInput);
    userEvent.type(emailInput, "jane.doe@example.com");

    const localeSelect = getByRole("combobox", { name: /language/i });
    fireEvent.change(localeSelect, { target: { value: "fr" } });

    // Submit the form
    const submitButton = getByRole("button", { name: /update/i });
    userEvent.click(submitButton);

    // Expect the form to be submitted with the correct data
    await expect(onSubmit).toHaveBeenCalledWith(
      {
        ...user,
        first_name: "Jane",
        last_name: "Doe",
        email: "jane.doe@example.com",
        locale: "fr",
      },
      Yup.object().shape({
        first_name: Yup.string()
          .nullable()
          .default(null)
          .max(100, "is too long")
          .required("is a required field"),
        last_name: Yup.string()
          .nullable()
          .default(null)
          .max(100, "is too long")
          .required("is a required field"),
        email: Yup.string()
          .required("is a required field")
          .email("must be a valid email"),
        locale: Yup.string().nullable().default(null),
      })
    );
  });
});

describe("LoginHistoryList", () => {
  it("renders a login history item", () => {
    const wrapper = mount(<LoginHistoryList loginHistory={mockLoginHistory} />);
    expect(wrapper.find("LoginHistoryItem").length).toEqual(1);
  });

  it("renders an empty state when there is no login history", () => {
    const wrapper = mount(<LoginHistoryList loginHistory={[]} />);
    expect(wrapper.find("EmptyState").length).toEqual(1);
  });
});


