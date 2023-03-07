<?php

namespace App\Nova;

use Laravel\Nova\Fields\ID;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\DateTime;
use Illuminate\Http\Request;
use Laravel\Nova\Http\Requests\NovaRequest;
use Propaganistas\LaravelPhone\PhoneNumber as PhoneNumberHelper;
use Laravel\Nova\Fields\BelongsTo;

class PhoneNumber extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = 'App\PhoneNumber';

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'number';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
    ];

    public static function authorizedToCreate(Request $request)
    {
        return false;
    }
    /**
     * Indicates if the resource should be displayed in the sidebar.
     *
     * @var bool
     */
    // public static $displayInNavigation = false;

    /**
     * Indicates if the resoruce should be globally searchable.
     *
     * @var bool
     */
    public static $globallySearchable = false;

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            ID::make()->sortable(),

            BelongsTo::make('Shindig'),

            Text::make('Number')->displayUsing(function ($number) {
                return PhoneNumberHelper::make($number, 'US')->formatNational();
            }),

            DateTime::make('Provisioned At'),

            DateTime::make('Renews At'),

            DateTime::make('Deleted At'),

        ];
    }

    /**
     * Get the cards available for the request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function cards(Request $request)
    {
        return [];
    }

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

    /**
     * Get the lenses available for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function lenses(Request $request)
    {
        return [];
    }

    /**
     * Get the actions available for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function actions(Request $request)
    {
        return [
            (new Actions\ReleasePhoneNumber)
                ->exceptOnIndex()
                ->showOnTableRow(),
        ];
    }
}
