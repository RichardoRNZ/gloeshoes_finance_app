<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Transaction extends Model
{
    use HasFactory;

    protected $fillable = [
        'order_number',
        'date',
        'status',
        'header_id',
        'created_at',
        'updated_at',

    ];
    public function headerTransaction(){
        return $this->belongsTo(HeaderTransaction::class, 'header_id','id');
    }
    public function detailTransaction(){
        return $this->hasMany(DetailTransaction::class,'transaction_id','id');
    }

    public function payment(){
        return $this->hasMany(Payment::class,'transaction_id','id');
    }

    public function shipment(){
        return $this->hasOne(Shipment::class,'transaction_id','id');
    }
}
