<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeaderTransaction extends Model
{
    use HasFactory;

    protected $table = 'header_transactions';

    protected $fillable = [
        'customer_id',
        'total_price',
        'created_at',
        'updated_at',
        'created_by',
        'updated_by',

    ];

    public function transaction(){
        return $this->hasOne(Transaction::class,'header_id','id');
    }
    public function customer(){
        return $this->belongsTo(Customer::class,'customer_id','id');
    }
    public function headerPayment(){
        return $this->hasOne(HeaderPayment::class,'header_transaction_id','id');
    }



}
