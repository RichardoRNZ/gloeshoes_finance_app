<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HeaderPayment extends Model
{
    use HasFactory;

    protected $table = 'header_payments';
    protected $fillable = [
        'header_transaction_id',
        'payment_remaining_amount',
        'payment_status',
        'created_by',
        'updated_by',
    ];

    public function payments(){
        return $this->hasMany(Payment::class,'header_id','id');
    }

}
