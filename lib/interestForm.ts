const INTEREST_FORM_BASE_URL = "https://docs.google.com/forms/d/e/1FAIpQLSfPLACEHOLDER/viewform";
const INTEREST_SCHOOL_FIELD_ID = "entry.2005620554";

export function buildSchoolInterestFormUrl(schoolName: string) {
  const params = new URLSearchParams({
    usp: "pp_url",
    [INTEREST_SCHOOL_FIELD_ID]: schoolName,
  });
  return `${INTEREST_FORM_BASE_URL}?${params.toString()}`;
}

export const schoolInterestFormConfig = {
  baseUrl: INTEREST_FORM_BASE_URL,
  schoolFieldId: INTEREST_SCHOOL_FIELD_ID,
};
