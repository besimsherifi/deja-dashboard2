import prismadb from "@/lib/prismadb";
import { CategoryForm } from "./components/category-form";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

// Function to validate ObjectId format
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const CategoryPage = async ({ params }: { params: { categoryId: string, storeId: string } }) => {
  let category = null;

  // Validate categoryId and storeId to be ObjectId
  if (isValidObjectId(params.categoryId) && params.categoryId !== "new") {
    category = await prismadb.category.findUnique({
      where: { id: params.categoryId },
    });
  }

  if (!isValidObjectId(params.storeId)) {
    throw new Error("Invalid storeId provided");
  }

  const billboards = await prismadb.billboard.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoryForm billboards={billboards} initialData={category} />
        <Heading title="API" description="API Calls for Categories" />
        <Separator />
        <ApiList entityName="categories" entityIdName="categoryId" />
      </div>
    </div>
  );
}

export default CategoryPage;
