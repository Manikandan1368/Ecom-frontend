export interface Product {
    totalCount: any;
    _id?: string;
    name: string;
    shortDescription: string;
    description: string;
    price: number;
    discount: number;
    images: { image: string; _id: string }[];
    categoryId: string[]; 
    brandId: string[];
    isFeatured?: boolean;
    isNewProduct?: boolean;
}