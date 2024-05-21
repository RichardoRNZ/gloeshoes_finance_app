<?php

namespace App\Http\Controllers;

use App\Exports\ProductExport;
use App\Models\product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Maatwebsite\Excel\Facades\Excel;

class productController extends Controller
{


    private function getStatusOfStock($stock)
    {
        if ($stock == 0) {
            return "Out of stock";
        } else if ($stock < 5) {
            return "Low stock";
        } else {
            return "In stock";
        }
    }
    public function getAllproducts(Request $request)
    {
        $perPage = $request->query('perPage', 10);
        $page = $request->query('page', 1);
        $query = Product::query();

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where('name', 'like', "%$searchTerm%")
                ->orWhere('sku', 'like', "%$searchTerm%");

        }
        if($request->filled('order')){
            $order = $request->input('order');
            $query->orderBy($order[0]['field'], $order[0]['sort']);
        }
        else{
            $query->orderBy('id', 'desc');
        }
        $products = $query->paginate($perPage, ['*'], 'page', $page);

        // Mapping product data
        $products->getCollection()->transform(function ($item, $key) use ($products) {
            return [
                'id' => $item->id,
                // numbering each item in page
                'no' => $key + 1 + (($products->currentPage() - 1) * $products->perPage()),
                'name' => $item->name,
                'sku' => $item->sku,
                'price' => "Rp. " . $item->price,
                'cost' => "Rp. " . $item->cost,
                'stock' => $item->stock,
                'status' => $this->getStatusOfStock($item->stock),
                'image' => "/storage/images/" . $item->image

            ];
        });
        return response()->json($products);
    }

    public function getAllProductsData()
    {
        $products = Product::all();
        return response()->json($products);
    }

    public function createNewProduct(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'sku' => 'required',
            'stock' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:1000',
            'cost' => 'required|numeric|min:1000',
            'image' => 'required|image',
        ]);

        if ($validator->fails()) {
            $message = implode(" ", $validator->errors()->all());
            return response()->json($message, 400);
        }
        $product = [
            'name' => $request->name,
            'sku' => $request->sku,
            'stock' => $request->stock,
            'price' => $request->price,
            'cost' => $request->cost,
            'image' => $this->handleFileUpload($request),
            'created_by' => $request->createdBy
        ];
        Product::create($product);
        return response()->json(['message' => "Successfully add product", 'product' => $product], 200);
    }

    public function getProductById($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }
    private function handleFileUpload(Request $request)
    {
        if ($request->hasFile('image')) {
            $fileObj = $request->file('image');
            $name = $fileObj->getClientOriginalName();
            $ext = $fileObj->getClientOriginalExtension();
            $newFileName = $name . time() . '.' . $ext;
            $fileObj->storeAs('public/images', $newFileName);
            return $newFileName;
        }
        return null;
    }
    public function updateProduct(Request $request)
    {
        // print_r($request);
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'name' => 'required|string',
            'sku' => 'required|string',
            'stock' => 'required|numeric|min:0',
            'price' => 'required|numeric|min:1000',
            'cost' => 'required|numeric|min:1000',
            'image' => 'image'
        ]);

        if ($validator->fails()) {
            $message = implode(" ", $validator->errors()->all());
            return response()->json($message, 400);
        }

        $existingProduct = Product::findOrFail($request->id);


        $existingProduct->update([
            'name' => $request->name,
            'sku' => $request->sku,
            'stock' => $request->stock,
            'price' => $request->price,
            'cost' => $request->cost,
            'image' => $this->handleFileUpload($request) ?: $existingProduct->image,
            'updated_by' => $request->updatedBy,
        ]);

        return response()->json(['message' => 'Successfully update product', 'product' => $existingProduct], 200);
    }


    public function deleteProductById($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();
        return response()->json(['message' => "Successfully delete product"]);
    }

    public function exportProductData(){
        return Excel::download(new ProductExport, "products.xlsx");
    }
}
