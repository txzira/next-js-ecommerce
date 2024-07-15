interface CustomerInfoProps {
  firstName: string;
  lastName: string;
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;
  phone: string;
}

interface CustomerInfoErrorProps {
  firstName?: string;
  lastName?: string;
  streetAddress?: string;
  streetAddress2?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  phone?: string;
}
