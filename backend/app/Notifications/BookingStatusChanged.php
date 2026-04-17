<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class BookingStatusChanged extends Notification
{
    use Queueable;

    protected $booking;
    protected $status;

    /**
     * Create a new notification instance.
     */
    public function __construct($booking, $status)
    {
        $this->booking = $booking;
        $this->status = $status;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database'];
    }

    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        $itemName = $this->booking->dress ? $this->booking->dress->name : $this->booking->service->name;
        
        $statusAr = [
            'confirmed' => 'تم قبول طلب حجزكِ',
            'cancelled' => 'تم إلغاء طلب حجزكِ',
            'completed' => 'تم إتمام حجزكِ بنجاح',
        ];

        $message = ($statusAr[$this->status] ?? 'تم تحديث حالة حجزكِ') . " لـ ($itemName).";

        return [
            'booking_id' => $this->booking->id,
            'status' => $this->status,
            'item_name' => $itemName,
            'message' => $message,
            'type' => 'booking_status',
        ];
    }
}
