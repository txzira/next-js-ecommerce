import {
  Product,
  ProductImage,
  ProductVariant,
  ProductVariantAttribute,
  Attribute,
  ProductVariantImage,
  AttributeImage,
  AttributeGroup,
  Brand,
  Category,
} from "@prisma/client";

// interface ProductProps extends Product {
//   brand: Brand;
//   images: Array<ProductImage>;
//   attributeGroups: Array<
//     AttributeGroup & {
//       attributes: Array<
//         Attribute & {
//           images: Array<AttributeImage>;
//         }
//       >;
//     }
//   >;
//   productVariants: Array<
//     ProductVariant & {
//       productVariantAttributes: Array<
//         ProductVariantAttribute & {
//           attribute: Attribute;
//         }
//       >;
//       variantImages: Array<ProductVariantImage>;
//     }
//   >;
// }

interface ProductProps extends Product {
  // id: number;
  // name: string;
  // price: number;
  brand: Brand | null;
  // description: string | undefined;
  // sku: string | undefined;
  // quantity: number;
  // slug: string;
  // active: boolean;
  // available: boolean;
  // managedStock: boolean;
  categories?: Category[];
  images:
    | (ImageProps & {
        productId: number;
      })[]
    | null;
  productVariants: Array<ProductVariantProps>;
  attributeGroups: Array<AttributeGroupProps>;
}

interface ProductVariantProps extends ProductVariant {
  // id: number;
  // productId?: number;
  // price?: number;
  // quantity?: number;
  // available?: boolean;
  productVariantAttributes: Array<ProductVariantAttributeProps>;
  variantImages?: Array<{ url: string }> | Array<ProductVariantImage>;
  // sku?: string;
  // description?: string;
}

interface ProductVariantAttributeProps {
  id: number;
  productVariantId: number;
  attibuteGroupId: number;
  attributeId: number;
  attribute: AttributeProps;
  attributeGroup?: AttributeGroupProps;
}

interface AttributeGroupProps extends AttributeGroup {
  id?: number;
  name: string;
  productId?: number;
  attributes?: Array<AttributeProps>;
}

interface AttributeProps {
  id?: number;
  name: string;
  attributeGroupId?: number;
  images?: Array<
    ImageProps & {
      attributeId?: number;
    }
  >;
}

interface ImageProps {
  id?: number;
  url: string;
  publicId?: string;
  position?: number;
}

export interface CartItemProps {
  id: string;
  productId: number;
  productName: string;
  variantName?: string;
  quantity: number;
  price: number;
  image: string;
  variant: CartItemVariantProps | undefined;
}

interface CartItemVariantProps {
  id?: number;
  productVariantAttributes: Array<ProductVariantAttributeProps>;
}
