export interface ContactData {
  name: string;
  position: string;
  linkedin: string;
  image?: string | null;
  cv?: string | null;
  email: string;
  accentColor: string | null;
}

export function encodeContactData(data: ContactData): string {
  // Convert the data to a base64 string to handle special characters
  const encoded = btoa(JSON.stringify(data));
  return `?data=${encoded}`;
}

export function decodeContactData(
  searchParams: URLSearchParams
): ContactData | null {
  try {
    const encodedData = searchParams.get("data");
    if (!encodedData) return null;

    const decodedData = JSON.parse(atob(encodedData));
    return { ...decodedData };
  } catch (error) {
    console.error("Error decoding contact data:", error);
    return null;
  }
}
