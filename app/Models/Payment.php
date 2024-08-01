<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    use HasFactory;
    protected $table = 'payments';

    protected $fillable = [
        'payment_amount',
        'description',
        'payment_date',
        'transfer_receipt',
        'header_id',
        'created_by',
        'updated_by',
    ];



    public function headerPayment(){
        return $this->belongsTo(HeaderPayment::class, 'header_id');
    }
}
