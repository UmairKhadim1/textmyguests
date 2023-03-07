<?php

namespace App\Nova;

use Laravel\Nova\Fields\ID;
use Illuminate\Http\Request;
use Laravel\Nova\Fields\Text;
use Laravel\Nova\Fields\Number;
use Laravel\Nova\Fields\Date;
use Laravel\Nova\Fields\Boolean;
use Laravel\Nova\Http\Requests\NovaRequest;
use Laravel\Nova\Fields\BelongsToMany;
use Laravel\Nova\Fields\HasMany;
use App\Nova\Metrics\NewEvents;

class Shindig extends Resource
{
    /**
     * The model the resource corresponds to.
     *
     * @var string
     */
    public static $model = \App\Shindig::class;

    /**
     * The single value that should be used to represent the resource when being displayed.
     *
     * @var string
     */
    public static $title = 'name';



    /**
     * The columns that should be searched.
     *
     * @var array
     */
    public static $search = [
        'id',
        'name',
        'event_date'
    ];

    /**
     * The relationship columns that should be searched.
     *
     * @var array
     */
    public static $searchRelations = [
        'owners' => ['name', 'email'],
        'phoneNumbers' => ['number']
    ];

    /**
     * Get the fields displayed by the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function fields(Request $request)
    {
        return [
            ID::make()->sortable()->onlyOnDetail(),

            Date::make('Event Date')->sortable(),

            Text::make('Name')->sortable(),

            Text::make('Owners', function () {
                $users = $this->owners;
                $html = '<div style="line-height: 1.35; margin: 8px 0px;">';

                foreach ($users as $key => $user) {
                    $html .= $user['email'];
                    if ($key !== count($users) - 1) {
                        $html .= ', <br />';
                    }
                }

                $html .= '</div>';

                return $html;
            })->asHtml(),

            BelongsToMany::make('Owners', 'owners', 'App\Nova\User')->searchable(),

            HasMany::make('Phone Numbers', 'phoneNumbers'),

            Boolean::make('Activated', 'payment_status'),

            Number::make('Paid guest limit', function () {
                return $this->paidGuestLimit();
            }),

            Number::make('Guest count', function () {
                return $this->guestCount();
            }),

            Number::make('Message count', function () {
                return $this->messageCount();
            }),

            Boolean::make('Promotional Message', function () {
                return $this->messages()->where('promotion', 'share50')->exists();
            }),

            Text::make('Amount paid', function () {
                $paid_invoices = $this->invoices->filter(function ($invoice) {
                    return $invoice->paid_amount >= $invoice->total_price;
                });

                $amount = $paid_invoices->sum('paid_amount') / 100;
                return "$ " . number_format((float) $amount, 2, '.', '');
            })->readonly()->textAlign('right'),

            Text::make('Cost estimate', function () {
                $activities = $this->activities;
                $segments_sent = $activities->where('message_id', null)->sum('numSegments');
                $segments_received = $activities->where('message_id', '!==', null)->sum('numSegments');
                $cost = ($segments_sent + $segments_received) * 0.0075;

                return "$ " . number_format((float) $cost, 2, '.', '');
            })->readonly()->textAlign('right'),

            Text::make('Profit', function () {
                // Compute the total amount paid for this shindig
                $paid_invoices = $this->invoices->filter(function ($invoice) {
                    return $invoice->paid_amount >= $invoice->total_price;
                });
                $paid_amount = $paid_invoices->sum('paid_amount') / 100;

                // Estimate the costs of this shindig
                $activities = $this->activities;
                $segments_sent = $activities->where('message_id', null)->sum('numSegments');
                $segments_received = $activities->where('message_id', '!==', null)->sum('numSegments');
                $cost = ($segments_sent + $segments_received) * 0.0075;

                $profit = $paid_amount - $cost;

                return ($profit < 0 ? "- " : "") . "$ "
                    . number_format((float) abs($profit), 2, '.', '');
            })->readonly()->textAlign('right'),
            HasMany::make('Promo Code', 'promoDetails', '\App\Nova\PromoDetails'),
            HasMany::make('Groups', 'groups', '\App\Nova\Group'),
            HasMany::make('Messages', 'messages', '\App\Nova\ShindigMessage'),
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
        return [
            NewEvents::make()
        ];
    }

    /**
     * Get the filters available for the resource.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function filters(Request $request)
    {
        return [
            new Filters\EventDate,
            new Filters\UnactivatedEvents
        ];
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
            (new Actions\ActivateEvent)
                ->exceptOnIndex()
                ->showOnTableRow(),
            (new Actions\IncreaseGuestLimit)
                ->exceptOnIndex()
                ->showOnTableRow()
                ->confirmButtonText('Increase limit'),
            (new Actions\AddPromotionalMessage)
                ->exceptOnIndex()
                ->showOnTableRow(),
            (new Actions\RemovePromotionalMessage)
                ->exceptOnIndex()
                ->showOnTableRow(),
            (new Actions\ProvisionPhoneNumber)
                ->exceptOnIndex()
                ->showOnTableRow(),
            (new Actions\DownloadCSV())
                ->askForWriterType()
                ->withHeadings('#', 'Name', 'Date', 'Owners', 'Paid guest limit', 'Guest count', 'Message count')
        ];
    }
}
