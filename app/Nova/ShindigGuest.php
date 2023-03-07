<?php

namespace App\Nova;

use Laravel\Nova\Fields\ID;
use Illuminate\Http\Request;
use Laravel\Nova\Http\Requests\NovaRequest;

class ShindigGuest extends Guest
{

    /**
     * Get the displayable label of the resource.
     *
     * @return string
     */
    public static function label()
    {
        return "Guest";
    }


    /**
     * Indicates if the resource should be displayed in the sidebar.
     *
     * @var bool
     */
    public static $displayInNavigation = false;

    /**
     * Indicates if the resoruce should be globally searchable.
     *
     * @var bool
     */
    public static $globallySearchable = false;

    /**
     * Get the filters available for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function filters(Request $request)
    {
        return [];
    }
}
