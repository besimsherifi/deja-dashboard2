import prismadb from "@/lib/prismadb";
import { ColorForm } from "./components/color-form";

// Function to validate ObjectId format
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

const ColorPage = async ({ params }: { params: { colorId: string } }) => {
  let color = null;

  // Validate colorId to be ObjectId
  if (isValidObjectId(params.colorId) && params.colorId !== "new") {
    color = await prismadb.color.findUnique({
      where: { id: params.colorId },
    });
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
}

export default ColorPage;
