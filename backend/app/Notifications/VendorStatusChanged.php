<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class VendorStatusChanged extends Notification
{
    use Queueable;

    protected $status;

    /**
     * Create a new notification instance.
     */
    public function __construct($status)
    {
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
        $messages = [
            'active' => 'تهانينا! تم تفعيل حسابكِ كمزود خدمة. يمكنكِ الآن البدء بإضافة خدماتكِ واستقبال الحجوزات.',
            'pending' => 'تم إعادة حسابكِ لحالة قيد المراجعة.',
            'blocked' => 'عذراً، تم حظر حسابكِ مؤقتاً. يرجى التواصل مع الإدارة لمزيد من التفاصيل.',
        ];

        return [
            'status' => $this->status,
            'message' => $messages[$this->status] ?? 'تم تحديث حالة حسابكِ.',
            'type' => 'vendor_status',
        ];
    }
}
