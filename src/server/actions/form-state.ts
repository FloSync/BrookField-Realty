export interface EnquiryFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export const initialEnquiryState: EnquiryFormState = { status: "idle" };

export interface ApplicationFormState {
  status: "idle" | "success" | "error";
  message?: string;
}

export const initialApplicationState: ApplicationFormState = { status: "idle" };
