<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shipment extends Model
{
    use HasFactory;
    protected $table = 'shipments';
    protected $fillable = [
        'name',
        'price',
        'receipt_number',
        'shipping_address',
        'transaction_id',
        'created_by',
        'updated_by',

    ];
    public function transaction(){
        return $this->belongsTo(Transaction::class, 'transaction_id','id');
    }

}
