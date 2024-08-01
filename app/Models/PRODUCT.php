<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $fillable = [
        'name',
        'sku',
        'stock',
        'cost',
        'price',
        'image',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',
    ];
}
