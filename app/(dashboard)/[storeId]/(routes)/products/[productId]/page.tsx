import prismadb from "@/lib/prismadb";
import { ProductForm } from "./components/product-form";

// Function to validate ObjectId format
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const ProductPage = async ({ params }: { params: { productId: string, storeId: string } }) => {
  let product = null;

  // Validate productId and storeId to be ObjectId
  if (isValidObjectId(params.productId) && params.productId !== "new") {
    product = await prismadb.product.findUnique({
      where: { id: params.productId },
      include: { images: true },
    });
  }

  if (!isValidObjectId(params.storeId)) {
    throw new Error("Invalid storeId provided");
  }

  const categories = await prismadb.category.findMany({
    where: { storeId: params.storeId },
  });

  const sizes = await prismadb.size.findMany({
    where: { storeId: params.storeId },
  });

  const colors = await prismadb.color.findMany({
    where: { storeId: params.storeId },
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductForm
          categories={categories}
          colors={colors}
          sizes={sizes}
          initialData={product}
        />
      </div>
    </div>
  );
}

export default ProductPage;