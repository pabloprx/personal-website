export interface ContactData {
  name: string;
  position: string;
  linkedin: string;
  image: string | null;
  cv: string | null;
  email: string;
  accentColor: string | null;
}

export function encodeContactData(data: ContactData): string {
  // Convert the data to a base64 string to handle special characters
  const encoded = btoa(JSON.stringify(data));
  return `?data=${encoded}`;
}

export function decodeContactData(searchParams: URLSearchParams): ContactData {
  const defaultData: ContactData = {
    name: "Pablo Pérez",
    position: "Software Developer",
    linkedin: "https://www.linkedin.com/in/ppmoya/",
    image: "https://pub-c17e57a68da04453b6f94a6907095f48.r2.dev/me.png",
    cv: "https://pub-c17e57a68da04453b6f94a6907095f48.r2.dev/contract_%20(31).pdf",
    email: "ppmoya08@gmail.com",
    accentColor: null,
  };

  try {
    const encodedData = searchParams.get("data");
    if (!encodedData) return defaultData;

    const decodedData = JSON.parse(atob(encodedData));
    return { ...defaultData, ...decodedData };
  } catch (error) {
    console.error("Error decoding contact data:", error);
    return defaultData;
  }
}
