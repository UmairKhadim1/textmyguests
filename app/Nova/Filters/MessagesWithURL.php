<?php

namespace App\Nova\Filters;

use Illuminate\Http\Request;
use Laravel\Nova\Filters\BooleanFilter;

class MessagesWithURL extends BooleanFilter
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
        $regexp = '(https?:\/\/|www\.)[\.A-Za-z0-9\-]+\.[a-zA-Z]{2,7}';

        return $value['with_url']
            ? $query->where('contents', 'regexp', $regexp)->whereNull('promotion')
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
            'Messages with URL' => 'with_url'
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
        return ['with_url' => true];
    }
}
