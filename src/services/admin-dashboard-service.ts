import { getAdminProducts } from "./admin-product-service";
import { getAdminCategories } from "./admin-category-service";
import type { AdminDashboardStats } from "@/types/admin";

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [allProductsRes, availableRes, soldRes, categoriesData] = await Promise.all([
    getAdminProducts({ per_page: 1 }),
    getAdminProducts({ status: "available", per_page: 1 }),
    getAdminProducts({ status: "sold", per_page: 1 }),
    getAdminCategories(),
  ]);

  return {
    total_products: allProductsRes.meta.total,
    available_products: availableRes.meta.total,
    sold_products: soldRes.meta.total,
    total_categories: categoriesData.length,
  };
}
