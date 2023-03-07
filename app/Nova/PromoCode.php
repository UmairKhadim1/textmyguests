<?php

namespace App\Nova;

use Carbon\Carbon;
use Laravel\Nova\Fields\ID;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Select;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Textarea;
use Laravel\Nova\Http\Requests\NovaRequest;
use Epartment\NovaDependencyContainer\NovaDependencyContainer;
use Laravel\Nova\Fields\HasMany;

class PromoCode extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = 'App\Promocode';

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'id';

    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id', 'code', 'type', 'price',
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function fields(Request $request)
    {
        $newdate = Carbon::now()->format('Y-m-d');
        return [
            ID::make()->sortable(),
            Text::make('Code')
                ->sortable()
                ->rules('required', 'max:12', 'min:4')
                ->creationRules('unique:promocodes,code'),

            Textarea::make('Description'),

            Select::make('Type', 'type')->options([
                'fixed' => 'Fixed Price',
                'percentage' => 'Percentage of Price'
            ])->rules('required'),

            NovaDependencyContainer::make([
                Number::make('Price', 'price_fixed')
                    ->rules('required')->min(0)->max(150)
            ])->dependsOn('type', 'fixed'),

            NovaDependencyContainer::make([
                Number::make('Price', 'price_percentage')
                    ->rules('required')->min(0)->max(100)
            ])->dependsOn('type', 'percentage'),
            Text::make('Price')->hideWhenCreating()->hideWhenUpdating()->hideFromDetail(), //this will only show price on main page 
            // Number::make('Price', 'price')
            //     ->rules(function ($request) {
            //         $rules = [];
            //         if ($request->type === 'fixed') {
            //             $rules[0] = 'required';
            //             $rules[1] = 'digits_between:0,100';
            //         } else {
            //             $rules[0] = 'required';
            //             $rules[1] = 'digits_between:0,150';
            //         }
            //         return $rules;
            //     }),

            Number::make('Global Limit')
                ->rules('required', 'gt:user_limit')->min(0)->max(100)->step(1),

            Number::make('User Limit')
                ->rules('required', 'lt:global_limit')->min(0)->max(100)->step(1),

            Date::make('Start Date')
                ->rules('required', 'date', 'after_or_equal:' . $newdate, 'before_or_equal:end_date'),

            Date::make('End Date')
                ->rules('required', 'date', 'after_or_equal:' . $newdate, 'after_or_equal:start_date'),

            HasMany::make('PromoCode USage', 'promoDetails', 'App\Nova\PromoDetails')->hideWhenUpdating()->hideWhenCreating(),
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
        return [];
    }
}
