<?php

namespace App\Nova\Filters;

use Illuminate\Http\Request;
use Laravel\Nova\Filters\BooleanFilter;
use Carbon\Carbon;

class EventDate extends BooleanFilter
{
    /**
     * Apply the filter to the given query.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Illuminate\Database\Eloquent\Builder  $query
     * @param  mixed  $value
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function apply(Request $request, $query, $value)
    {
        return $value['hide_past']
            ? $query->whereDate('event_date', '>=', Carbon::now())
            : $query;
    }

    /**
     * Get the filter's available options.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function options(Request $request)
    {
        return [
            'Hide past events' => 'hide_past'
        ];
    }

    /**
     * The default value of the filter.
     *
     * @var string
     */
    public function
    default()
    {
        return ['hide_past' => true];
    }
}
