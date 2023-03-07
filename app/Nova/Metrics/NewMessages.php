<?php

namespace App\Nova\Metrics;

use Illuminate\Http\Request;
use Laravel\Nova\Metrics\Value;

class NewMessages extends Value
{
    /**
     * Calculate the value of the metric.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return mixed
     */
    public function calculate(Request $request)
    {
        return $this->count($request, \App\Message::class);
    }
    public function count($request, $model, $column = null, $dateColumn = 'send_at')
    {
        return $this->aggregate($request, $model, 'count', $column, $dateColumn);
    }

    /**
     * Get the ranges available for the metric.
     *
     * @return array
     */
    public function ranges()
    {
        return [
            'TODAY' => 'Today',
            -1 => 'Next 24 Hours',
            -7 => 'Next 7 Days',
            -30 => 'Next 30 Days',
            1 => 'Yesterday',
            7 => 'Last 7 Days',
            30 => 'Previous 30 Days',
            60 => 'Previous 60 Days',
            365 => 'Previous 365 Days',
        ];
    }

    public function name()
    {
        return 'Message Scheduled';
    }

    /**
     * Determine for how many minutes the metric should be cached.
     *
     * @return  \DateTimeInterface|\DateInterval|float|int
     */
    public function cacheFor()
    {
        // return now()->addMinutes(5);
    }

    /**
     * Get the URI key for the metric.
     *
     * @return string
     */
    public function uriKey()
    {
        return 'new-messages';
    }
}
