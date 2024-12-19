import prismadb from "@/lib/prismadb";
import { SizeForm } from "./components/size-form";

// Function to validate ObjectId format
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const SizePage = async ({ params }: { params: { sizeId: string } }) => {
  let size = null;

  // Validate sizeId to be ObjectId
  if (isValidObjectId(params.sizeId) && params.sizeId !== "new") {
    size = await prismadb.size.findUnique({
      where: { id: params.sizeId },
    });
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
}

export default SizePage;
