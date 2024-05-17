<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class MailService extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    private $customerName;
    private $shippingPrice;
    private $address;
    private $orderId;
    private $total;
    private $paid;
    private $remaining;
    private $paymentStatus;
    private $items;
    private $isEmail;
    public function __construct($customerName, $shippingPrice, $address, $orderId, $total, $paid, $remaining, $paymentStatus, $items, $isEmail)
    {
        $this->customerName = $customerName;
        $this->address = $address;
        $this->paid = $paid;
        $this->orderId = $orderId;
        $this->total = $total;
        $this->shippingPrice = $shippingPrice;
        $this->remaining = $remaining;
        $this->paymentStatus = $paymentStatus;
        $this->items = $items;
        $this->isEmail = $isEmail;

    }

    public function envelope()
    {
        return new Envelope(
            subject: 'Invoice Gloeshoes',
        );
    }

    public function content()
    {
        return new Content(
            view: 'emails.email-template',
            with: [
                'customerName' => $this->customerName,
                'address' => $this->address,
                'orderId' => $this->orderId,
                'total' => $this->total,
                'remaining' => $this->remaining,
                'paymentStatus' => $this->paymentStatus,
                'items' => $this->items,
                'shippingPrice' => $this->shippingPrice,
                'paid' => $this->paid,
                'isEmail' => $this->isEmail,

            ],
        );
    }


    public function attachments()
    {
        return [];
    }
}
