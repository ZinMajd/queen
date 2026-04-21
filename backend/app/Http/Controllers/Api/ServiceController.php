<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\Request;

class ServiceController extends Controller
{
    public function index(Request $request)
    {
        $query = Service::query();

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = '%' . $request->search . '%';
            $query->where(function($q) use ($searchTerm) {
                $q->where('name', 'like', $searchTerm)
                  ->orWhere('description', 'like', $searchTerm)
                  ->orWhere('service_type', 'like', $searchTerm);
            });
        }

        if ($request->has('service_type') && !empty($request->service_type)) {
            $type = $request->service_type;
            if ($type === 'كوافير') {
                $query->whereIn('service_type', ['كوافير', 'تجميل ومكياج', 'كوافير ومكياج']);
            } else {
                $query->where('service_type', $type);
            }
        }

        if ($request->has('min_rating')) {
            $query->whereHas('ratings', function($q) use ($request) {
                $q->selectRaw('avg(rating)')->havingRaw('avg(rating) >= ?', [$request->min_rating]);
            });
        }

        $services = $query->latest()->withCount('favorites')->paginate(10);
        return response()->json($services);
    }

    public function show($id)
    {
        $service = Service::withCount('favorites')->findOrFail($id);
        return response()->json($service);
    }
}
