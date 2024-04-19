<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Carbon\Carbon;

class CustomerController extends Controller
{
    //
    public function index()
    {
        return Inertia::render('Home');
    }

    public function getAllCustomer(Request $request)
    {
        // $customers = Customer::all();
        $perPage = $request->query('perPage', 10);
        $page = $request->query('page', 1);
        $query = Customer::query();

        if ($request->filled('search')) {
            $searchTerm = $request->input('search');
            $query->where('name', 'like', "%$searchTerm%")
                ->orWhere('email', 'like', "%$searchTerm%")
                ->orWhere('address', 'like', "%$searchTerm%")
                ->orWhere('instagram', 'like', "%$searchTerm%");
        }
        $customers = $query->paginate($perPage, ['*'], 'page', $page);

        // Mapping customer data
        $customers->getCollection()->transform(function ($item, $key) use ($customers) {
            return [
                'id' => $item->id,
                // numbering each item in page
                'no' => $key + 1 + (($customers->currentPage() - 1) * $customers->perPage()),
                'name' => $item->name,
                'email' => $item->email,
                'address' => $item->address,
                'instagram' => $item->instagram,
                'phoneNumber' => $item->phone_number

            ];
        });
        return response()->json($customers);
    }

    public function getAllCustomerData()
    {
        $customers = Customer::all();
        return response()->json($customers);
    }
    public function createCustomer(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'address' => 'required',
            'phoneNumber' => 'required|numeric',
        ]);

        if ($validator->fails()) {
            $message = implode(" ", $validator->errors()->all());
            return response()->json($message, 400);
        }
        $customers = [
            'name' => $request->name,
            'email' => $request->email,
            'address' => $request->address,
            'instagram' => $request->instagram,
            'phone_number' => "+62" . $request->phoneNumber,
            'created_by' => $request->createdBy,

        ];
        Customer::create($customers);
        return response()->json(['message' => 'Successfully add customer', 'customer' => $customers], 200);

    }

    public function updateCustomer(Request $request)
    {
        $customers = $request->all();

        foreach ($customers as $customer) {
            $validator = Validator::make($customer, [
                'id' => 'required|integer',
                'name' => 'required|string',
                'email' => 'required|email',
                'address' => 'required|string',
                'phoneNumber' => 'required|regex:/^\+(?:[0-9] ?){6,14}[0-9]$/',

            ]);
            if ($validator->fails()) {
                $message = implode(" ", $validator->errors()->all());
                return response()->json($message, 400);
            }

            Customer::where('id', $customer['id'])->update([
                'name' => $customer['name'],
                'email' => $customer['email'],
                'address' => $customer['address'],
                'instagram' => $customer['instagram'],
                'phone_number' => $customer['phoneNumber'],
                'updated_by' => auth()->user()->username,
            ]);


        }

        return response()->json(['message' => 'Successfully update customer', 'customers' => $customers], 200);

    }

    public function deleteCustomer($id)
    {
        $customer = Customer::findOrFail($id);
        $customer->delete();
        return response()->json(['message' => 'Successfully delete customer'], 200);
    }

}
